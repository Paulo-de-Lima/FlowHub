import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, FeatureColors, FlowHubColors, Radius, Spacing, Typography } from '@/constants/theme';

type MesasClienteHeroCardProps = {
  totalDeve: number;
  totalPago: number;
  mesasCount: number;
  registrosPendentes: number;
};

export function MesasClienteHeroCard({
  totalDeve,
  totalPago,
  mesasCount,
  registrosPendentes,
}: MesasClienteHeroCardProps) {
  const totalValor = totalPago + totalDeve;
  const progressPct = totalValor > 0 ? totalPago / totalValor : 0;

  const mesasLabel = mesasCount === 1 ? '1 mesa' : `${mesasCount} mesas`;
  const pendentesLabel =
    registrosPendentes === 0
      ? 'nenhuma leitura pendente'
      : registrosPendentes === 1
        ? '1 leitura pendente'
        : `${registrosPendentes} leituras pendentes`;

  return (
    <View style={[styles.container, cardShadow]}>
      <ThemedText style={styles.eyebrow}>Dívida em aberto</ThemedText>
      <ThemedText style={styles.heroValue}>{formatCurrency(totalDeve)}</ThemedText>

      <View style={styles.metricsRow}>
        <ThemedText style={styles.metricText}>
          Já pago: <ThemedText style={styles.metricValue}>{formatCurrency(totalPago)}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.metricDot}>·</ThemedText>
        <ThemedText style={styles.metricText}>{mesasLabel}</ThemedText>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      <ThemedText style={styles.hint}>{pendentesLabel}</ThemedText>
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
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: FeatureColors.expense,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroValue: {
    ...Typography.heroValue,
    fontSize: 28,
    lineHeight: 34,
    color: FeatureColors.expense,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.one,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  metricValue: {
    fontWeight: '700',
    color: '#16A34A',
  },
  metricDot: {
    fontSize: 13,
    color: FlowHubColors.darkGray,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8EE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
    lineHeight: 17,
  },
});
