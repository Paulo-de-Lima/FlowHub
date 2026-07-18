import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

import { formatMonthLabel } from './financeiro-utils';

type FinanceiroHeaderProps = {
  mes: string;
};

export function FinanceiroHeader({ mes }: FinanceiroHeaderProps) {
  return (
    <FlowHubScreenHeader
      layout="root-tab"
      title="Financeiro"
      subtitle="Receitas, despesas e saldo mensal"
      footer={formatMonthLabel(mes)}
      moduleIcon={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
    />
  );
}
