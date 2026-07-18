import { type SymbolViewProps } from 'expo-symbols';

import { formatCurrency } from '@/components/home/home-utils';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';
import type { LancamentoFinanceiro } from '@/services/api';

export { formatCurrency };

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;

  const date = new Date(year, month - 1, 1);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthShort(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;

  const date = new Date(year, month - 1, 1);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getLancamentoIcon(tipo: LancamentoFinanceiro['tipo']): SymbolViewProps['name'] {
  if (tipo === 'receita') {
    return { ios: 'arrow.down.circle.fill', android: 'south_west', web: 'south_west' };
  }
  return { ios: 'arrow.up.circle.fill', android: 'north_east', web: 'north_east' };
}

export function getLancamentoColors(tipo: LancamentoFinanceiro['tipo']) {
  if (tipo === 'receita') {
    return {
      iconColor: FeatureColors.income,
      iconBg: FeatureColors.incomeBg,
      valueColor: FeatureColors.income,
    };
  }
  return {
    iconColor: FeatureColors.expense,
    iconBg: FeatureColors.expenseBg,
    valueColor: FeatureColors.expense,
  };
}

export function formatLancamentoDate(dataGasto: string | null): string {
  if (!dataGasto) return '—';

  const isoMatch = dataGasto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  return new Date(dataGasto).toLocaleDateString('pt-BR');
}

export function formatLancamentoValor(valor: number, tipo: LancamentoFinanceiro['tipo']): string {
  const prefix = tipo === 'receita' ? '+' : '−';
  return `${prefix} ${formatCurrency(Math.abs(valor))}`;
}

export function getSaldoColor(saldo: number): string {
  if (saldo > 0) return FeatureColors.income;
  if (saldo < 0) return FeatureColors.expense;
  return FlowHubColors.navy;
}

export function getSaldoLabel(saldo: number): string {
  if (saldo > 0) return 'Saldo positivo';
  if (saldo < 0) return 'Saldo negativo';
  return 'Sem movimentações';
}

export function parseValorInput(text: string): number | null {
  const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatValorInput(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getLancamentosFooterLabel(total: number): string {
  if (total === 0) return 'Nenhum lançamento neste mês';
  if (total === 1) return '1 lançamento neste mês';
  return `${total} lançamentos neste mês`;
}
