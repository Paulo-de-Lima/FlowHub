import { Router, type Request, type Response } from 'express';

import { parseISODateInput, parseId, serializeDate, serializeDecimal } from '../lib/http';
import { prisma } from '../lib/prisma';

const router = Router();

function parseMesParam(raw: unknown): { inicio: Date; fim: Date; label: string } {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (typeof raw === 'string' && /^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split('-').map(Number);
    year = y;
    month = m;
  }

  const inicio = new Date(year, month - 1, 1);
  const fim = new Date(year, month, 0, 23, 59, 59, 999);
  const label = `${year}-${String(month).padStart(2, '0')}`;
  return { inicio, fim, label };
}

function serializeLancamento(d: {
  id: number;
  data_gasto: Date;
  origem: string;
  tipo: 'receita' | 'despesa';
  valor: unknown;
  total: unknown;
  material_id: number | null;
}) {
  const automatico = d.material_id != null || d.origem.startsWith('Compra de material:');
  return {
    id: d.id,
    dataGasto: serializeDate(d.data_gasto),
    origem: d.origem,
    tipo: d.tipo,
    valor: serializeDecimal(d.valor),
    total: serializeDecimal(d.total),
    materialId: d.material_id,
    automatico,
  };
}

router.get('/resumo', async (req: Request, res: Response) => {
  const { inicio, fim, label } = parseMesParam(req.query.mes);

  try {
    const lancamentos = await prisma.despesas.findMany({
      where: { data_gasto: { gte: inicio, lte: fim } },
    });

    let receitas = 0;
    let despesas = 0;
    for (const l of lancamentos) {
      const v = serializeDecimal(l.valor);
      if (l.tipo === 'receita') receitas += v;
      else despesas += v;
    }

    res.json({
      mes: label,
      receitas,
      despesas,
      saldo: receitas - despesas,
    });
  } catch (error) {
    console.error('[GET /financeiro/resumo]', error);
    res.status(500).json({ error: 'Erro ao carregar resumo financeiro.' });
  }
});

router.get('/lancamentos', async (req: Request, res: Response) => {
  const mesRaw = req.query.mes;
  const tipoRaw = typeof req.query.tipo === 'string' ? req.query.tipo : 'todos';
  const buscaRaw = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
  const limit = Math.min(Number(req.query.limit) || 200, 500);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  try {
    const where: {
      data_gasto?: { gte: Date; lte: Date };
      tipo?: 'receita' | 'despesa';
      origem?: { contains: string };
    } = {};

    if (typeof mesRaw === 'string' && mesRaw.trim()) {
      const { inicio, fim } = parseMesParam(mesRaw);
      where.data_gasto = { gte: inicio, lte: fim };
    }

    if (tipoRaw === 'receita' || tipoRaw === 'despesa') {
      where.tipo = tipoRaw;
    }

    if (buscaRaw) {
      where.origem = { contains: buscaRaw };
    }

    const [total, items] = await Promise.all([
      prisma.despesas.count({ where }),
      prisma.despesas.findMany({
        where,
        orderBy: [{ data_gasto: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
    ]);

    res.json({
      total,
      lancamentos: items.map(serializeLancamento),
    });
  } catch (error) {
    console.error('[GET /financeiro/lancamentos]', error);
    res.status(500).json({ error: 'Erro ao listar registros.' });
  }
});

router.post('/lancamentos', async (req: Request, res: Response) => {
  const body = req.body as {
    tipo?: 'receita' | 'despesa';
    origem?: string;
    valor?: number;
    dataGasto?: string;
  };

  const tipo = body.tipo;
  const origem = body.origem?.trim();
  const valor = Number(body.valor);

  if (tipo !== 'receita' && tipo !== 'despesa') {
    res.status(400).json({ error: 'Tipo inválido. Use receita ou despesa.' });
    return;
  }
  if (!origem) {
    res.status(400).json({ error: 'Informe a origem do registro.' });
    return;
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    res.status(400).json({ error: 'Valor deve ser maior que zero.' });
    return;
  }

  const dataGasto = parseISODateInput(body.dataGasto) ?? new Date();

  try {
    const lancamento = await prisma.despesas.create({
      data: {
        tipo,
        origem,
        valor,
        total: valor,
        data_gasto: dataGasto,
      },
    });

    res.status(201).json(serializeLancamento(lancamento));
  } catch (error) {
    console.error('[POST /financeiro/lancamentos]', error);
    res.status(500).json({ error: 'Erro ao criar registro.' });
  }
});

function isAutomaticoLancamento(d: { material_id: number | null; origem: string }) {
  return d.material_id != null || d.origem.startsWith('Compra de material:');
}

router.put('/lancamentos/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as {
    tipo?: 'receita' | 'despesa';
    origem?: string;
    valor?: number;
    dataGasto?: string;
  };

  try {
    const atual = await prisma.despesas.findUnique({ where: { id } });
    if (!atual) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }

    if (isAutomaticoLancamento(atual)) {
      res.status(403).json({ error: 'Registros automáticos não podem ser editados.' });
      return;
    }

    const tipo = body.tipo ?? atual.tipo;
    const origem = body.origem?.trim() ?? atual.origem;
    const valor = body.valor != null ? Number(body.valor) : serializeDecimal(atual.valor);

    if (tipo !== 'receita' && tipo !== 'despesa') {
      res.status(400).json({ error: 'Tipo inválido. Use receita ou despesa.' });
      return;
    }
    if (!origem) {
      res.status(400).json({ error: 'Informe a origem do registro.' });
      return;
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      res.status(400).json({ error: 'Valor deve ser maior que zero.' });
      return;
    }

    const dataGasto =
      body.dataGasto != null ? (parseISODateInput(body.dataGasto) ?? atual.data_gasto) : atual.data_gasto;

    const lancamento = await prisma.despesas.update({
      where: { id },
      data: {
        tipo,
        origem,
        valor,
        total: valor,
        data_gasto: dataGasto,
        updated_at: new Date(),
      },
    });

    res.json(serializeLancamento(lancamento));
  } catch (error) {
    console.error('[PUT /financeiro/lancamentos/:id]', error);
    res.status(500).json({ error: 'Erro ao atualizar registro.' });
  }
});

router.delete('/lancamentos/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const atual = await prisma.despesas.findUnique({ where: { id } });
    if (!atual) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }

    if (isAutomaticoLancamento(atual)) {
      res.status(403).json({ error: 'Registros automáticos não podem ser excluídos.' });
      return;
    }

    await prisma.despesas.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('[DELETE /financeiro/lancamentos/:id]', error);
    res.status(500).json({ error: 'Erro ao excluir registro.' });
  }
});

export default router;
