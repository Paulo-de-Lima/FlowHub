import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCobrancaTitulo,
  formatCurrency,
  formatIntervaloDias,
  formatProximaViagem,
  formatRepeticaoPrevista,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  ClientesTypography,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { Cobranca } from '@/services/api';

type CobrancasHeroCardProps = {
  proxima: Cobranca | null;
  onIniciar?: () => void;
  onCriar?: () => void;
};

export function CobrancasHeroCard({ proxima, onIniciar, onCriar }: CobrancasHeroCardProps) {
  if (!proxima) {
    return (
      <View style={[styles.container, cardShadow]}>
        <ThemedText style={styles.eyebrow}>Resumo geral</ThemedText>
        <ThemedText style={styles.heroValue}>—</ThemedText>
        <ThemedText style={styles.heroLabel}>Nenhuma viagem agendada</ThemedText>
        <Pressable style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]} onPress={onCriar}>
          <ThemedText style={styles.ctaText}>Criar viagem</ThemedText>
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            size={14}
            tintColor={FlowHubColors.turquoise}
          />
        </Pressable>
      </View>
    );
  }

  const titulo = formatCobrancaTitulo(proxima.nome);
  const progressPct =
    proxima.totalClientes > 0 ? proxima.clientesCobrados / proxima.totalClientes : 0;

  return (
    <View style={[styles.container, cardShadow]}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.eyebrow}>Próxima viagem</ThemedText>
        <ThemedText style={styles.dateHint}>
          {formatProximaViagem(proxima.proximaViagem, proxima.data_viagem)}
        </ThemedText>
      </View>

      <ThemedText style={styles.heroValue} numberOfLines={1}>
        {titulo}
      </ThemedText>
      <ThemedText style={styles.heroLabel}>
        {formatIntervaloDias(proxima.intervalo_dias)} · Retorno previsto em{' '}
        {formatRepeticaoPrevista(proxima.data_viagem, proxima.intervalo_dias)} ·{' '}
        {proxima.totalClientes} cliente
        {proxima.totalClientes !== 1 ? 's' : ''} vinculado
        {proxima.totalClientes !== 1 ? 's' : ''}
      </ThemedText>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Cobrados</ThemedText>
          <ThemedText style={[styles.metricValue, { color: FlowHubColors.turquoise }]}>
            {proxima.clientesCobrados}/{proxima.totalClientes}
          </ThemedText>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <ThemedText style={styles.metricLabel}>Arrecadado anterior</ThemedText>
          <ThemedText style={[styles.metricValueCompact, { color: FlowHubColors.petroleum }]}>
            {formatCurrency(proxima.totalArrecadadoAnterior)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      <Pressable style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]} onPress={onIniciar}>
        <ThemedText style={styles.ctaText}>Iniciar cobrança</ThemedText>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    ...ClientesTypography.sectionEyebrow,
    color: FlowHubColors.petroleum,
  },
  dateHint: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  heroValue: {
    ...ClientesTypography.heroValue,
    color: FlowHubColors.navy,
    marginTop: Spacing.one,
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
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
    marginHorizontal: Spacing.two,
  },
  metricLabel: { ...ClientesTypography.kpiLabel, color: FlowHubColors.darkGray },
  metricValue: { ...ClientesTypography.kpiValue },
  metricValueCompact: { fontSize: 16, fontWeight: '800' },
  progressTrack: {
    height: 5,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  progressFill: {
    height: '100%',
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: 3,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
