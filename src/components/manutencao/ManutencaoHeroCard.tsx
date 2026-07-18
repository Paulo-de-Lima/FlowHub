import { View, StyleSheet } from 'react-native';

import { getCurrentMonthLabel } from '@/components/home/home-utils';
import { FlowHubHeroCardFrame } from '@/components/ui/FlowHubHeroCardFrame';
import { ThemedText } from '@/components/themed-text';
import {
  ClientesTypography,
  FlowHubColors,
  FlowHubPalette,
  Spacing,
} from '@/constants/theme';

type ManutencaoHeroCardProps = {
  totalMes: number;
  materiaisUsados: number;
};

function formatHeroTitle(monthLabel: string) {
  const month = monthLabel.charAt(0).toLowerCase() + monthLabel.slice(1);
  return `Resumo de ${month}`;
}

export function ManutencaoHeroCard({ totalMes, materiaisUsados }: ManutencaoHeroCardProps) {
  const monthLabel = getCurrentMonthLabel();

  return (
    <FlowHubHeroCardFrame>
      <View style={styles.container}>
        <ThemedText style={styles.eyebrow}>{formatHeroTitle(monthLabel)}</ThemedText>

        <ThemedText style={styles.heroValue}>{totalMes}</ThemedText>
        <ThemedText style={styles.heroLabel}>
          {totalMes === 1 ? 'Manutenção registrada' : 'Manutenções registradas'}
        </ThemedText>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <ThemedText style={styles.metricLabel}>Materiais consumidos</ThemedText>
            <ThemedText style={[styles.metricValue, { color: FlowHubColors.turquoise }]}>
              {materiaisUsados}
            </ThemedText>
          </View>
        </View>
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
  metric: { flex: 1, gap: 4, alignItems: 'center' },
  metricLabel: { ...ClientesTypography.kpiLabel, color: FlowHubColors.darkGray },
  metricValue: { ...ClientesTypography.kpiValue },
});
