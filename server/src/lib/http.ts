export function parseId(value: string | string[]): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

/** Converte Prisma Decimal (ou similar) para number no JSON da API. */
export function serializeDecimal(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number.parseFloat(value) || 0;
  }

  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }

  return Number(value) || 0;
}

export function isNotFoundError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  );
}

export function isForeignKeyError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2003'
  );
}

export function parseDateInput(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Aceita YYYY-MM-DD (recomendado) sem bug de fuso. */
export function parseISODateInput(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(`${year}-${month}-${day}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
  }

  const parsed = parseDateInput(trimmed);
  return parsed ? startOfDay(parsed) : null;
}

export function serializeDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  const d = startOfDay(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
