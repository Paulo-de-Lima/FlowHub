import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type KpiItem = {
  id: string;
  label: string;
  value: number;
  hint: string;
  icon: SymbolViewProps['name'];
  onPress?: () => void;
};

type HomeKpiStripProps = {
  clients: number;
  billings: number;
  criticalStock: number;
  onPressClients?: () => void;
  onPressBillings?: () => void;
  onPressStock?: () => void;
};

export function HomeKpiStrip({
  clients,
  billings,
  criticalStock,
  onPressClients,
  onPressBillings,
  onPressStock,
}: HomeKpiStripProps) {
  const items: KpiItem[] = [
    {
      id: 'clients',
      label: 'Clientes',
      value: clients,
      hint: 'ativos',
      icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
      onPress: onPressClients,
    },
    {
      id: 'billings',
      label: 'Cobranças',
      value: billings,
      hint: 'em aberto',
      icon: { ios: 'map.fill', android: 'map', web: 'map' },
      onPress: onPressBillings,
    },
    {
      id: 'stock',
      label: 'Estoque crítico',
      value: criticalStock,
      hint: 'itens',
      icon: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
      onPress: onPressStock,
    },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [styles.item, cardShadowSoft, pressed && styles.pressed]}
          onPress={item.onPress}>
          <View style={styles.iconWrap}>
            <SymbolView name={item.icon} size={18} tintColor={FlowHubColors.petroleum} />
          </View>
          <ThemedText style={styles.value}>{item.value}</ThemedText>
          <ThemedText style={styles.label}>{item.label}</ThemedText>
          <ThemedText style={styles.hint}>{item.hint}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E0F9F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: FlowHubColors.navy,
    lineHeight: 26,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  hint: {
    fontSize: 10,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
