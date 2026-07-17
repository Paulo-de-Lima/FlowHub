import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';

type HomeEmptyStateProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  ctaLabel: string;
  onPress?: () => void;
};

export function HomeEmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onPress,
}: HomeEmptyStateProps) {
  return (
    <View style={[styles.container, cardShadowSoft]}>
      <View style={styles.iconWrap}>
        <SymbolView name={icon} size={28} tintColor={FlowHubColors.petroleum} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.description} themeColor="textSecondary">
        {description}
      </ThemedText>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={onPress}>
        <ThemedText style={styles.ctaLabel}>{ctaLabel}</ThemedText>
        <SymbolView
          name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
          size={14}
          tintColor={FlowHubColors.turquoise}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  ctaPressed: {
    opacity: 0.75,
  },
  ctaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
});
