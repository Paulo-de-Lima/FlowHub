import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';

type FinanceiroEmptyStateProps = {
  onAdd?: () => void;
};

export function FinanceiroEmptyState({ onAdd }: FinanceiroEmptyStateProps) {
  return (
    <FlowHubEmptyState
      icon={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
      title="Nenhum registro ainda"
      description="Registre receitas e despesas manuais para acompanhar o saldo do mês."
      actionLabel={onAdd ? 'Novo registro' : undefined}
      onAction={onAdd}
    />
  );
}
