import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type EstoqueEmptyStateProps = {
  onRegistrar: () => void;
};

export function EstoqueEmptyState({ onRegistrar }: EstoqueEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' }}
      title="Nenhum material cadastrado"
      description="Registre materiais com quantidade inicial, unidade e estoque mínimo."
      actionLabel="Registrar material"
      onAction={onRegistrar}
    />
  );
}
