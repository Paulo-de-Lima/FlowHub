import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type CobrancaClientesEmptyStateProps = {
  onAdd: () => void;
};

export function CobrancaClientesEmptyState({ onAdd }: CobrancaClientesEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
      title="Nenhum cliente vinculado"
      description="Adicione clientes a esta viagem para registrar leituras nas mesas de cada um."
      actionLabel="Adicionar primeiro cliente"
      onAction={onAdd}
    />
  );
}
