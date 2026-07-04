import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/home/home-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, FeatureColors, FlowHubColors, Radius, Spacing, Typography } from '@/constants/theme';

type HomeHeroCardProps = {
  profit: number;
  revenue: number;
  expenses: number;
  monthLabel: string;
  onPressFinanceiro?: () => void;
};

export function HomeHeroCard({
  profit,
  revenue,
  expenses,
  monthLabel,
  onPressFinanceiro,
}: HomeHeroCardProps) {
  const hasMovement = revenue !== 0 || expenses !== 0;

  return (
    <View style={[styles.container, cardShadow]}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow}>Resultado do mês</ThemedText>
        <ThemedText style={styles.monthHint}>{monthLabel}</ThemedText>
      </View>

      <ThemedText style={styles.profitValue}>{formatCurrency(profit)}</ThemedText>
      <ThemedText style={styles.profitLabel}>
        {hasMovement ? 'Lucro líquido' : 'Sem movimentações ainda'}
      </ThemedText>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Receita</ThemedText>
          <ThemedText style={styles.metricValueIncome}>{formatCurrency(revenue)}</ThemedText>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Despesas</ThemedText>
          <ThemedText style={styles.metricValueExpense}>{formatCurrency(expenses)}</ThemedText>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
        onPress={onPressFinanceiro}>
        <ThemedText style={styles.linkText}>Ver financeiro</ThemedText>
        <SymbolView
          name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
          size={14}
          tintColor={FlowHubColors.turquoise}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  monthHint: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  profitValue: {
    ...Typography.heroValue,
    color: FlowHubColors.navy,
    marginTop: Spacing.one,
  },
  profitLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
    marginBottom: Spacing.one,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(57, 74, 90, 0.15)',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
  },
  metricValueIncome: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  metricValueExpense: {
    fontSize: 15,
    fontWeight: '700',
    color: FeatureColors.expense,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.one,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
  pressed: {
    opacity: 0.85,
  },
});
