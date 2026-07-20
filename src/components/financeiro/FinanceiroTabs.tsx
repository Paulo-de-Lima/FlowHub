import { useEffect } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Spacing } from '@/constants/theme';

import type { FinanceiroTab } from './use-financeiro-screen';

const TAB_GAP = Spacing.one;
const SLIDE_DURATION = 220;

type FinanceiroTabsProps = {
  tab: FinanceiroTab;
  historicoCount: number;
  pendentesCount: number;
  onTabChange: (tab: FinanceiroTab) => void;
};

export function FinanceiroTabs({
  tab,
  historicoCount,
  pendentesCount,
  onTabChange,
}: FinanceiroTabsProps) {
  const segmentWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  const updateIndicator = (width: number, activeTab: FinanceiroTab) => {
    segmentWidth.value = width;
    indicatorX.value = activeTab === 'historico' ? 0 : width + TAB_GAP;
  };

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const totalWidth = event.nativeEvent.layout.width;
    const width = (totalWidth - TAB_GAP) / 2;
    updateIndicator(width, tab);
  };

  useEffect(() => {
    if (segmentWidth.value <= 0) return;
    indicatorX.value = withTiming(tab === 'historico' ? 0 : segmentWidth.value + TAB_GAP, {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [tab, indicatorX, segmentWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segmentWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={styles.track} onLayout={handleTrackLayout}>
      <Animated.View style={[styles.indicator, indicatorStyle]} pointerEvents="none" />

      <TabChip
        label="Histórico"
        count={historicoCount}
        active={tab === 'historico'}
        onPress={() => onTabChange('historico')}
      />
      <TabChip
        label="Pagamentos pendentes"
        count={pendentesCount}
        active={tab === 'pendentes'}
        onPress={() => onTabChange('pendentes')}
      />
    </View>
  );
}

function TabChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.chip}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
        {label} ({count})
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: TAB_GAP,
    position: 'relative',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    backgroundColor: FlowHubColors.white,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: FlowHubColors.navy,
    borderRadius: 20,
  },
  chip: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
    textAlign: 'center',
  },
  chipTextActive: { color: FlowHubColors.white },
});
