import type { Href } from 'expo-router';

export const CLIENTES_LIST_PATH = '/clientes' as const;

export function clienteDetailPath(clienteId: number): Href {
  return `/clientes/${clienteId}` as Href;
}

export function clienteMesasPath(clienteId: number): Href {
  return `/clientes/${clienteId}/mesas` as Href;
}

export function parseRouteId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw?.trim()) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}
