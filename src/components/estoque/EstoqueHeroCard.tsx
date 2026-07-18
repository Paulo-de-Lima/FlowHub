import { StyleSheet, View } from 'react-native';

import { FlowHubHeroCardFrame } from '@/components/ui/FlowHubHeroCardFrame';
import { ThemedText } from '@/components/themed-text';
import {
  ClientesTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  Spacing,
} from '@/constants/theme';

type EstoqueHeroCardProps = {
  total: number;
  criticos: number;
  baixos?: number;
  vazios?: number;
};

export function EstoqueHeroCard({ total, criticos, baixos, vazios }: EstoqueHeroCardProps) {
  const showBreakdown = baixos != null && vazios != null;

  return (
    <FlowHubHeroCardFrame>
      <View style={styles.container}>
        <ThemedText style={styles.eyebrow}>Resumo</ThemedText>
        <ThemedText style={styles.heroValue}>{total}</ThemedText>
        <ThemedText style={styles.heroLabel}>
          {total === 1 ? 'material cadastrado' : 'materiais cadastrados'}
        </ThemedText>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <ThemedText style={styles.metricLabel}>Críticos</ThemedText>
            <ThemedText style={[styles.metricValue, { color: FeatureColors.expense }]}>
              {criticos}
            </ThemedText>
          </View>
          {showBreakdown ? (
            <>
              <View style={styles.divider} />
              <View style={styles.metric}>
                <ThemedText style={styles.metricLabel}>Baixo</ThemedText>
                <ThemedText style={[styles.metricValue, { color: FeatureColors.material }]}>
                  {baixos}
                </ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.metric}>
                <ThemedText style={styles.metricLabel}>Vazio</ThemedText>
                <ThemedText style={[styles.metricValue, { color: FeatureColors.expense }]}>
                  {vazios}
                </ThemedText>
              </View>
            </>
          ) : null}
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
  divider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
    marginHorizontal: Spacing.two,
  },
});
