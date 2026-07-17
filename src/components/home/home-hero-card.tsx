import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/home/home-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  ClientesTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';

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
          <ThemedText style={[styles.metricValue, { color: FlowHubColors.petroleum }]}>
            {formatCurrency(revenue)}
          </ThemedText>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Despesas</ThemedText>
          <ThemedText style={[styles.metricValue, { color: FeatureColors.expense }]}>
            {formatCurrency(expenses)}
          </ThemedText>
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
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
    color: FlowHubColors.petroleum,
  },
  monthHint: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  profitValue: {
    ...ClientesTypography.heroValue,
    color: FlowHubColors.navy,
    marginTop: Spacing.one,
  },
  profitLabel: {
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
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
