import { Router, type Request, type Response } from 'express';

import { calcularStatusMaterial } from '../lib/materiais-status';
import { parseId, parseISODateInput, serializeDate } from '../lib/http';
import { prisma } from '../lib/prisma';

const router = Router();

function serializeManutencao(m: {
  id: number;
  cliente_id: number;
  descricao: string;
  data: Date;
  created_at: Date;
  clientes: { id: number; nome: string | null };
  itens: {
    id: number;
    quantidade: number;
    materiais: { id: number; nome: string; unidade: string };
  }[];
}) {
  return {
    id: m.id,
    clienteId: m.cliente_id,
    clienteNome: m.clientes.nome?.trim() || 'Sem nome',
    descricao: m.descricao,
    data: serializeDate(m.data) ?? m.data.toISOString(),
    createdAt: m.created_at.toISOString(),
    itens: m.itens.map((i) => ({
      id: i.id,
      materialId: i.materiais.id,
      materialNome: i.materiais.nome,
      unidade: i.materiais.unidade,
      quantidade: i.quantidade,
    })),
  };
}

router.get('/', async (req: Request, res: Response) => {
  const mesRaw = typeof req.query.mes === 'string' ? req.query.mes : undefined;

  try {
    let where: { data?: { gte: Date; lte: Date } } = {};

    if (mesRaw && /^\d{4}-\d{2}$/.test(mesRaw)) {
      const [year, month] = mesRaw.split('-').map(Number);
      where = {
        data: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0, 23, 59, 59, 999),
        },
      };
    }

    const manutencoes = await prisma.manutencoes.findMany({
      where,
      include: {
        clientes: { select: { id: true, nome: true } },
        itens: {
          include: {
            materiais: { select: { id: true, nome: true, unidade: true } },
          },
        },
      },
      orderBy: [{ data: 'desc' }, { id: 'desc' }],
    });

    res.json(manutencoes.map(serializeManutencao));
  } catch (error) {
    console.error('[GET /manutencoes]', error);
    res.status(500).json({ error: 'Erro ao listar manutenções.' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as {
    clienteId?: number;
    descricao?: string;
    data?: string;
    itens?: { materialId?: number; quantidade?: number }[];
  };

  const clienteId = Number(body.clienteId);
  const descricao = body.descricao?.trim();
  const itens = body.itens ?? [];

  if (!Number.isFinite(clienteId) || clienteId <= 0) {
    res.status(400).json({ error: 'Selecione um cliente válido.' });
    return;
  }
  if (!descricao) {
    res.status(400).json({ error: 'Informe a descrição da manutenção.' });
    return;
  }
  if (itens.length === 0) {
    res.status(400).json({ error: 'Adicione pelo menos um material.' });
    return;
  }

  for (const item of itens) {
    const qtd = Number(item.quantidade);
    if (!Number.isFinite(item.materialId) || !Number.isFinite(qtd) || qtd <= 0) {
      res.status(400).json({ error: 'Cada material deve ter quantidade maior que zero.' });
      return;
    }
  }

  const data = parseISODateInput(body.data) ?? new Date();

  try {
    const manutencao = await prisma.$transaction(async (tx: typeof prisma) => {
      const cliente = await tx.clientes.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error('CLIENTE_NAO_ENCONTRADO');
      }

      const materiaisIds = itens.map((i) => Number(i.materialId));
      const materiaisDb = await tx.materiais.findMany({
        where: { id: { in: materiaisIds } },
      });

      if (materiaisDb.length !== materiaisIds.length) {
        throw new Error('MATERIAL_NAO_ENCONTRADO');
      }

      type MaterialRow = (typeof materiaisDb)[number];
      const mapaMateriais = new Map<number, MaterialRow>(
        materiaisDb.map((m: MaterialRow) => [m.id, m]),
      );

      for (const item of itens) {
        const material = mapaMateriais.get(Number(item.materialId));
        if (!material) continue;
        const qtd = Number(item.quantidade);
        if (material.quantidade < qtd) {
          throw new Error(
            `ESTOQUE_INSUFICIENTE:${material.nome}:${material.quantidade}:${qtd}`,
          );
        }
      }

      const created = await tx.manutencoes.create({
        data: {
          cliente_id: clienteId,
          descricao,
          data,
          itens: {
            create: itens.map((item) => ({
              material_id: Number(item.materialId),
              quantidade: Number(item.quantidade),
            })),
          },
        },
        include: {
          clientes: { select: { id: true, nome: true } },
          itens: {
            include: {
              materiais: { select: { id: true, nome: true, unidade: true } },
            },
          },
        },
      });

      for (const item of itens) {
        const materialId = Number(item.materialId);
        const qtd = Number(item.quantidade);
        const material = mapaMateriais.get(materialId);
        if (!material) continue;
        const novaQtd = material.quantidade - qtd;
        await tx.materiais.update({
          where: { id: materialId },
          data: {
            quantidade: novaQtd,
            status: calcularStatusMaterial(novaQtd, material.estoque_minimo),
            updated_at: new Date(),
          },
        });
      }

      return created;
    });

    res.status(201).json(serializeManutencao(manutencao));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'CLIENTE_NAO_ENCONTRADO') {
        res.status(404).json({ error: 'Cliente não encontrado.' });
        return;
      }
      if (error.message === 'MATERIAL_NAO_ENCONTRADO') {
        res.status(400).json({ error: 'Um ou mais materiais não foram encontrados.' });
        return;
      }
      if (error.message.startsWith('ESTOQUE_INSUFICIENTE:')) {
        const [, nome, disp, ped] = error.message.split(':');
        res.status(400).json({
          error: `Estoque insuficiente de "${nome}". Disponível: ${disp}, solicitado: ${ped}.`,
        });
        return;
      }
    }
    console.error('[POST /manutencoes]', error);
    res.status(500).json({ error: 'Erro ao registrar manutenção.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const manutencao = await prisma.manutencoes.findUnique({
      where: { id },
      include: {
        clientes: { select: { id: true, nome: true } },
        itens: {
          include: {
            materiais: { select: { id: true, nome: true, unidade: true } },
          },
        },
      },
    });

    if (!manutencao) {
      res.status(404).json({ error: 'Manutenção não encontrada.' });
      return;
    }

    res.json(serializeManutencao(manutencao));
  } catch (error) {
    console.error('[GET /manutencoes/:id]', error);
    res.status(500).json({ error: 'Erro ao buscar manutenção.' });
  }
});

export default router;
