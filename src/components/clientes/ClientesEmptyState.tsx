import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type ClientesEmptyStateProps = {
  onAdd: () => void;
};

export function ClientesEmptyState({ onAdd }: ClientesEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
      title="Nenhum cliente cadastrado"
      description="Cadastre clientes para gerenciar mesas, leituras e vínculos com cobranças."
      actionLabel="Adicionar primeiro cliente"
      onAction={onAdd}
    />
  );
}
