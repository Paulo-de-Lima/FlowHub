import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  ClientesTypography,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';

export type FlowHubKpiItem = {
  id: string;
  icon: SymbolViewProps['name'];
  value: string | number;
  label: string;
  hint?: string;
  valueColor?: string;
  iconColor?: string;
  iconBg?: string;
  /** Valores longos (moeda) — fonte menor, até 2 linhas sem ellipsis. */
  compact?: boolean;
  onPress?: () => void;
};

type FlowHubKpiGridProps = {
  items: FlowHubKpiItem[];
};

function isCompactValue(item: FlowHubKpiItem): boolean {
  if (item.compact != null) return item.compact;
  const text = String(item.value);
  return text.includes('R$') || text.length > 5;
}

function KpiCard({ item }: { item: FlowHubKpiItem }) {
  const iconBg = item.iconBg ?? FlowHubPalette.kpiIconBg;
  const iconColor = item.iconColor ?? FlowHubColors.petroleum;
  const compact = isCompactValue(item);

  const content = (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <SymbolView name={item.icon} size={18} tintColor={iconColor} />
      </View>
      <View style={styles.valueWrap}>
        <ThemedText
          style={[
            compact ? styles.valueCompact : styles.value,
            item.valueColor ? { color: item.valueColor } : null,
          ]}
          numberOfLines={compact ? 2 : 1}
          adjustsFontSizeToFit={!compact}
          minimumFontScale={compact ? 1 : 0.75}>
          {item.value}
        </ThemedText>
      </View>
      <ThemedText style={styles.label} numberOfLines={2}>
        {item.label}
      </ThemedText>
      {item.hint ? (
        <ThemedText style={styles.hint} numberOfLines={2}>
          {item.hint}
        </ThemedText>
      ) : null}
    </View>
  );

  if (item.onPress) {
    return (
      <Pressable
        onPress={item.onPress}
        style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
        accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return <View style={styles.cell}>{content}</View>;
}

export function FlowHubKpiGrid({ items }: FlowHubKpiGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <KpiCard key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    gap: 4,
    minHeight: 112,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  valueWrap: {
    width: '100%',
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  value: {
    ...ClientesTypography.kpiValue,
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  valueCompact: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  label: {
    ...ClientesTypography.kpiLabel,
    color: FlowHubColors.navy,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  hint: {
    fontSize: 10,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
