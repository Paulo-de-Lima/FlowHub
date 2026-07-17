import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';

type FlowHubHeaderContextCardProps = {
  icon: SymbolViewProps['name'];
  title: string;
  subtitle: string;
  onPress?: () => void;
};

/** Mini-card no footer do header (faixa turquoise + fundo whiteSubtle). */
export function FlowHubHeaderContextCard({
  icon,
  title,
  subtitle,
  onPress,
}: FlowHubHeaderContextCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <SymbolView name={icon} size={16} tintColor={FlowHubColors.turquoise} />
          <ThemedText style={styles.title} numberOfLines={2}>
            {title}
          </ThemedText>
        </View>
        <ThemedText style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </ThemedText>
      </View>
      {onPress ? (
        <View style={styles.chevronWrap}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            tintColor={FlowHubColors.turquoise}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: FlowHubPalette.whiteSubtle,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  content: {
    flex: 1,
    gap: 3,
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
  },
  chevronWrap: {
    justifyContent: 'center',
    paddingRight: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  subtitle: {
    fontSize: 12,
    color: FlowHubPalette.whiteMuted,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
