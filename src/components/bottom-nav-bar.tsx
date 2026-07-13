import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { useCallback, useContext, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_FLOATING_MARGIN,
  TAB_BAR_PILL_HEIGHT,
  TabBarTokens,
  Spacing,
  tabBarFloatingShadow,
} from '@/constants/theme';

import { BottomTabBarHeightCallbackContext } from 'expo-router/js-tabs';

export {
  TAB_BAR_FLOATING_MARGIN,
  TAB_BAR_PILL_HEIGHT,
  TabBarHeight,
  getTabBarBottomOffset,
} from '@/constants/theme';

/**
 * Tab bar flutuante — padding de listas / FABs: use `useTabBarScrollPadding()` de
 * `@/hooks/use-tab-bar-scroll-padding` (altura medida via onLayout + safe area).
 */

const TAB_ITEMS = [
  {
    name: 'home',
    label: 'Início',
    iconActive: { ios: 'house.fill', android: 'home', web: 'home' },
    iconInactive: { ios: 'house', android: 'home', web: 'home' },
  },
  {
    name: 'cobrancas',
    label: 'Cobranças',
    iconActive: { ios: 'map.fill', android: 'map', web: 'map' },
    iconInactive: { ios: 'map', android: 'map', web: 'map' },
  },
  {
    name: 'clientes',
    label: 'Clientes',
    iconActive: { ios: 'person.2.fill', android: 'group', web: 'group' },
    iconInactive: { ios: 'person.2', android: 'group', web: 'group' },
  },
  {
    name: 'financeiro',
    label: 'Financeiro',
    iconActive: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
    iconInactive: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  },
  {
    name: 'estoque',
    label: 'Estoque',
    iconActive: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
    iconInactive: { ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' },
  },
  {
    name: 'calculadora',
    label: 'Calculadora',
    iconActive: { ios: 'function', android: 'calculate', web: 'calculate' },
    iconInactive: { ios: 'function', android: 'calculate', web: 'calculate' },
  },
] as const;

export type BottomNavBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: Record<string, unknown>) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

function TabBarPillBackground({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const pillStyle = [styles.pill, tabBarFloatingShadow, style];
  const useNativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  if (useNativeGlass) {
    return (
      <GlassView
        style={pillStyle}
        tintColor={TabBarTokens.pillBg}
        glassEffectStyle="regular"
        colorScheme="dark"
        isInteractive>
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[pillStyle, styles.pillFallback, Platform.OS === 'web' && styles.pillWeb]}>
      {children}
    </View>
  );
}

export function BottomNavBar({ state, navigation }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const bottomInset = Math.max(insets.bottom, 8);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onHeightChange?.(event.nativeEvent.layout.height);
    },
    [onHeightChange],
  );

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.shell,
        Platform.OS === 'web' ? styles.shellWeb : styles.shellNative,
        { paddingBottom: bottomInset + TAB_BAR_FLOATING_MARGIN },
      ]}
      pointerEvents="box-none">
      <TabBarPillBackground>
        <View style={styles.tabsRow}>
          {TAB_ITEMS.map((tab, index) => {
            const isFocused = state.index === index;
            const iconColor = isFocused ? TabBarTokens.iconActive : TabBarTokens.iconInactive;

            return (
              <Pressable
                key={tab.name}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: state.routes[index].key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(tab.name);
                  }
                }}
                style={styles.tab}>
                <View style={styles.tabInner}>
                  {isFocused ? <View style={styles.activeCircle} /> : null}
                  <SymbolView
                    name={isFocused ? tab.iconActive : tab.iconInactive}
                    size={TabBarTokens.iconSize}
                    tintColor={iconColor}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </TabBarPillBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  shellWeb: {
    position: 'fixed',
    zIndex: 1000,
  },
  shellNative: {
    position: 'absolute',
  },
  pill: {
    width: `${TabBarTokens.widthRatio * 100}%`,
    maxWidth: TabBarTokens.maxWidth,
    height: TAB_BAR_PILL_HEIGHT,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: TabBarTokens.pillBorder,
    overflow: 'hidden',
  },
  pillFallback: {
    backgroundColor: TabBarTokens.pillBg,
  },
  pillWeb: {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  } as ViewStyle,
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabInner: {
    width: TabBarTokens.activeCircleSize,
    height: TabBarTokens.activeCircleSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    ...StyleSheet.absoluteFill,
    borderRadius: TabBarTokens.activeCircleSize / 2,
    backgroundColor: TabBarTokens.activeCircle,
  },
});
