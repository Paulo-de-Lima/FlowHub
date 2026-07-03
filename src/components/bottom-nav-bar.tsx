import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors } from '@/constants/theme';

const TAB_ITEMS = [
  {
    name: 'home',
    label: 'Início',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  {
    name: 'clientes',
    label: 'Clientes',
    icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
  },
  {
    name: 'financeiro',
    label: 'Financeiro',
    icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  },
  {
    name: 'cobrancas',
    label: 'Cobranças',
    icon: { ios: 'map.fill', android: 'map', web: 'map' },
  },
  {
    name: 'estoque',
    label: 'Estoque',
    icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
  },
  {
    name: 'calculadora',
    label: 'Calculadora',
    icon: { ios: 'function', android: 'calculate', web: 'calculate' },
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

export function BottomNavBar({ state, navigation }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TAB_ITEMS.map((tab, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? FlowHubColors.turquoise : FlowHubColors.darkGray;

        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
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
            <SymbolView name={tab.icon} size={20} tintColor={color} />
            <ThemedText style={[styles.label, { color }]} numberOfLines={1}>
              {tab.label}
            </ThemedText>
            {isFocused && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: FlowHubColors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8EE',
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: FlowHubColors.turquoise,
  },
});
