export function formatCurrency(value: number) {

  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

}



export function formatDate(value: string | Date) {
  if (typeof value === 'string') {
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('pt-BR');
}

export function todayDisplay(): string {
  return formatDate(new Date());
}

export function parseDisplayDateToISO(display: string): string | null {
  const trimmed = display.trim();
  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const date = new Date(`${iso}T12:00:00`);
    if (!Number.isNaN(date.getTime())) return iso;
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  return null;
}



export function formatCobrancaTitulo(nome: string) {

  return nome;

}



export function addDaysToISODate(iso: string, days: number): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return iso;

  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T12:00:00`);
  date.setDate(date.getDate() + days);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatRepeticaoPrevista(dataViagem: string | null, intervaloDias: number): string {
  if (!dataViagem || intervaloDias < 1) return '—';
  return formatDate(addDaysToISODate(dataViagem, intervaloDias));
}

export function formatProximaViagem(proximaViagem: string | null, dataViagem?: string | null) {
  const data = proximaViagem ?? dataViagem ?? null;
  if (!data) return 'A definir';
  return formatDate(data);
}



export function formatIntervaloDias(dias: number) {

  return dias === 1 ? 'A cada 1 dia' : `A cada ${dias} dias`;

}



export function formatTelefone(numero: string | number | null | undefined) {
  if (numero == null || numero === '') return '—';

  return String(numero);
}



export function saldoRegistro(registro: { deve: number; valor_pago?: number }) {
  const pago = registro.valor_pago ?? 0;
  return Math.max(0, registro.deve - pago);
}

export function isRegistroQuitado(registro: { deve: number; valor_pago?: number; pago?: boolean }) {
  if (registro.pago !== undefined) return registro.pago;
  return saldoRegistro(registro) <= 0;
}

export function temPagamentoParcial(registro: { deve: number; valor_pago?: number }) {
  const pago = registro.valor_pago ?? 0;
  return pago > 0 && pago < registro.deve;
}

export function getClienteInitials(nome: string | null | undefined) {
  const parts = (nome ?? '').trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function arredondarMoeda(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export const MAX_LEITURA = 99999;
export const MODULO_LEITURA = 100000;

export function calcularDiferencaLeitura(anterior: number, atual: number): number {
  if (atual >= anterior) {
    return atual - anterior;
  }

  return MAX_LEITURA - anterior + 1 + atual;
}

export function calcularDeveLeitura(
  leituraAtual: number,
  leituraAnterior: number | null,
  valorFicha: number,
): number {
  if (leituraAnterior === null) {
    return 0;
  }

  const diferenca = calcularDiferencaLeitura(leituraAnterior, leituraAtual);
  const bruto = diferenca * valorFicha;
  return arredondarMoeda(bruto / 2);
}

export function isRolagemMedidor(anterior: number, atual: number): boolean {
  return atual < anterior;
}

export function formatLeituraMedidor(valor: number): string {
  return String(valor).padStart(5, '0');
}

export function getLeituraAnterior(
  registros: { id: number; leitura: number; data_leitura: string }[],
  excluirId?: number,
): number | null {
  const filtrados = excluirId != null ? registros.filter((r) => r.id !== excluirId) : registros;
  if (filtrados.length === 0) return null;

  const ordenados = [...filtrados].sort(compareRegistrosDesc);
  return ordenados[0]?.leitura ?? null;
}

export function getUltimoRegistro<T extends { id: number; data_leitura: string }>(
  registros: T[],
): T | null {
  if (registros.length === 0) return null;
  return [...registros].sort(compareRegistrosDesc)[0] ?? null;
}

export function getLeituraAnteriorParaEdicao(
  registros: { id: number; leitura: number; data_leitura: string }[],
  registroId: number,
): number | null {
  const alvo = registros.find((r) => r.id === registroId);
  if (!alvo) return getLeituraAnterior(registros, registroId);

  const anteriores = registros.filter((r) => {
    if (r.id === registroId) return false;
    const cmp = r.data_leitura.localeCompare(alvo.data_leitura);
    if (cmp < 0) return true;
    if (cmp === 0) return r.id < alvo.id;
    return false;
  });

  if (anteriores.length === 0) return null;
  return [...anteriores].sort(compareRegistrosDesc)[0]?.leitura ?? null;
}

export function sortRegistrosCronologico<T extends { id: number; data_leitura: string }>(
  registros: T[],
): T[] {
  return [...registros].sort(compareRegistrosAsc);
}

export function isRegistroMaisRecente(
  registro: { id: number; data_leitura: string },
  registros: { id: number; data_leitura: string }[],
): boolean {
  const ultimo = getUltimoRegistro(registros);
  return ultimo?.id === registro.id;
}

function compareRegistrosDesc(
  a: { id: number; data_leitura: string },
  b: { id: number; data_leitura: string },
) {
  const cmp = b.data_leitura.localeCompare(a.data_leitura);
  return cmp !== 0 ? cmp : b.id - a.id;
}

function compareRegistrosAsc(
  a: { id: number; data_leitura: string },
  b: { id: number; data_leitura: string },
) {
  const cmp = a.data_leitura.localeCompare(b.data_leitura);
  return cmp !== 0 ? cmp : a.id - b.id;
}

export function isLeituraMedidorValida(leitura: number): boolean {
  return Number.isInteger(leitura) && leitura >= 0 && leitura <= MAX_LEITURA;
}

export function isDataAnteriorUltimaLeitura(
  dataIso: string,
  ultimoRegistro: { data_leitura: string } | null,
): boolean {
  if (!ultimoRegistro) return false;
  const ultimaIso = ultimoRegistro.data_leitura.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  return ultimaIso != null && dataIso < ultimaIso;
}

export const VALOR_FICHA_PADRAO = 1.5;

export function formatValorFichaInput(valor: number): string {
  return valor.toFixed(2).replace('.', ',');
}

export function parseValorFichaInput(text: string): number | null {
  const trimmed = text.trim().replace(',', '.');
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) || parsed < 0 ? null : parsed;
}

