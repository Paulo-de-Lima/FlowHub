import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';

export type FlowHubKpiItem = {
  value: string | number;
  label: string;
  color?: string;
  onPress?: () => void;
};

type FlowHubKpiStripProps = {
  items: FlowHubKpiItem[];
};

function KpiSegment({ item }: { item: FlowHubKpiItem }) {
  const content = (
    <View style={styles.item}>
      <ThemedText style={[styles.value, item.color ? { color: item.color } : null]}>
        {item.value}
      </ThemedText>
      <ThemedText style={styles.label}>{item.label}</ThemedText>
    </View>
  );

  if (item.onPress) {
    return (
      <Pressable
        onPress={item.onPress}
        accessibilityRole="button"
        style={({ pressed }) => [pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export function FlowHubKpiStrip({ items }: FlowHubKpiStripProps) {
  return (
    <View style={styles.strip}>
      {items.map((item, index) => (
        <View key={`${item.label}-${index}`} style={styles.segment}>
          {index > 0 ? <ThemedText style={styles.dot}>·</ThemedText> : null}
          <KpiSegment item={item} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 56,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: FlowHubColors.navy,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  dot: {
    fontSize: 14,
    color: FlowHubColors.darkGray,
    opacity: 0.4,
  },
  pressed: { opacity: 0.88 },
});
