import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';

type HomeKpiStripProps = {
  clients: number;
  billings: number;
  criticalStock: number;
};

export function HomeKpiStrip({ clients, billings, criticalStock }: HomeKpiStripProps) {
  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'clients',
          icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
          value: clients,
          label: 'Clientes',
          hint: 'ativos',
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
        },
        {
          id: 'billings',
          icon: { ios: 'map.fill', android: 'map', web: 'map' },
          value: billings,
          label: 'Cobranças',
          hint: 'em aberto',
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.turquoise,
        },
        {
          id: 'stock',
          icon: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
          value: criticalStock,
          label: 'Estoque',
          hint: 'crítico',
          valueColor: criticalStock > 0 ? FeatureColors.expense : FlowHubColors.navy,
          iconBg: criticalStock > 0 ? FeatureColors.expenseBg : FlowHubPalette.surfaceSunken,
          iconColor: criticalStock > 0 ? FeatureColors.expense : FlowHubColors.darkGray,
        },
      ]}
    />
  );
}
