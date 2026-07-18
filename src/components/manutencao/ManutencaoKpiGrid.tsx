import type { ManutencaoStats } from '@/components/manutencao/manutencao-utils';
import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FlowHubColors, FlowHubPalette } from '@/constants/theme';

type ManutencaoKpiGridProps = {
  stats: ManutencaoStats;
};

export function ManutencaoKpiGrid({ stats }: ManutencaoKpiGridProps) {
  const monthHint = `em ${stats.monthLabel.toLowerCase()}`;

  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'manutencoes',
          icon: {
            ios: 'wrench.and.screwdriver.fill',
            android: 'build',
            web: 'build',
          },
          value: stats.totalMes,
          label: 'Manutenções',
          hint: monthHint,
          valueColor: FlowHubColors.turquoise,
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.turquoise,
        },
        {
          id: 'clientes',
          icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
          value: stats.clientesAtendidos,
          label: 'Clientes',
          hint: 'atendidos',
          valueColor: FlowHubColors.petroleum,
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
        },
        {
          id: 'materiais',
          icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
          value: stats.materiaisUsadosMes,
          label: 'Materiais',
          hint: 'utilizados',
          valueColor: FlowHubColors.navy,
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.petroleum,
        },
      ]}
    />
  );
}
