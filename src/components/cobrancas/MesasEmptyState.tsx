import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type MesasEmptyStateProps = {
  onAdd: () => void;
};

export function MesasEmptyState({ onAdd }: MesasEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' }}
      title="Este cliente ainda não tem mesas"
      description="Cadastre a numeração da mesa (ex.: N324) e o valor da ficha para começar a registrar leituras."
      actionLabel="Adicionar primeira mesa"
      onAction={onAdd}
    />
  );
}
