import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';

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
    fontSize: 11,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: { fontSize: 36, fontWeight: '800', color: FlowHubColors.navy, lineHeight: 42 },
  heroLabel: { fontSize: 14, fontWeight: '500', color: FlowHubColors.darkGray, marginBottom: Spacing.two },
  metricsRow: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.two, borderTopWidth: 1, borderTopColor: '#E8EDF2' },
  metric: { flex: 1, gap: 4 },
  metricLabel: { fontSize: 11, fontWeight: '600', color: FlowHubColors.darkGray },
  metricValue: { fontSize: 22, fontWeight: '800' },
  metricValueCompact: { fontSize: 16, fontWeight: '800' },
  divider: { width: 1, height: 40, backgroundColor: '#E8EDF2', marginHorizontal: Spacing.two },
});
