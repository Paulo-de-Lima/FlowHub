import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, HeaderTypography } from '@/constants/theme';

export type HeaderBreadcrumbSegment = {
  label: string;
  onPress?: () => void;
};

type FlowHubHeaderBreadcrumbProps = {
  segments: HeaderBreadcrumbSegment[];
};

/** Trilha compacta para uso dentro do gradiente do header. */
export function FlowHubHeaderBreadcrumb({ segments }: FlowHubHeaderBreadcrumbProps) {
  if (segments.length === 0) return null;

  return (
    <View style={styles.wrap} accessibilityRole="text">
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
    gap: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
  },
  separator: {
    ...HeaderTypography.breadcrumb,
    color: FlowHubPalette.whiteMuted,
    opacity: 0.75,
  },
  link: {
    ...HeaderTypography.breadcrumb,
    color: 'rgba(255, 255, 255, 0.85)',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255, 255, 255, 0.35)',
    maxWidth: 160,
  },
  text: {
    ...HeaderTypography.breadcrumb,
    color: FlowHubPalette.whiteMuted,
    opacity: 0.85,
    maxWidth: 160,
  },
  textActive: {
    color: FlowHubColors.white,
    opacity: 1,
    fontWeight: '700',
    maxWidth: 200,
  },
});
