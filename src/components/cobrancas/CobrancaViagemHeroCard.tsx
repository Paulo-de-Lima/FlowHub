import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  ClientesTypography,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';

type CobrancaViagemHeroCardProps = {
  aReceber: number;
  cobradosMarcados: number;
  total: number;
};

export function CobrancaViagemHeroCard({
  aReceber,
  cobradosMarcados,
  total,
}: CobrancaViagemHeroCardProps) {
  const progressPct = total > 0 ? cobradosMarcados / total : 0;

  return (
    <View style={[styles.container, cardShadow]}>
      <ThemedText style={styles.eyebrow}>A receber agora</ThemedText>
      <ThemedText style={styles.heroValue}>{formatCurrency(aReceber)}</ThemedText>
      <ThemedText style={styles.subtitle}>
        {cobradosMarcados}/{total} visitados ·{' '}
        {Math.max(0, total - cobradosMarcados)} pendente
        {total - cobradosMarcados !== 1 ? 's' : ''}
      </ThemedText>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      <ThemedText style={styles.cobradoHint}>
        {cobradosMarcados === 0
          ? 'Nenhum cliente marcado como cobrado nesta viagem'
          : `${cobradosMarcados} cliente${cobradosMarcados !== 1 ? 's' : ''} marcado${cobradosMarcados !== 1 ? 's' : ''} como cobrado${cobradosMarcados !== 1 ? 's' : ''} nesta viagem`}
      </ThemedText>
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
    marginTop: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
    lineHeight: 18,
    marginBottom: Spacing.one,
  },
  progressTrack: {
    height: 5,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: 3,
  },
  cobradoHint: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
    lineHeight: 17,
    marginTop: Spacing.one,
  },
});
