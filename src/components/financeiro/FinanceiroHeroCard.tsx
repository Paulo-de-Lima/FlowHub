import { View, StyleSheet } from 'react-native';

import { FlowHubHeroCardFrame } from '@/components/ui/FlowHubHeroCardFrame';
import { ThemedText } from '@/components/themed-text';
import {
  ClientesTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  Spacing,
} from '@/constants/theme';

import {
  formatCurrency,
  formatMonthShort,
  getSaldoColor,
  getSaldoLabel,
} from './financeiro-utils';

type FinanceiroHeroCardProps = {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

function formatResultadosTitle(mes: string) {
  const month = formatMonthShort(mes).toLowerCase();
  return `Resultados de ${month}`;
}

export function FinanceiroHeroCard({ mes, receitas, despesas, saldo }: FinanceiroHeroCardProps) {
  const hasMovement = receitas !== 0 || despesas !== 0;

  return (
    <FlowHubHeroCardFrame>
      <View style={styles.container}>
        <ThemedText style={styles.eyebrow}>{formatResultadosTitle(mes)}</ThemedText>

        <ThemedText style={[styles.saldoValue, { color: getSaldoColor(saldo) }]}>
          {formatCurrency(saldo)}
        </ThemedText>
        <ThemedText style={styles.saldoLabel}>
          {hasMovement ? getSaldoLabel(saldo) : 'Sem movimentações ainda'}
        </ThemedText>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <ThemedText style={styles.metricLabel}>Receitas</ThemedText>
            <ThemedText style={[styles.metricValue, { color: FeatureColors.income }]}>
              {formatCurrency(receitas)}
            </ThemedText>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <ThemedText style={styles.metricLabel}>Despesas</ThemedText>
            <ThemedText style={[styles.metricValue, { color: FeatureColors.expense }]}>
              {formatCurrency(despesas)}
            </ThemedText>
          </View>
        </View>
      </View>
    </FlowHubHeroCardFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
    color: FlowHubColors.petroleum,
  },
  saldoValue: {
    ...ClientesTypography.heroValue,
    marginTop: Spacing.one,
  },
  saldoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
    marginBottom: Spacing.two,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: FlowHubPalette.borderSubtle,
  },
  metric: { flex: 1, gap: 4, alignItems: 'center' },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
    marginHorizontal: Spacing.two,
  },
  metricLabel: { ...ClientesTypography.kpiLabel, color: FlowHubColors.darkGray },
  metricValue: { ...ClientesTypography.kpiValue },
});
