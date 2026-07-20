import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { getMaterialDisplayDate, materialStatusBlockStyle, materialStatusLabel } from '@/components/estoque/estoque-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  CobrancaTypography,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { Material } from '@/services/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type MaterialListCardProps = {
  item: Material;
  onPress: () => void;
};

export function MaterialListCard({ item, onPress }: MaterialListCardProps) {
  const nome = item.nome?.trim() || 'Sem nome';
  const unidade = item.unidade?.trim() || 'un';
  const dataLabel = getMaterialDisplayDate(item);
  const status = materialStatusLabel(item.status);
  const topRowStyle = materialStatusBlockStyle(item.status);
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[styles.card, cardShadowSoft, pressStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      accessibilityLabel={`Editar material ${nome}`}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.nome} numberOfLines={2}>
          {nome}
        </ThemedText>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          tintColor={FlowHubColors.darkGray}
        />
      </View>

      <View style={styles.metricsBlock}>
        <View style={[styles.metricsRow, { backgroundColor: topRowStyle.backgroundColor }]}>
          <MetricColumn
            label="Quantidade"
            value={String(item.quantidade)}
            valueColor={topRowStyle.valueColor}
          />
          <View style={styles.metricDividerV} />
          <MetricColumn label="Status" value={status} valueColor={topRowStyle.valueColor} />
        </View>
        <View style={styles.metricDividerH} />
        <View style={[styles.metricsRow, styles.metricsRowBottom]}>
          <MetricColumn label="Unidade" value={unidade} />
          <View style={styles.metricDividerV} />
          <MetricColumn label="Estoque mínimo" value={String(item.estoqueMinimo)} />
        </View>
      </View>

      <ThemedText style={styles.dateLine}>
        Data <ThemedText style={styles.dateValue}>{dataLabel}</ThemedText>
      </ThemedText>
    </AnimatedPressable>
  );
}

function MetricColumn({
  label,
  value,
  valueColor = FlowHubColors.navy,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.metricColumn}>
      <ThemedText style={styles.metricLabel} numberOfLines={2}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.metricValue, { color: valueColor }]} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  nome: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: FlowHubColors.navy,
    lineHeight: 22,
  },
  metricsBlock: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    overflow: 'hidden',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  metricsRowBottom: {
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    gap: 6,
    minWidth: 0,
  },
  metricDividerV: {
    width: 1,
    backgroundColor: FlowHubPalette.borderSubtle,
  },
  metricDividerH: {
    height: 1,
    backgroundColor: FlowHubPalette.borderSubtle,
  },
  metricLabel: {
    ...CobrancaTypography.label,
    fontSize: 11,
    color: FlowHubColors.darkGray,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  dateLine: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  dateValue: {
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
});
