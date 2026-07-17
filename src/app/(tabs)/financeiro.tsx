import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function FinanceiroScreen() {
  return (
    <PlaceholderScreen
      title="Financeiro"
      description="Receitas, despesas e resumo mensal. Em breve."
      icon={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
    />
  );
}
