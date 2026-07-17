import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';
import { HeaderLogoNotificationRow } from '@/components/ui/HeaderLogoNotificationRow';

type CobrancasHeaderProps = {
  totalViagens?: number;
  onNotificationPress?: () => void;
};

export function CobrancasHeader({ totalViagens = 0, onNotificationPress }: CobrancasHeaderProps) {
  const contadorLabel =
    totalViagens === 0
      ? 'Nenhuma viagem cadastrada'
      : totalViagens === 1
        ? '1 viagem cadastrada'
        : `${totalViagens} viagens cadastradas`;

  return (
    <FlowHubScreenHeader
      title="Cobranças"
      subtitle="Suas viagens e arrecadações"
      footer={contadorLabel}
      headerTop={<HeaderLogoNotificationRow onNotificationPress={onNotificationPress} />}
    />
  );
}
