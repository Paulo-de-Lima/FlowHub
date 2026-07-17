import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
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

type ClientesHeroCardProps = {
  total: number;
  comDivida: number;
  totalReceber: number;
};

export function ClientesHeroCard({ total, comDivida, totalReceber }: ClientesHeroCardProps) {
  return (
    <View style={[styles.container, cardShadow]}>
      <ThemedText style={styles.eyebrow}>Resumo</ThemedText>
      <ThemedText style={styles.heroValue}>{total}</ThemedText>
      <ThemedText style={styles.heroLabel}>
        {total === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
      </ThemedText>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Com dívida</ThemedText>
          <ThemedText style={[styles.metricValue, { color: FeatureColors.expense }]}>
            {comDivida}
          </ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Total a receber</ThemedText>
          <ThemedText style={[styles.metricValueCompact, { color: FlowHubColors.petroleum }]}>
            {formatCurrency(totalReceber)}
          </ThemedText>
        </View>
      </View>
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
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
    color: FlowHubColors.petroleum,
  },
  heroValue: {
    ...ClientesTypography.heroValue,
    color: FlowHubColors.navy,
  },
  heroLabel: {
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
  metric: { flex: 1, gap: 4 },
  metricLabel: { ...ClientesTypography.kpiLabel, color: FlowHubColors.darkGray },
  metricValue: { ...ClientesTypography.kpiValue },
  metricValueCompact: { fontSize: 16, fontWeight: '800' },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
    marginHorizontal: Spacing.two,
  },
});
