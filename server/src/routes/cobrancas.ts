import { Router, type Request, type Response } from 'express';



import { isForeignKeyError, isNotFoundError, parseId, parseISODateInput, serializeDate, serializeDecimal } from '../lib/http';

import { prisma } from '../lib/prisma';



const router = Router();



type CobrancaBody = {

  nome?: string;

  intervalo_dias?: number;

  data_viagem?: string;

  observacoes?: string | null;

};



type VincularClienteBody = {

  clienteId?: number;

  cliente?: {

    nome?: string | null;

    numero?: string | null;

    endereco?: string | null;

    cpf?: string | null;

    qtdMesas?: number;

    mesas?: { numeracao?: string }[];

  };

};



type PatchCobrancaClienteBody = {

  cobrado?: boolean;

};



type CobrancaWithStatus = {

  id: number;

  nome: string;

  intervalo_dias: number;

  data_viagem: Date;

  observacoes: string | null;

  cobranca_clientes: { cobrado: boolean | null; data_cobranca: Date | null; cliente_id: number }[];

};



type VinculoWithCliente = {

  id: number;

  cliente_id: number;

  cobrado: boolean | null;

  data_cobranca: Date | null;

  clientes: {

    id: number;

    nome: string | null;

    numero: number | null;

    endereco: string | null;

    cpf: string | null;

  };

};



function startOfDay(date: Date): Date {

  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;

}



function addDays(date: Date, days: number): Date {

  const d = startOfDay(date);

  d.setDate(d.getDate() + days);

  return d;

}



/**
 * Última referência de cobrança: maior data entre cobranças concluídas

 * nos vínculos e leituras de mesa dos clientes vinculados.

 */

async function calcReferenciaBase(cobranca: CobrancaWithStatus): Promise<Date | null> {

  const datas: number[] = [];



  for (const v of cobranca.cobranca_clientes) {

    if (v.cobrado && v.data_cobranca) {

      datas.push(startOfDay(v.data_cobranca).getTime());

    }

  }



  const clienteIds = cobranca.cobranca_clientes.map((v) => v.cliente_id);

  if (clienteIds.length > 0) {

    const ultimoRegistro = await prisma.registros_mesa.findFirst({

      where: { mesas: { cliente_id: { in: clienteIds } } },

      orderBy: { data_leitura: 'desc' },

      select: { data_leitura: true },

    });

    if (ultimoRegistro) {

      datas.push(startOfDay(ultimoRegistro.data_leitura).getTime());

    }

  }



  if (datas.length === 0) return null;

  return new Date(Math.max(...datas));

}



function calcProximaViagem(referenciaBase: Date | null, intervaloDias: number): Date | null {

  if (!referenciaBase) return null;

  return addDays(referenciaBase, intervaloDias);

}



function isMonthlyInterval(intervaloDias: number): boolean {

  return intervaloDias >= 28 && intervaloDias <= 31;

}



/** Ciclo imediatamente anterior (ex.: junho quando estamos em julho, para intervalo ~mensal). */

function getCicloAnteriorRange(

  intervaloDias: number,

  referenciaBase: Date | null,

): { inicio: Date; fim: Date } | null {

  const hoje = startOfDay(new Date());



  if (isMonthlyInterval(intervaloDias)) {

    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);

    const fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    return { inicio: startOfDay(inicio), fim: startOfDay(fim) };

  }



  if (referenciaBase) {

    const fim = startOfDay(referenciaBase);

    const inicio = addDays(fim, -intervaloDias);

    return { inicio, fim };

  }



  return null;

}



/** Ciclo corrente da mesma cobrança (ex.: julho em diante). */

function getCicloAtualRange(

  intervaloDias: number,

  referenciaBase: Date | null,

): { inicio: Date; fim: Date } {

  const hoje = startOfDay(new Date());



  if (isMonthlyInterval(intervaloDias)) {

    return {

      inicio: startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),

      fim: hoje,

    };

  }



  if (referenciaBase) {

    return {

      inicio: addDays(startOfDay(referenciaBase), 1),

      fim: hoje,

    };

  }



  return {

    inicio: startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),

    fim: hoje,

  };

}



async function calcTotalArrecadadoAnterior(

  clienteIds: number[],

  referenciaBase: Date | null,

  intervaloDias: number,

): Promise<number> {

  if (clienteIds.length === 0) return 0;



  const ciclo = getCicloAnteriorRange(intervaloDias, referenciaBase);

  if (!ciclo) return 0;



  const agg = await prisma.registros_mesa.aggregate({

    where: {

      mesas: { cliente_id: { in: clienteIds } },

      data_leitura: { gte: ciclo.inicio, lte: ciclo.fim },

    },

    _sum: { valor_pago: true },

  });



  return serializeDecimal(agg._sum.valor_pago);

}



async function calcReceitaAtual(

  clienteIds: number[],

  referenciaBase: Date | null,

  intervaloDias: number,

): Promise<number> {

  if (clienteIds.length === 0) return 0;



  const ciclo = getCicloAtualRange(intervaloDias, referenciaBase);



  const agg = await prisma.registros_mesa.aggregate({

    where: {

      mesas: { cliente_id: { in: clienteIds } },

      data_leitura: { gte: ciclo.inicio, lte: ciclo.fim },

    },

    _sum: { valor_pago: true },

  });



  return serializeDecimal(agg._sum.valor_pago);

}



async function calcDespesasPeriodo(intervaloDias: number, referenciaBase: Date | null): Promise<number> {

  const hoje = startOfDay(new Date());

  const inicio = referenciaBase ? startOfDay(referenciaBase) : addDays(hoje, -intervaloDias);



  const agg = await prisma.despesas.aggregate({

    where: {

      tipo: 'despesa',

      data_gasto: { gte: inicio, lte: hoje },

    },

    _sum: { valor: true },

  });



  return serializeDecimal(agg._sum.valor);

}



async function enrichCobranca(cobranca: CobrancaWithStatus) {

  const totalClientes = cobranca.cobranca_clientes.length;

  const clientesCobrados = cobranca.cobranca_clientes.filter((c) => c.cobrado).length;

  const clienteIds = cobranca.cobranca_clientes.map((c) => c.cliente_id);

  const referenciaBase = await calcReferenciaBase(cobranca);

  const dataViagem = startOfDay(cobranca.data_viagem);

  const repeticaoPrevista = calcRepeticaoPrevista(dataViagem, cobranca.intervalo_dias);



  return {

    id: cobranca.id,

    nome: cobranca.nome,

    intervalo_dias: cobranca.intervalo_dias,

    data_viagem: serializeDate(dataViagem),

    observacoes: cobranca.observacoes,

    referenciaBase: serializeDate(referenciaBase),

    proximaViagem: serializeDate(dataViagem),

    repeticaoPrevista: serializeDate(repeticaoPrevista),

    totalClientes,

    clientesCobrados,

    totalArrecadadoAnterior: await calcTotalArrecadadoAnterior(

      clienteIds,

      referenciaBase,

      cobranca.intervalo_dias,

    ),

    receitaAtual: await calcReceitaAtual(clienteIds, referenciaBase, cobranca.intervalo_dias),

    despesasPeriodo: await calcDespesasPeriodo(cobranca.intervalo_dias, referenciaBase),

  };

}



async function calcClienteTotais(clienteId: number) {

  const mesas = await prisma.mesas.findMany({

    where: { cliente_id: clienteId },

    include: { registros_mesa: true },

  });



  let totalDeve = 0;

  for (const mesa of mesas) {

    for (const reg of mesa.registros_mesa) {

      const deve = serializeDecimal(reg.deve);

      const valorPago = serializeDecimal(reg.valor_pago);

      totalDeve += Math.max(0, deve - valorPago);

    }

  }



  return { qtdMesas: mesas.length, totalDeve };

}



async function calcArrecadadoMes(): Promise<number> {

  const now = new Date();

  const inicio = new Date(now.getFullYear(), now.getMonth(), 1);

  const fim = new Date(now.getFullYear(), now.getMonth() + 1, 0);



  const agg = await prisma.registros_mesa.aggregate({

    where: {

      data_leitura: { gte: inicio, lte: fim },

    },

    _sum: { valor_pago: true },

  });



  return serializeDecimal(agg._sum.valor_pago);

}



function calcRepeticaoPrevista(dataViagem: Date, intervaloDias: number): Date {

  return addDays(dataViagem, intervaloDias);

}



/**
 * Ordena por data_viagem: atrasadas primeiro (mais antigas no topo), depois futuras.
 */
function sortByDataViagem<T extends { data_viagem: string | null }>(items: T[]): T[] {

  const hoje = serializeDate(new Date()) ?? '';

  return [...items].sort((a, b) => {

    if (!a.data_viagem || !b.data_viagem) return 0;

    const aAtrasada = a.data_viagem < hoje;

    const bAtrasada = b.data_viagem < hoje;

    if (aAtrasada && !bAtrasada) return -1;

    if (!aAtrasada && bAtrasada) return 1;

    return a.data_viagem.localeCompare(b.data_viagem);

  });

}



router.get('/dashboard', async (_req: Request, res: Response) => {

  try {

    const cobrancas = await prisma.cobrancas.findMany({

      include: {

        cobranca_clientes: { select: { cobrado: true, data_cobranca: true, cliente_id: true } },

      },

      orderBy: { id: 'desc' },

    });



    const enriched = await Promise.all(cobrancas.map((c: CobrancaWithStatus) => enrichCobranca(c)));



    const maiorArrecadacao = [...enriched]

      .sort((a, b) => b.receitaAtual - a.receitaAtual)

      .slice(0, 3)

      .map((c) => ({

        id: c.id,

        label: c.nome,

        valor: c.receitaAtual,

      }));



    const maioresDespesas = [...enriched]

      .sort((a, b) => b.despesasPeriodo - a.despesasPeriodo)

      .slice(0, 3)

      .map((c) => ({

        id: c.id,

        label: c.nome,

        valor: c.despesasPeriodo,

      }));



    const maisClientes = [...enriched]

      .sort((a, b) => b.totalClientes - a.totalClientes)

      .slice(0, 3)

      .map((c) => ({

        id: c.id,

        label: c.nome,

        valor: c.totalClientes,

      }));



    res.json({ maiorArrecadacao, maioresDespesas, maisClientes });

  } catch (error) {

    console.error('[GET /cobrancas/dashboard]', error);

    res.status(500).json({ error: 'Erro ao carregar dashboard de cobranças.' });

  }

});



router.get('/', async (_req: Request, res: Response) => {

  try {

    const cobrancas = await prisma.cobrancas.findMany({

      include: {

        cobranca_clientes: { select: { cobrado: true, data_cobranca: true, cliente_id: true } },

      },

      orderBy: { id: 'desc' },

    });



    const enriched = await Promise.all(cobrancas.map((c: CobrancaWithStatus) => enrichCobranca(c)));

    const ordenadas = sortByDataViagem(enriched);

    const proximaId = ordenadas[0]?.id ?? null;

    const arrecadadoMes = await calcArrecadadoMes();



    res.json({ cobrancas: ordenadas, proximaId, arrecadadoMes });

  } catch (error) {

    console.error('[GET /cobrancas]', error);

    res.status(500).json({ error: 'Erro ao listar cobranças.' });

  }

});



router.get('/:id', async (req: Request, res: Response) => {

  const id = parseId(req.params.id);

  if (id === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  try {

    const cobranca = await prisma.cobrancas.findUnique({

      where: { id },

      include: {

        cobranca_clientes: { select: { cobrado: true, data_cobranca: true, cliente_id: true } },

      },

    });



    if (!cobranca) {

      res.status(404).json({ error: 'Cobrança não encontrada.' });

      return;

    }



    res.json(await enrichCobranca(cobranca));

  } catch (error) {

    console.error('[GET /cobrancas/:id]', error);

    res.status(500).json({ error: 'Erro ao buscar cobrança.' });

  }

});



router.post('/', async (req: Request, res: Response) => {

  const body = req.body as CobrancaBody;

  const intervalo = Number(body.intervalo_dias);



  if (!body.nome?.trim()) {

    res.status(400).json({ error: 'Nome da cobrança é obrigatório.' });

    return;

  }



  if (!Number.isInteger(intervalo) || intervalo < 1) {

    res.status(400).json({ error: 'Informe um intervalo válido (mínimo 1 dia).' });

    return;

  }



  const dataViagem = parseISODateInput(body.data_viagem);

  if (!dataViagem) {

    res.status(400).json({ error: 'Data da próxima viagem é obrigatória (AAAA-MM-DD).' });

    return;

  }



  try {

    const cobranca = await prisma.cobrancas.create({

      data: {

        nome: body.nome.trim(),

        intervalo_dias: intervalo,

        data_viagem: dataViagem,

        observacoes: body.observacoes ?? null,

      },

      include: {

        cobranca_clientes: { select: { cobrado: true, data_cobranca: true, cliente_id: true } },

      },

    });



    res.status(201).json(await enrichCobranca(cobranca));

  } catch (error) {

    console.error('[POST /cobrancas]', error);

    res.status(500).json({ error: 'Erro ao criar cobrança.' });

  }

});



router.put('/:id', async (req: Request, res: Response) => {

  const id = parseId(req.params.id);

  if (id === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  const body = req.body as CobrancaBody;

  const intervalo =

    body.intervalo_dias !== undefined ? Number(body.intervalo_dias) : undefined;



  if (body.nome !== undefined && !body.nome.trim()) {

    res.status(400).json({ error: 'Nome da cobrança não pode ser vazio.' });

    return;

  }



  if (intervalo !== undefined && (!Number.isInteger(intervalo) || intervalo < 1)) {

    res.status(400).json({ error: 'Informe um intervalo válido (mínimo 1 dia).' });

    return;

  }



  const dataViagem = body.data_viagem !== undefined ? parseISODateInput(body.data_viagem) : undefined;

  if (body.data_viagem !== undefined && !dataViagem) {

    res.status(400).json({ error: 'Data da próxima viagem inválida (AAAA-MM-DD).' });

    return;

  }



  try {

    const cobranca = await prisma.cobrancas.update({

      where: { id },

      data: {

        nome: body.nome?.trim(),

        intervalo_dias: intervalo,

        data_viagem: dataViagem,

        observacoes: body.observacoes,

      },

      include: {

        cobranca_clientes: { select: { cobrado: true, data_cobranca: true, cliente_id: true } },

      },

    });



    res.json(await enrichCobranca(cobranca));

  } catch (error) {

    if (isNotFoundError(error)) {

      res.status(404).json({ error: 'Cobrança não encontrada.' });

      return;

    }

    console.error('[PUT /cobrancas/:id]', error);

    res.status(500).json({ error: 'Erro ao atualizar cobrança.' });

  }

});



router.delete('/:id', async (req: Request, res: Response) => {

  const id = parseId(req.params.id);

  if (id === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  try {

    await prisma.cobranca_clientes.deleteMany({ where: { cobranca_id: id } });

    await prisma.cobrancas.delete({ where: { id } });

    res.status(204).send();

  } catch (error) {

    if (isNotFoundError(error)) {

      res.status(404).json({ error: 'Cobrança não encontrada.' });

      return;

    }

    console.error('[DELETE /cobrancas/:id]', error);

    res.status(500).json({ error: 'Erro ao excluir cobrança.' });

  }

});



router.get('/:id/clientes', async (req: Request, res: Response) => {

  const cobrancaId = parseId(req.params.id);

  if (cobrancaId === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  try {

    const cobranca = await prisma.cobrancas.findUnique({ where: { id: cobrancaId } });

    if (!cobranca) {

      res.status(404).json({ error: 'Cobrança não encontrada.' });

      return;

    }



    const vinculos = await prisma.cobranca_clientes.findMany({

      where: { cobranca_id: cobrancaId },

      include: { clientes: true },

      orderBy: { id: 'asc' },

    });



    const clientes = await Promise.all(

      vinculos.map(async (v: VinculoWithCliente) => {

        const totais = await calcClienteTotais(v.cliente_id);

        return {

          vinculoId: v.id,

          cobrado: v.cobrado ?? false,

          data_cobranca: v.data_cobranca,

          cliente: v.clientes,

          qtdMesas: totais.qtdMesas,

          totalDeve: totais.totalDeve,

        };

      }),

    );



    const total = clientes.length;

    const cobrados = clientes.filter((c) => c.cobrado).length;



    res.json({

      cobranca: {

        id: cobranca.id,

        nome: cobranca.nome,

        intervalo_dias: cobranca.intervalo_dias,

        data_viagem: serializeDate(cobranca.data_viagem),

      },

      progresso: { total, cobrados },

      clientes,

    });

  } catch (error) {

    console.error('[GET /cobrancas/:id/clientes]', error);

    res.status(500).json({ error: 'Erro ao listar clientes da cobrança.' });

  }

});



router.post('/:id/clientes', async (req: Request, res: Response) => {

  const cobrancaId = parseId(req.params.id);

  if (cobrancaId === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  const body = req.body as VincularClienteBody;



  try {

    const cobranca = await prisma.cobrancas.findUnique({ where: { id: cobrancaId } });

    if (!cobranca) {

      res.status(404).json({ error: 'Cobrança não encontrada.' });

      return;

    }



    let clienteId = body.clienteId;



    if (!clienteId && body.cliente) {

      if (!body.cliente.nome?.trim()) {

        res.status(400).json({ error: 'Nome do cliente é obrigatório.' });

        return;

      }



      const novoCliente = await prisma.clientes.create({

        data: {

          nome: body.cliente.nome.trim(),

          numero: body.cliente.numero?.trim() || null,

          endereco: body.cliente.endereco ?? null,

          cpf: body.cliente.cpf ?? null,

        },

      });



      clienteId = novoCliente.id;

      const mesasInformadas = (body.cliente.mesas ?? [])

        .map((m) => m.numeracao?.trim())

        .filter((n): n is string => Boolean(n));



      if (mesasInformadas.length > 0) {

        await prisma.mesas.createMany({

          data: mesasInformadas.map((numeracao) => ({

            cliente_id: novoCliente.id,

            numeracao,

          })),

        });

      } else {

        const qtd = body.cliente.qtdMesas ?? 0;

        if (qtd > 0) {

          await prisma.mesas.createMany({

            data: Array.from({ length: qtd }, (_, i) => ({

              cliente_id: novoCliente.id,

              numeracao: `Mesa ${i + 1}`,

            })),

          });

        }

      }

    }



    if (!clienteId) {

      res.status(400).json({ error: 'Informe clienteId ou dados do novo cliente.' });

      return;

    }



    const existente = await prisma.cobranca_clientes.findFirst({

      where: { cobranca_id: cobrancaId, cliente_id: clienteId },

    });



    if (existente) {

      res.status(409).json({ error: 'Cliente já vinculado a esta cobrança.' });

      return;

    }



    const vinculo = await prisma.cobranca_clientes.create({

      data: { cobranca_id: cobrancaId, cliente_id: clienteId },

      include: { clientes: true },

    });



    const totais = await calcClienteTotais(clienteId);



    res.status(201).json({

      vinculoId: vinculo.id,

      cobrado: false,

      data_cobranca: null,

      cliente: vinculo.clientes,

      qtdMesas: totais.qtdMesas,

      totalDeve: totais.totalDeve,

    });

  } catch (error) {

    if (isForeignKeyError(error)) {

      res.status(404).json({ error: 'Cliente não encontrado.' });

      return;

    }

    console.error('[POST /cobrancas/:id/clientes]', error);

    res.status(500).json({ error: 'Erro ao vincular cliente.' });

  }

});



router.patch('/:id/clientes/:clienteId', async (req: Request, res: Response) => {

  const cobrancaId = parseId(req.params.id);

  const clienteId = parseId(req.params.clienteId);



  if (cobrancaId === null || clienteId === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  const body = req.body as PatchCobrancaClienteBody;



  if (typeof body.cobrado !== 'boolean') {

    res.status(400).json({ error: 'Campo cobrado é obrigatório.' });

    return;

  }



  try {

    const vinculo = await prisma.cobranca_clientes.findFirst({

      where: { cobranca_id: cobrancaId, cliente_id: clienteId },

    });



    if (!vinculo) {

      res.status(404).json({ error: 'Vínculo não encontrado.' });

      return;

    }



    const atualizado = await prisma.cobranca_clientes.update({

      where: { id: vinculo.id },

      data: {

        cobrado: body.cobrado,

        data_cobranca: body.cobrado ? new Date() : null,

      },

      include: { clientes: true },

    });



    const totais = await calcClienteTotais(clienteId);



    res.json({

      vinculoId: atualizado.id,

      cobrado: atualizado.cobrado ?? false,

      data_cobranca: atualizado.data_cobranca,

      cliente: atualizado.clientes,

      qtdMesas: totais.qtdMesas,

      totalDeve: totais.totalDeve,

    });

  } catch (error) {

    console.error('[PATCH /cobrancas/:id/clientes/:clienteId]', error);

    res.status(500).json({ error: 'Erro ao atualizar status do cliente.' });

  }

});



router.delete('/:id/clientes/:clienteId', async (req: Request, res: Response) => {

  const cobrancaId = parseId(req.params.id);

  const clienteId = parseId(req.params.clienteId);



  if (cobrancaId === null || clienteId === null) {

    res.status(400).json({ error: 'ID inválido.' });

    return;

  }



  try {

    const vinculo = await prisma.cobranca_clientes.findFirst({

      where: { cobranca_id: cobrancaId, cliente_id: clienteId },

    });



    if (!vinculo) {

      res.status(404).json({ error: 'Vínculo não encontrado.' });

      return;

    }



    await prisma.cobranca_clientes.delete({ where: { id: vinculo.id } });

    res.status(204).send();

  } catch (error) {

    console.error('[DELETE /cobrancas/:id/clientes/:clienteId]', error);

    res.status(500).json({ error: 'Erro ao remover vínculo.' });

  }

});



export default router;

