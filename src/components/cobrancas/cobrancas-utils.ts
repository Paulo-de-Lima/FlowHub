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



export function formatTelefone(numero: number | null | undefined) {

  if (numero == null) return '—';

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

