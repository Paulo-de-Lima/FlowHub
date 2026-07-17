import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { FlowHubColors, FlowHubPalette, Radius, SemanticColors, Spacing } from '@/constants/theme';

export function ClienteListCardSkeleton() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.2,
  }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.avatar, shimmerStyle]} />
      <View style={styles.textCol}>
        <Animated.View style={[styles.lineTitle, shimmerStyle]} />
        <Animated.View style={[styles.lineSub, shimmerStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  textCol: { flex: 1, gap: 8 },
  lineTitle: {
    height: 16,
    width: '55%',
    borderRadius: 6,
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  lineSub: {
    height: 12,
    width: '40%',
    borderRadius: 4,
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
});
