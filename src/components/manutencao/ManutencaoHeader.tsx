import { formatManutencoesFooter } from '@/components/manutencao/manutencao-utils';
import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

type ManutencaoHeaderProps = {
  totalMes: number;
};

export function ManutencaoHeader({ totalMes }: ManutencaoHeaderProps) {
  return (
    <FlowHubScreenHeader
      layout="root-tab"
      title="Manutenção"
      subtitle="Serviços e materiais consumidos"
      footer={formatManutencoesFooter(totalMes)}
      moduleIcon={{
        ios: 'wrench.and.screwdriver.fill',
        android: 'build',
        web: 'build',
      }}
    />
  );
}
