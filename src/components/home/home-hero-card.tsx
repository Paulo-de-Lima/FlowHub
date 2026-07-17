import { View, StyleSheet } from 'react-native';

import { formatCurrency } from '@/components/home/home-utils';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubHeroCardFrame } from '@/components/ui/FlowHubHeroCardFrame';
import { ThemedText } from '@/components/themed-text';
import {
  ClientesTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  Spacing,
} from '@/constants/theme';

type HomeHeroCardProps = {
  profit: number;
  revenue: number;
  expenses: number;
  monthLabel: string;
  onPressFinanceiro?: () => void;
};

function formatResultadosTitle(monthLabel: string) {
  const month = monthLabel.charAt(0).toLowerCase() + monthLabel.slice(1);
  return `Resultados de ${month}`;
}

export function HomeHeroCard({
  profit,
  revenue,
  expenses,
  monthLabel,
  onPressFinanceiro,
}: HomeHeroCardProps) {
  const hasMovement = revenue !== 0 || expenses !== 0;

  return (
    <FlowHubHeroCardFrame>
      <View style={styles.container}>
        <ThemedText style={styles.eyebrow}>{formatResultadosTitle(monthLabel)}</ThemedText>

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

        {onPressFinanceiro ? (
          <FlowHubAddButton
            variant="success"
            label="Ver financeiro"
            leadingIcon="finance"
            showPlus={false}
            onPress={onPressFinanceiro}
            accessibilityLabel="Ver financeiro"
            style={styles.cta}
          />
        ) : null}
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
  cta: { marginTop: Spacing.two },
});
