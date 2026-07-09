import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CobrancaTypography, FlowHubColors, Spacing } from '@/constants/theme';

export type BreadcrumbSegment = {
  label: string;
  onPress?: () => void;
};

type CobrancaBreadcrumbProps = {
  segments: BreadcrumbSegment[];
};

export function CobrancaBreadcrumb({ segments }: CobrancaBreadcrumbProps) {
  if (segments.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {segments.map((seg, index) => {
        const isLast = index === segments.length - 1;
        return (
          <View key={`${seg.label}-${index}`} style={styles.segmentRow}>
            {index > 0 ? (
              <ThemedText style={styles.separator} accessibilityElementsHidden>
                ›
              </ThemedText>
            ) : null}
            {seg.onPress && !isLast ? (
              <Pressable
                onPress={seg.onPress}
                accessibilityRole="link"
                accessibilityLabel={`Ir para ${seg.label}`}
                hitSlop={4}>
                <ThemedText style={styles.link} numberOfLines={1}>
                  {seg.label}
                </ThemedText>
              </Pressable>
            ) : (
              <ThemedText
                style={[styles.text, isLast && styles.textActive]}
                numberOfLines={1}
                accessibilityLabel={isLast ? `Página atual: ${seg.label}` : seg.label}>
                {seg.label}
              </ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    gap: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
  },
  separator: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
    opacity: 0.6,
  },
  link: {
    ...CobrancaTypography.label,
    color: FlowHubColors.petroleum,
    textDecorationLine: 'underline',
    maxWidth: 140,
  },
  text: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
    maxWidth: 140,
  },
  textActive: {
    color: FlowHubColors.navy,
    fontWeight: '700',
    maxWidth: 180,
  },
});
