import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';

import { formatCurrency, formatMonthShort, getSaldoColor } from './financeiro-utils';

type FinanceiroKpiGridProps = {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

export function FinanceiroKpiGrid({ mes, receitas, despesas, saldo }: FinanceiroKpiGridProps) {
  const monthHint = formatMonthShort(mes).toLowerCase();

  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'receitas',
          icon: { ios: 'arrow.up.circle.fill', android: 'north_east', web: 'north_east' },
          value: formatCurrency(receitas),
          label: 'Receitas',
          hint: `em ${monthHint}`,
          valueColor: FeatureColors.income,
          iconBg: FeatureColors.incomeBg,
          iconColor: FeatureColors.income,
          compact: true,
        },
        {
          id: 'despesas',
          icon: { ios: 'arrow.down.circle.fill', android: 'south_west', web: 'south_west' },
          value: formatCurrency(despesas),
          label: 'Despesas',
          hint: `em ${monthHint}`,
          valueColor: FeatureColors.expense,
          iconBg: FeatureColors.expenseBg,
          iconColor: FeatureColors.expense,
          compact: true,
        },
        {
          id: 'saldo',
          icon: { ios: 'equal.circle.fill', android: 'balance', web: 'balance' },
          value: formatCurrency(saldo),
          label: 'Saldo',
          hint: `em ${monthHint}`,
          valueColor: getSaldoColor(saldo),
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.petroleum,
          compact: true,
        },
      ]}
    />
  );
}
