import { serializeDecimal } from './http';
import { prisma } from './prisma';

export type ClienteTotais = {
  qtdMesas: number;
  totalDeve: number;
  registrosPendentes: number;
};

type MesaComRegistros = {
  cliente_id: number;
  registros_mesa: { deve: unknown; valor_pago: unknown }[];
};

function totaisFromMesas(mesas: { registros_mesa: { deve: unknown; valor_pago: unknown }[] }[]): ClienteTotais {
  let totalDeve = 0;
  let registrosPendentes = 0;

  for (const mesa of mesas) {
    for (const reg of mesa.registros_mesa) {
      const saldo = Math.max(0, serializeDecimal(reg.deve) - serializeDecimal(reg.valor_pago));
      totalDeve += saldo;
      if (saldo > 0) registrosPendentes++;
    }
  }

  return { qtdMesas: mesas.length, totalDeve, registrosPendentes };
}

export async function calcClienteTotais(clienteId: number): Promise<ClienteTotais> {
  const mesas = await prisma.mesas.findMany({
    where: { cliente_id: clienteId },
    include: { registros_mesa: true },
  });
  return totaisFromMesas(mesas);
}

export async function calcClientesTotaisBatch(clienteIds: number[]): Promise<Map<number, ClienteTotais>> {
  const map = new Map<number, ClienteTotais>();
  if (clienteIds.length === 0) return map;

  for (const id of clienteIds) {
    map.set(id, { qtdMesas: 0, totalDeve: 0, registrosPendentes: 0 });
  }

  const mesas = (await prisma.mesas.findMany({
    where: { cliente_id: { in: clienteIds } },
    include: { registros_mesa: true },
  })) as MesaComRegistros[];

  const byCliente = new Map<number, MesaComRegistros[]>();
  for (const mesa of mesas) {
    const list = byCliente.get(mesa.cliente_id) ?? [];
    list.push(mesa);
    byCliente.set(mesa.cliente_id, list);
  }

  for (const id of clienteIds) {
    map.set(id, totaisFromMesas(byCliente.get(id) ?? []));
  }

  return map;
}
