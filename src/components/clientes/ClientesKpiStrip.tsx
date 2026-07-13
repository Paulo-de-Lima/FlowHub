import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type ClientesKpiStripProps = {
  comMesa: number;
  emDia: number;
  pendentes: number;
};

export function ClientesKpiStrip({ comMesa, emDia, pendentes }: ClientesKpiStripProps) {
  const items: {
    id: string;
    label: string;
    value: string;
    hint: string;
    color: string;
    icon: SymbolViewProps['name'];
  }[] = [
    {
      id: 'mesa',
      label: 'Com mesa',
      value: String(comMesa),
      hint: 'cadastradas',
      color: FlowHubColors.petroleum,
      icon: { ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' },
    },
    {
      id: 'dia',
      label: 'Em dia',
      value: String(emDia),
      hint: 'sem pendência',
      color: FeatureColors.income,
      icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
    },
    {
      id: 'pend',
      label: 'Pendentes',
      value: String(pendentes),
      hint: 'com dívida',
      color: FeatureColors.expense,
      icon: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
    },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.id} style={[styles.item, cardShadowSoft]}>
          <View style={styles.iconWrap}>
            <SymbolView name={item.icon} size={18} tintColor={FlowHubColors.petroleum} />
          </View>
          <ThemedText style={[styles.value, { color: item.color }]}>{item.value}</ThemedText>
          <ThemedText style={styles.label}>{item.label}</ThemedText>
          <ThemedText style={styles.hint}>{item.hint}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
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
  value: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  label: { fontSize: 11, fontWeight: '700', color: FlowHubColors.navy, textAlign: 'center' },
  hint: { fontSize: 10, fontWeight: '500', color: FlowHubColors.darkGray, textAlign: 'center' },
});
