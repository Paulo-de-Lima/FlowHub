import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type EstoqueEmptyStateProps = {
  onRegistrarCompra: () => void;
};

export function EstoqueEmptyState({ onRegistrarCompra }: EstoqueEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' }}
      title="Nenhum material cadastrado"
      description="Registre a primeira compra para controlar quantidades e níveis de estoque."
      actionLabel="Registrar compra"
      onAction={onRegistrarCompra}
    />
  );
}
