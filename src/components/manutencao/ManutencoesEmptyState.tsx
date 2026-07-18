import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type ManutencoesEmptyStateProps = {
  onAdd: () => void;
};

export function ManutencoesEmptyState({ onAdd }: ManutencoesEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{
        ios: 'wrench.and.screwdriver.fill',
        android: 'build',
        web: 'build',
      }}
      title="Nenhuma manutenção este mês"
      description="Registre serviços realizados e os materiais consumidos em cada atendimento."
      actionLabel="Registrar primeira manutenção"
      onAction={onAdd}
    />
  );
}
