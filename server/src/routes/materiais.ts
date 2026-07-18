import { Router, type Request, type Response } from 'express';

import { calcularStatusMaterial, serializeMaterial } from '../lib/materiais-status';
import { parseId, parseISODateInput, serializeDate, serializeDecimal } from '../lib/http';
import { prisma } from '../lib/prisma';

const router = Router();

function parseStatusFilter(raw: unknown): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
}

router.get('/', async (req: Request, res: Response) => {
  const statuses = parseStatusFilter(req.query.status);

  try {
    const materiais = await prisma.materiais.findMany({
      where:
        statuses.length > 0
          ? { status: { in: statuses as ('VAZIO' | 'BAIXO' | 'ALTO')[] } }
          : undefined,
      orderBy: [{ status: 'asc' }, { nome: 'asc' }],
    });

    res.json(materiais.map(serializeMaterial));
  } catch (error) {
    console.error('[GET /materiais]', error);
    res.status(500).json({ error: 'Erro ao listar materiais.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const material = await prisma.materiais.findUnique({ where: { id } });
    if (!material) {
      res.status(404).json({ error: 'Material não encontrado.' });
      return;
    }
    res.json(serializeMaterial(material));
  } catch (error) {
    console.error('[GET /materiais/:id]', error);
    res.status(500).json({ error: 'Erro ao buscar material.' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as {
    nome?: string;
    unidade?: string;
    quantidade?: number;
    estoqueMinimo?: number;
  };

  const nome = body.nome?.trim();
  if (!nome) {
    res.status(400).json({ error: 'Informe o nome do material.' });
    return;
  }

  const quantidade = Number(body.quantidade ?? 0);
  const estoqueMinimo = Number(body.estoqueMinimo ?? 5);

  try {
    const material = await prisma.materiais.create({
      data: {
        nome,
        unidade: body.unidade?.trim() || 'un',
        quantidade: Math.max(0, quantidade),
        estoque_minimo: estoqueMinimo > 0 ? estoqueMinimo : 5,
        status: calcularStatusMaterial(Math.max(0, quantidade), estoqueMinimo > 0 ? estoqueMinimo : 5),
      },
    });
    res.status(201).json(serializeMaterial(material));
  } catch (error) {
    console.error('[POST /materiais]', error);
    res.status(500).json({ error: 'Erro ao criar material.' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as {
    nome?: string;
    unidade?: string;
    quantidade?: number;
    estoqueMinimo?: number;
  };

  try {
    const atual = await prisma.materiais.findUnique({ where: { id } });
    if (!atual) {
      res.status(404).json({ error: 'Material não encontrado.' });
      return;
    }

    const quantidade = body.quantidade != null ? Math.max(0, Number(body.quantidade)) : atual.quantidade;
    const estoqueMinimo =
      body.estoqueMinimo != null ? Math.max(1, Number(body.estoqueMinimo)) : atual.estoque_minimo;

    const material = await prisma.materiais.update({
      where: { id },
      data: {
        nome: body.nome?.trim() || atual.nome,
        unidade: body.unidade?.trim() || atual.unidade,
        quantidade,
        estoque_minimo: estoqueMinimo,
        status: calcularStatusMaterial(quantidade, estoqueMinimo),
        updated_at: new Date(),
      },
    });

    res.json(serializeMaterial(material));
  } catch (error) {
    console.error('[PATCH /materiais/:id]', error);
    res.status(500).json({ error: 'Erro ao atualizar material.' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    await prisma.materiais.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('[DELETE /materiais/:id]', error);
    res.status(500).json({ error: 'Erro ao excluir material. Verifique se há manutenções vinculadas.' });
  }
});

router.post('/compra', async (req: Request, res: Response) => {
  const body = req.body as {
    nome?: string;
    unidade?: string;
    quantidade?: number;
    valorTotal?: number;
    dataCompra?: string;
  };

  const nome = body.nome?.trim();
  const quantidade = Number(body.quantidade);
  const valorTotal = Number(body.valorTotal);

  if (!nome) {
    res.status(400).json({ error: 'Informe o nome do material.' });
    return;
  }
  if (!Number.isFinite(quantidade) || quantidade <= 0) {
    res.status(400).json({ error: 'Quantidade deve ser maior que zero.' });
    return;
  }
  if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
    res.status(400).json({ error: 'Valor total deve ser maior que zero.' });
    return;
  }

  const dataCompra = parseISODateInput(body.dataCompra) ?? new Date();
  const unidade = body.unidade?.trim() || 'un';

  try {
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      const existentes = await tx.materiais.findMany();
      const existente = existentes.find((m: (typeof existentes)[number]) => m.nome.toLowerCase() === nome.toLowerCase());

      let material;
      if (existente) {
        const novaQtd = existente.quantidade + quantidade;
        material = await tx.materiais.update({
          where: { id: existente.id },
          data: {
            quantidade: novaQtd,
            unidade: unidade || existente.unidade,
            status: calcularStatusMaterial(novaQtd, existente.estoque_minimo),
            updated_at: new Date(),
          },
        });
      } else {
        material = await tx.materiais.create({
          data: {
            nome,
            unidade,
            quantidade,
            estoque_minimo: 5,
            status: calcularStatusMaterial(quantidade, 5),
          },
        });
      }

      const origem = `Compra de material: ${material.nome}`;
      const despesa = await tx.despesas.create({
        data: {
          data_gasto: dataCompra,
          origem,
          tipo: 'despesa',
          valor: valorTotal,
          total: valorTotal,
          material_id: material.id,
        },
      });

      return { material, despesa };
    });

    res.status(201).json({
      material: serializeMaterial(result.material),
      despesa: {
        id: result.despesa.id,
        origem: result.despesa.origem,
        valor: serializeDecimal(result.despesa.valor),
        dataGasto: serializeDate(result.despesa.data_gasto),
      },
    });
  } catch (error) {
    console.error('[POST /materiais/compra]', error);
    res.status(500).json({ error: 'Erro ao registrar compra de material.' });
  }
});

export default router;
