import { prisma } from './prisma';

export async function excluirClienteComDependencias(clienteId: number) {
  const mesaIds = (
    await prisma.mesas.findMany({
      where: { cliente_id: clienteId },
      select: { id: true },
    })
  ).map((m: { id: number }) => m.id);

  await prisma.$transaction([
    prisma.cobranca_clientes.deleteMany({ where: { cliente_id: clienteId } }),
    ...(mesaIds.length > 0
      ? [prisma.registros_mesa.deleteMany({ where: { mesa_id: { in: mesaIds } } })]
      : []),
    prisma.mesas.deleteMany({ where: { cliente_id: clienteId } }),
    prisma.clientes.delete({ where: { id: clienteId } }),
  ]);
}
