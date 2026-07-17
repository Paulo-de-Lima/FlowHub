import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';

type CobrancaViagemKpiStripProps = {
  pendentes: number;
  cobrados: number;
  totalDeve: number;
};

export function CobrancaViagemKpiStrip({
  pendentes,
  cobrados,
  totalDeve,
}: CobrancaViagemKpiStripProps) {
  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'pendentes',
          icon: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
          value: pendentes,
          label: 'Pendentes',
          hint: 'a cobrar',
          valueColor: FeatureColors.expense,
          iconBg: FeatureColors.expenseBg,
          iconColor: FeatureColors.expense,
        },
        {
          id: 'cobrados',
          icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
          value: cobrados,
          label: 'Cobrados',
          hint: 'nesta viagem',
          valueColor: FeatureColors.income,
          iconBg: FeatureColors.incomeBg,
          iconColor: FeatureColors.income,
        },
        {
          id: 'total',
          icon: { ios: 'banknote.fill', android: 'payments', web: 'payments' },
          value: formatCurrency(totalDeve),
          label: 'Total deve',
          hint: 'pendente',
          valueColor: FlowHubColors.petroleum,
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
          compact: true,
        },
      ]}
    />
  );
}
