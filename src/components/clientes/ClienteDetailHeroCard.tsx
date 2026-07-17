import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubHeroCardFrame } from '@/components/ui/FlowHubHeroCardFrame';
import { ThemedText } from '@/components/themed-text';
import {
  ClientesTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  Spacing,
  Typography,
} from '@/constants/theme';

type ClienteDetailHeroCardProps = {
  totalDeve: number;
  totalPago: number;
  qtdMesas: number;
  registrosPendentes: number;
};

export function ClienteDetailHeroCard({
  totalDeve,
  totalPago,
  qtdMesas,
  registrosPendentes,
}: ClienteDetailHeroCardProps) {
  const totalValor = totalPago + totalDeve;
  const progressPct = totalValor > 0 ? totalPago / totalValor : 0;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(progressPct, { duration: 300 });
  }, [progress, progressPct]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const mesasLabel = qtdMesas === 1 ? '1 mesa' : `${qtdMesas} mesas`;
  const pendentesLabel =
    registrosPendentes === 0
      ? 'nenhuma leitura pendente'
      : registrosPendentes === 1
        ? '1 leitura pendente'
        : `${registrosPendentes} leituras pendentes`;

  const valueColor = totalDeve > 0 ? FeatureColors.expense : FeatureColors.income;

  return (
    <FlowHubHeroCardFrame>
      <View style={styles.container}>
        <ThemedText style={[styles.eyebrow, { color: valueColor }]}>Total em aberto</ThemedText>
        <ThemedText style={[styles.heroValue, { color: valueColor }]}>
          {formatCurrency(totalDeve)}
        </ThemedText>

        <View style={styles.metricsRow}>
          <ThemedText style={styles.metricText}>
            Já pago:{' '}
            <ThemedText style={styles.metricValue}>{formatCurrency(totalPago)}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.metricDot}>·</ThemedText>
          <ThemedText style={styles.metricText}>{mesasLabel}</ThemedText>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, fillStyle]} />
        </View>

        <ThemedText style={styles.hint}>{pendentesLabel}</ThemedText>
      </View>
    </FlowHubHeroCardFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
  },
  heroValue: {
    ...Typography.heroValue,
    fontSize: 28,
    lineHeight: 34,
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
    color: FeatureColors.income,
  },
  metricDot: {
    fontSize: 13,
    color: FlowHubColors.darkGray,
  },
  progressTrack: {
    height: 6,
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
  },
});
