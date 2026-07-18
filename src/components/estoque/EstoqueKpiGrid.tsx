import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';

type EstoqueKpiGridProps = {
  total: number;
  criticos: number;
  emDia: number;
};

export function EstoqueKpiGrid({ total, criticos, emDia }: EstoqueKpiGridProps) {
  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'total',
          icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
          value: total,
          label: 'Total',
          hint: 'materiais',
          valueColor: FlowHubColors.petroleum,
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
        },
        {
          id: 'criticos',
          icon: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
          value: criticos,
          label: 'Críticos',
          hint: 'baixo ou vazio',
          valueColor: FeatureColors.expense,
          iconBg: FeatureColors.expenseBg,
          iconColor: FeatureColors.expense,
        },
        {
          id: 'em-dia',
          icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
          value: emDia,
          label: 'Em dia',
          hint: 'nível alto',
          valueColor: FeatureColors.income,
          iconBg: FeatureColors.incomeBg,
          iconColor: FeatureColors.income,
        },
      ]}
    />
  );
}
