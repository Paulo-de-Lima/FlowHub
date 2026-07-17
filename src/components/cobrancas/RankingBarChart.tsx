import { useEffect } from 'react';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';
import type { DashboardRankingItem } from '@/services/api';

const BAR_MAX_HEIGHT = 88;

type RankingBarChartProps = {
  title: string;
  items: DashboardRankingItem[];
  formatValue: (value: number) => string;
  barColor: string;
};

export function RankingBarChart({ title, items, formatValue, barColor }: RankingBarChartProps) {
  const slots = items.length > 0 ? items : [];
  const maxValor = Math.max(...slots.map((i) => i.valor), 1);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>

      {slots.length === 0 ? (
        <View style={styles.emptyChart}>
          <SymbolView
            name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }}
            size={28}
            tintColor={FlowHubColors.darkGray}
          />
          <ThemedText style={styles.emptyText} themeColor="textSecondary">
            Sem dados para exibir
          </ThemedText>
        </View>
      ) : (
        <View style={styles.chartArea}>
          {slots.map((item) => (
            <BarColumn
              key={item.id}
              item={item}
              maxValor={maxValor}
              barColor={barColor}
              formatValue={formatValue}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function BarColumn({
  item,
  maxValor,
  barColor,
  formatValue,
}: {
  item: DashboardRankingItem;
  maxValor: number;
  barColor: string;
  formatValue: (v: number) => string;
}) {
  const targetHeight = Math.max(12, (item.valor / maxValor) * BAR_MAX_HEIGHT);
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(targetHeight, { duration: 450 });
  }, [targetHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={styles.column}>
      <ThemedText style={styles.barValue} numberOfLines={1}>
        {formatValue(item.valor)}
      </ThemedText>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.bar, { backgroundColor: barColor }, barStyle]} />
      </View>
      <ThemedText style={styles.barLabel} numberOfLines={2}>
        {shortLabel(item.label)}
      </ThemedText>
    </View>
  );
}

function shortLabel(label: string) {
  const city = label.split(' - ')[0]?.trim();
  return city || label;
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    minHeight: 180,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: Spacing.two,
    minHeight: BAR_MAX_HEIGHT + 52,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  barTrack: {
    height: BAR_MAX_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '85%',
    minWidth: 36,
    maxWidth: 56,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
    textAlign: 'center',
    minHeight: 28,
  },
  emptyChart: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlowHubPalette.surfaceTint,
    borderRadius: Radius.md,
    gap: Spacing.two,
  },
  emptyText: {
    fontSize: 13,
  },
});
