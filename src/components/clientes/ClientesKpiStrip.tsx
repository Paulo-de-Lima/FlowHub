import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';

type ClientesKpiStripProps = {
  comMesa: number;
  emDia: number;
  pendentes: number;
};

export function ClientesKpiStrip({ comMesa, emDia, pendentes }: ClientesKpiStripProps) {
  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'mesa',
          icon: { ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' },
          value: comMesa,
          label: 'Com mesa',
          valueColor: FlowHubColors.petroleum,
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
        },
        {
          id: 'dia',
          icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
          value: emDia,
          label: 'Em dia',
          valueColor: FeatureColors.income,
          iconBg: FeatureColors.incomeBg,
          iconColor: FeatureColors.income,
        },
        {
          id: 'pendentes',
          icon: { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' },
          value: pendentes,
          label: 'Pendentes',
          valueColor: FeatureColors.expense,
          iconBg: FeatureColors.expenseBg,
          iconColor: FeatureColors.expense,
        },
      ]}
    />
  );
}
