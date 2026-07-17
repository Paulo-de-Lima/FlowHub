import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

type CobrancasHeaderProps = {
  totalViagens?: number;
};

export function CobrancasHeader({ totalViagens = 0 }: CobrancasHeaderProps) {
  const contadorLabel =
    totalViagens === 0
      ? 'Nenhuma viagem cadastrada'
      : totalViagens === 1
        ? '1 viagem cadastrada'
        : `${totalViagens} viagens cadastradas`;

  return (
    <FlowHubScreenHeader
      layout="root-tab"
      title="Cobranças"
      subtitle="Suas viagens e arrecadações"
      footer={contadorLabel}
      moduleIcon={{ ios: 'map.fill', android: 'map', web: 'map' }}
    />
  );
}
