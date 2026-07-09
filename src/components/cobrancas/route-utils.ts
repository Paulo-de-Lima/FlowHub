/** Converte parâmetro de rota do Expo Router em ID numérico. */
export function parseRouteId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw?.trim()) {
    return null;
  }

  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

export const COBRANCAS_LIST_PATH = '/cobrancas' as const;

export function cobrancaClientesPath(cobrancaId: number) {
  return `/cobrancas/${cobrancaId}/clientes`;
}

export function cobrancaClienteMesasPath(cobrancaId: number, clienteId: number) {
  return `/cobrancas/${cobrancaId}/mesas/${clienteId}`;
}
