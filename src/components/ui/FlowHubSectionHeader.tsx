import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Spacing, Typography } from '@/constants/theme';

type FlowHubSectionHeaderProps = {
  title: string;
  count?: number | string;
  actionLabel?: string;
  onAction?: () => void;
  uppercase?: boolean;
};

export function FlowHubSectionHeader({
  title,
  count,
  actionLabel,
  onAction,
  uppercase = true,
}: FlowHubSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <ThemedText style={[styles.title, uppercase && styles.titleUpper]}>{title}</ThemedText>
        {count != null ? (
          <View style={styles.countBadge}>
            <ThemedText style={styles.countText}>{count}</ThemedText>
          </View>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          accessibilityRole="button">
          <ThemedText style={styles.actionText}>{actionLabel}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: FlowHubColors.navy,
    fontSize: 15,
  },
  titleUpper: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 13,
  },
  countBadge: {
    backgroundColor: FlowHubPalette.kpiIconBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  action: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.one,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
  pressed: { opacity: 0.85 },
});
