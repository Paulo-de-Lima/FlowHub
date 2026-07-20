import { Router, type Request, type Response } from 'express';

import { calcularDeveLeitura, deveDiverge } from '../lib/calcular-deve-leitura';
import { isForeignKeyError, isNotFoundError, parseDateInput, parseId, serializeDecimal } from '../lib/http';
import { normalizarPagamento } from '../lib/registro-pagamento';
import { prisma } from '../lib/prisma';

const router = Router();

type MesaBody = {
  numeracao?: string;
  valor_ficha?: number;
};

type RegistroBody = {
  data_leitura?: string;
  leitura?: number;
  deve?: number;
  valor_pago?: number;
  pago?: boolean;
};

function mapRegistro(reg: {
  id: number;
  mesa_id: number;
  data_leitura: Date;
  leitura: number;
  deve: unknown;
  valor_pago: unknown;
  pago: boolean;
}) {
  const pagamento = normalizarPagamento(reg.deve, reg.valor_pago);
  return {
    id: reg.id,
    mesa_id: reg.mesa_id,
    data_leitura: reg.data_leitura,
    leitura: reg.leitura,
    deve: pagamento.deve,
    valor_pago: pagamento.valor_pago,
    saldo: pagamento.saldo,
    pago: pagamento.pago,
  };
}

function mapMesa(mesa: {
  id: number;
  cliente_id: number;
  numeracao: string;
  valor_ficha: unknown;
  registros_mesa: {
    id: number;
    mesa_id: number;
    data_leitura: Date;
    leitura: number;
    deve: unknown;
    valor_pago: unknown;
    pago: boolean;
  }[];
}) {
  const registros = mesa.registros_mesa.map(mapRegistro);
  const totalDeve = registros.reduce((s, r) => s + r.saldo, 0);
  const totalPago = registros.reduce((s, r) => s + r.valor_pago, 0);

  return {
    id: mesa.id,
    cliente_id: mesa.cliente_id,
    numeracao: mesa.numeracao,
    valor_ficha: serializeDecimal(mesa.valor_ficha),
    registros,
    totalDeve,
    totalPago,
  };
}

function parseValorFicha(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return null;
  return num;
}

async function getLeituraAnterior(mesaId: number, excluirId?: number) {
  const anterior = await prisma.registros_mesa.findFirst({
    where: {
      mesa_id: mesaId,
      ...(excluirId != null ? { id: { not: excluirId } } : {}),
    },
    orderBy: [{ data_leitura: 'desc' }, { id: 'desc' }],
    select: { leitura: true },
  });
  return anterior?.leitura ?? null;
}

type DbClient = Pick<typeof prisma, 'registros_mesa'>;

async function getLeituraAnteriorParaRegistro(
  mesaId: number,
  excluirId: number,
  dataLeitura: Date,
  registroId: number,
  db: DbClient = prisma,
) {
  const anterior = await db.registros_mesa.findFirst({
    where: {
      mesa_id: mesaId,
      id: { not: excluirId },
      OR: [
        { data_leitura: { lt: dataLeitura } },
        { data_leitura: dataLeitura, id: { lt: registroId } },
      ],
    },
    orderBy: [{ data_leitura: 'desc' }, { id: 'desc' }],
    select: { leitura: true },
  });
  return anterior?.leitura ?? null;
}

async function recalcularRegistrosPosteriores(
  mesaId: number,
  valorFicha: number,
  afterData: Date,
  afterId: number,
  leituraAnteriorBase: number | null,
  db: DbClient = prisma,
) {
  const posteriores = await db.registros_mesa.findMany({
    where: {
      mesa_id: mesaId,
      OR: [
        { data_leitura: { gt: afterData } },
        { data_leitura: afterData, id: { gt: afterId } },
      ],
    },
    orderBy: [{ data_leitura: 'asc' }, { id: 'asc' }],
  });

  let leituraAnterior = leituraAnteriorBase;
  for (const reg of posteriores) {
    const deveCalc = calcularDeveLeitura(reg.leitura, leituraAnterior, valorFicha);
    const valorPagoAtual = serializeDecimal(reg.valor_pago);
    const pagamento = normalizarPagamento(deveCalc, Math.min(valorPagoAtual, deveCalc));
    await db.registros_mesa.update({
      where: { id: reg.id },
      data: {
        deve: pagamento.deve,
        valor_pago: pagamento.valor_pago,
        pago: pagamento.pago,
      },
    });
    leituraAnterior = reg.leitura;
  }
}

function resolveValorPagoInput(body: RegistroBody, deve: number): number {
  if (body.valor_pago !== undefined) {
    return body.valor_pago;
  }
  if (body.pago === true) {
    return deve;
  }
  if (body.pago === false) {
    return 0;
  }
  return 0;
}

router.get('/clientes/:clienteId/mesas', async (req: Request, res: Response) => {
  const clienteId = parseId(req.params.clienteId);
  if (clienteId === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const cliente = await prisma.clientes.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    const mesas = await prisma.mesas.findMany({
      where: { cliente_id: clienteId },
      include: { registros_mesa: { orderBy: { data_leitura: 'desc' } } },
      orderBy: { id: 'asc' },
    });

    res.json({
      cliente,
      mesas: mesas.map(mapMesa),
    });
  } catch (error) {
    console.error('[GET /clientes/:clienteId/mesas]', error);
    res.status(500).json({ error: 'Erro ao listar mesas.' });
  }
});

router.post('/clientes/:clienteId/mesas', async (req: Request, res: Response) => {
  const clienteId = parseId(req.params.clienteId);
  if (clienteId === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as MesaBody;

  if (!body.numeracao?.trim()) {
    res.status(400).json({ error: 'Numeração da mesa é obrigatória.' });
    return;
  }

  const valorFicha = parseValorFicha(body.valor_ficha);
  if (body.valor_ficha !== undefined && valorFicha === null) {
    res.status(400).json({ error: 'Valor da ficha inválido.' });
    return;
  }

  try {
    const mesa = await prisma.mesas.create({
      data: {
        cliente_id: clienteId,
        numeracao: body.numeracao.trim(),
        ...(valorFicha !== null ? { valor_ficha: valorFicha } : {}),
      },
      include: { registros_mesa: true },
    });

    res.status(201).json(mapMesa(mesa));
  } catch (error) {
    if (isForeignKeyError(error)) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }
    console.error('[POST /clientes/:clienteId/mesas]', error);
    res.status(500).json({ error: 'Erro ao criar mesa.' });
  }
});

router.put('/mesas/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as MesaBody;

  const valorFicha = parseValorFicha(body.valor_ficha);
  if (body.valor_ficha !== undefined && valorFicha === null) {
    res.status(400).json({ error: 'Valor da ficha inválido.' });
    return;
  }

  try {
    const mesa = await prisma.mesas.update({
      where: { id },
      data: {
        numeracao: body.numeracao?.trim(),
        ...(valorFicha !== null ? { valor_ficha: valorFicha } : {}),
      },
      include: { registros_mesa: { orderBy: { data_leitura: 'desc' } } },
    });

    res.json(mapMesa(mesa));
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }
    console.error('[PUT /mesas/:id]', error);
    res.status(500).json({ error: 'Erro ao atualizar mesa.' });
  }
});

router.delete('/mesas/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    await prisma.$transaction([
      prisma.registros_mesa.deleteMany({ where: { mesa_id: id } }),
      prisma.mesas.delete({ where: { id } }),
    ]);
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }
    console.error('[DELETE /mesas/:id]', error);
    res.status(500).json({ error: 'Erro ao excluir mesa.' });
  }
});

router.post('/mesas/:mesaId/registros', async (req: Request, res: Response) => {
  const mesaId = parseId(req.params.mesaId);
  if (mesaId === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as RegistroBody;
  const dataLeitura = parseDateInput(body.data_leitura);

  if (!dataLeitura || body.leitura === undefined) {
    res.status(400).json({ error: 'Data e leitura são obrigatórios.' });
    return;
  }

  if (body.leitura < 0) {
    res.status(400).json({ error: 'Leitura deve ser ≥ 0.' });
    return;
  }

  try {
    const mesa = await prisma.mesas.findUnique({ where: { id: mesaId } });
    if (!mesa) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }

    const leituraAnterior = await getLeituraAnterior(mesaId);
    const valorFicha = serializeDecimal(mesa.valor_ficha);
    const deveCalculado = calcularDeveLeitura(body.leitura, leituraAnterior, valorFicha);

    if (body.deve !== undefined && deveDiverge(deveCalculado, body.deve)) {
      res.status(400).json({
        error: `Valor deve diverge do cálculo esperado (${deveCalculado.toFixed(2).replace('.', ',')}).`,
      });
      return;
    }

    const deve = body.deve !== undefined ? body.deve : deveCalculado;

    if (deve < 0) {
      res.status(400).json({ error: 'Valor deve ser ≥ 0.' });
      return;
    }

    const pagamento = normalizarPagamento(deve, resolveValorPagoInput(body, deve));

    const registro = await prisma.registros_mesa.create({
      data: {
        mesa_id: mesaId,
        data_leitura: dataLeitura,
        leitura: body.leitura,
        deve: pagamento.deve,
        valor_pago: pagamento.valor_pago,
        pago: pagamento.pago,
      },
    });

    res.status(201).json(mapRegistro(registro));
  } catch (error) {
    if (isForeignKeyError(error)) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }
    console.error('[POST /mesas/:mesaId/registros]', error);
    res.status(500).json({ error: 'Erro ao criar registro.' });
  }
});

router.put('/registros/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as RegistroBody;

  if (body.leitura !== undefined && body.leitura < 0) {
    res.status(400).json({ error: 'Leitura deve ser ≥ 0.' });
    return;
  }

  if (body.deve !== undefined && body.deve < 0) {
    res.status(400).json({ error: 'Valor deve ser ≥ 0.' });
    return;
  }

  try {
    const atual = await prisma.registros_mesa.findUnique({ where: { id } });
    if (!atual) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }

    const mesa = await prisma.mesas.findUnique({ where: { id: atual.mesa_id } });
    if (!mesa) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }

    const valorFicha = serializeDecimal(mesa.valor_ficha);
    const recalcularLeitura = body.leitura !== undefined || body.data_leitura !== undefined;

    if (recalcularLeitura) {
      const novaData = body.data_leitura
        ? (parseDateInput(body.data_leitura) ?? atual.data_leitura)
        : atual.data_leitura;
      const novaLeitura = body.leitura !== undefined ? body.leitura : atual.leitura;

      if (novaLeitura < 0 || novaLeitura > 99999) {
        res.status(400).json({ error: 'Leitura deve estar entre 0 e 99999.' });
        return;
      }

      const leituraAnterior = await getLeituraAnteriorParaRegistro(
        atual.mesa_id,
        id,
        novaData,
        id,
      );
      const deveCalculado = calcularDeveLeitura(novaLeitura, leituraAnterior, valorFicha);

      if (body.deve !== undefined && deveDiverge(deveCalculado, body.deve)) {
        res.status(400).json({
          error: `Valor deve diverge do cálculo esperado (${deveCalculado.toFixed(2).replace('.', ',')}).`,
        });
        return;
      }

      const deve = body.deve !== undefined ? body.deve : deveCalculado;
      const valorPagoInput =
        body.valor_pago !== undefined
          ? body.valor_pago
          : Math.min(serializeDecimal(atual.valor_pago), deve);
      const pagamento = normalizarPagamento(deve, valorPagoInput);

      const registro = await prisma.registros_mesa.update({
        where: { id },
        data: {
          data_leitura: novaData,
          leitura: novaLeitura,
          deve: pagamento.deve,
          valor_pago: pagamento.valor_pago,
          pago: pagamento.pago,
        },
      });

      await recalcularRegistrosPosteriores(
        atual.mesa_id,
        valorFicha,
        novaData,
        id,
        novaLeitura,
      );

      res.json(mapRegistro(registro));
      return;
    }

    const deve = body.deve !== undefined ? body.deve : serializeDecimal(atual.deve);
    const valorPagoInput =
      body.valor_pago !== undefined
        ? body.valor_pago
        : body.pago !== undefined
          ? resolveValorPagoInput(body, deve)
          : serializeDecimal(atual.valor_pago);

    const pagamento = normalizarPagamento(deve, valorPagoInput);

    const registro = await prisma.registros_mesa.update({
      where: { id },
      data: {
        deve: pagamento.deve,
        valor_pago: pagamento.valor_pago,
        pago: pagamento.pago,
      },
    });

    res.json(mapRegistro(registro));
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }
    console.error('[PUT /registros/:id]', error);
    res.status(500).json({ error: 'Erro ao atualizar registro.' });
  }
});

router.delete('/registros/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const atual = await prisma.registros_mesa.findUnique({ where: { id } });
    if (!atual) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }

    const mesa = await prisma.mesas.findUnique({ where: { id: atual.mesa_id } });
    if (!mesa) {
      res.status(404).json({ error: 'Mesa não encontrada.' });
      return;
    }

    const valorFicha = serializeDecimal(mesa.valor_ficha);

    await prisma.$transaction(async (tx: typeof prisma) => {
      const leituraAnterior = await getLeituraAnteriorParaRegistro(
        atual.mesa_id,
        id,
        atual.data_leitura,
        id,
        tx,
      );

      await tx.registros_mesa.delete({ where: { id } });

      await recalcularRegistrosPosteriores(
        atual.mesa_id,
        valorFicha,
        atual.data_leitura,
        id,
        leituraAnterior,
        tx,
      );
    });

    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }
    console.error('[DELETE /registros/:id]', error);
    res.status(500).json({ error: 'Erro ao excluir registro.' });
  }
});

export default router;
