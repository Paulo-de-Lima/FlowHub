import type { HomeBillingPreview } from '@/components/home/home-mock';
import { FlowHubHeaderContextCard } from '@/components/ui/FlowHubHeaderContextCard';
import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

type HomeHeaderProps = {
  firstName: string;
  monthLabel: string;
  nextBilling: HomeBillingPreview | null;
  onCobrancaPress?: () => void;
};

export function HomeHeader({
  firstName,
  monthLabel,
  nextBilling,
  onCobrancaPress,
}: HomeHeaderProps) {
  return (
    <FlowHubScreenHeader
      layout="root-home"
      title={`Olá, ${firstName}!`}
      subtitle={`Resumo de ${monthLabel}`}
      moduleIcon={{ ios: 'house.fill', android: 'home', web: 'home' }}
      headerBottom={
        nextBilling ? (
          <FlowHubHeaderContextCard
            icon={{ ios: 'map.fill', android: 'map', web: 'map' }}
            title={`Próxima cobrança: ${nextBilling.region}`}
            subtitle={nextBilling.subtitle}
            onPress={onCobrancaPress}
          />
        ) : (
          <FlowHubHeaderContextCard
            icon={{ ios: 'calendar.badge.plus', android: 'event', web: 'event' }}
            title="Nenhuma cobrança agendada"
            subtitle="Toque para planejar sua próxima rota"
            onPress={onCobrancaPress}
          />
        )
      }
    />
  );
}
