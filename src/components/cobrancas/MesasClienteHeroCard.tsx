import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
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

type MesasClienteHeroCardProps = {
  totalDeve: number;
  totalPago: number;
  mesasCount: number;
  registrosPendentes: number;
  cobrado?: boolean;
};

/** Dashboard financeiro do cliente — sem ações (ficam na toolbar abaixo). */
export function MesasClienteHeroCard({
  totalDeve,
  totalPago,
  mesasCount,
  registrosPendentes,
  cobrado = false,
}: MesasClienteHeroCardProps) {
  const totalValor = totalPago + totalDeve;
  const progressPct = totalValor > 0 ? totalPago / totalValor : 0;

  const mesasLabel = mesasCount === 1 ? '1 mesa' : `${mesasCount} mesas`;
  const pendentesLabel =
    registrosPendentes === 0
      ? 'Nenhuma leitura pendente'
      : registrosPendentes === 1
        ? '1 leitura pendente'
        : `${registrosPendentes} leituras pendentes`;

  return (
    <View style={[styles.container, cardShadow]}>
      <View style={styles.topRow}>
        <ThemedText style={styles.eyebrow}>Dívida em aberto</ThemedText>
        {cobrado ? <FlowHubStatusBadge variant="collected" label="Cobrado na viagem" /> : null}
      </View>

      <ThemedText style={[styles.heroValue, totalDeve > 0 && styles.heroValueExpense]}>
        {formatCurrency(totalDeve)}
      </ThemedText>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Já pago</ThemedText>
          <ThemedText style={[styles.metricValue, { color: FeatureColors.income }]}>
            {formatCurrency(totalPago)}
          </ThemedText>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Mesas</ThemedText>
          <ThemedText style={styles.metricValue}>{mesasLabel}</ThemedText>
        </View>
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
    gap: Spacing.one,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
    color: FlowHubColors.petroleum,
  },
  heroValue: {
    ...ClientesTypography.heroValue,
    color: FlowHubColors.navy,
    marginTop: Spacing.one,
  },
  heroValueExpense: { color: FeatureColors.expense },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: FlowHubPalette.borderSubtle,
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  metric: { flex: 1, gap: 4, alignItems: 'center' },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
    marginHorizontal: Spacing.two,
  },
  metricLabel: { ...ClientesTypography.kpiLabel, color: FlowHubColors.darkGray },
  metricValue: { ...ClientesTypography.kpiValue, color: FlowHubColors.navy },
  progressTrack: {
    height: 5,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: FeatureColors.income,
    borderRadius: 3,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
    lineHeight: 17,
    marginTop: Spacing.one,
  },
});
