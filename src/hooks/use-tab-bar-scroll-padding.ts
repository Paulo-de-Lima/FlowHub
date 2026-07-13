import { useBottomTabBarHeight } from 'expo-router/js-tabs';

import { Spacing } from '@/constants/theme';

/**
 * Padding inferior para ScrollView/FlatList dentro das tabs.
 * Usa a altura medida da tab bar flutuante + margem extra.
 *
 * @example
 * const scrollPad = useTabBarScrollPadding();
 * <FlatList contentContainerStyle={{ paddingBottom: scrollPad }} />
 */
export function useTabBarScrollPadding(extra = Spacing.four): number {
  const tabBarHeight = useBottomTabBarHeight();
  return tabBarHeight + extra;
}
