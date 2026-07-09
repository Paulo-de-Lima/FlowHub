import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type CobrancaViagemKpiStripProps = {
  pendentes: number;
  cobrados: number;
  totalDeve: number;
};

type KpiItem = {
  id: string;
  label: string;
  displayValue: string;
  hint: string;
  valueColor: string;
  icon: SymbolViewProps['name'];
};

export function CobrancaViagemKpiStrip({
  pendentes,
  cobrados,
  totalDeve,
}: CobrancaViagemKpiStripProps) {
  const items: KpiItem[] = [
    {
      id: 'pendentes',
      label: 'Pendentes',
      displayValue: String(pendentes),
      hint: 'a cobrar',
      valueColor: FeatureColors.expense,
      icon: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
    },
    {
      id: 'cobrados',
      label: 'Cobrados',
      displayValue: String(cobrados),
      hint: 'nesta viagem',
      valueColor: FeatureColors.income,
      icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
    },
    {
      id: 'total',
      label: 'Total deve',
      displayValue: formatCurrency(totalDeve),
      hint: 'pendente',
      valueColor: FlowHubColors.petroleum,
      icon: { ios: 'banknote.fill', android: 'payments', web: 'payments' },
    },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.id} style={[styles.item, cardShadowSoft]}>
          <View style={styles.iconWrap}>
            <SymbolView name={item.icon} size={18} tintColor={FlowHubColors.petroleum} />
          </View>
          <ThemedText
            style={[
              styles.value,
              item.id === 'total' && styles.valueCompact,
              { color: item.valueColor },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {item.displayValue}
          </ThemedText>
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
  valueCompact: { fontSize: 13, lineHeight: 17 },
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
});
