import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubKpiGrid } from '@/components/ui/FlowHubKpiGrid';
import { FlowHubColors, FlowHubPalette } from '@/constants/theme';

type CobrancasKpiStripProps = {
  viagens: number;
  clientes: number;
  arrecadadoMes: number;
  monthLabel: string;
};

export function CobrancasKpiStrip({
  viagens,
  clientes,
  arrecadadoMes,
  monthLabel,
}: CobrancasKpiStripProps) {
  return (
    <FlowHubKpiGrid
      items={[
        {
          id: 'viagens',
          icon: { ios: 'map.fill', android: 'map', web: 'map' },
          value: viagens,
          label: 'Viagens',
          hint: 'cadastradas',
          valueColor: FlowHubColors.turquoise,
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.turquoise,
        },
        {
          id: 'clientes',
          icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
          value: clientes,
          label: 'Clientes',
          hint: 'vinculados',
          valueColor: FlowHubColors.petroleum,
          iconBg: FlowHubPalette.kpiIconBgAlt,
          iconColor: FlowHubColors.petroleum,
        },
        {
          id: 'arrecadado',
          icon: { ios: 'dollarsign.circle.fill', android: 'paid', web: 'paid' },
          value: formatCurrency(arrecadadoMes),
          label: 'Arrecadado',
          hint: `em ${monthLabel.toLowerCase()}`,
          valueColor: FlowHubColors.turquoise,
          iconBg: FlowHubPalette.kpiIconBg,
          iconColor: FlowHubColors.turquoise,
          compact: true,
        },
      ]}
    />
  );
}
