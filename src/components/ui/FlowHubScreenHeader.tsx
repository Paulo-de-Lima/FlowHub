import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, HomeLayout, Spacing, Typography } from '@/constants/theme';

type FlowHubScreenHeaderProps = {
  title: string;
  subtitle?: string;
  footer?: string;
  variant?: 'root' | 'detail';
  /** Quando true, reserva espaço para hero card sobrepor o header (ex.: listas). */
  heroOverlap?: boolean;
  onBack?: () => void;
  /** Substitui a linha superior padrão (ex.: logo + sino). */
  headerTop?: ReactNode;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  headerBottom?: ReactNode;
};

export function FlowHubScreenHeader({
  title,
  subtitle,
  footer,
  variant = 'root',
  heroOverlap,
  onBack,
  headerTop,
  headerLeft,
  headerRight,
  headerBottom,
}: FlowHubScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const overlap = heroOverlap ?? !onBack;
  const bottomPad = Spacing.five + (overlap ? Math.abs(HomeLayout.heroOverlap) : 0);

  return (
    <LinearGradient
      colors={[...FlowHubPalette.gradientHeader]}
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: bottomPad,
          paddingLeft: insets.left + Spacing.four,
          paddingRight: insets.right + Spacing.four,
        },
      ]}>
      {headerTop ??
        (onBack || headerLeft || headerRight ? (
          <View style={styles.topRow}>
            {onBack ? (
              <Pressable
                style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                onPress={onBack}
                accessibilityLabel="Voltar">
                <SymbolView
                  name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                  size={20}
                  tintColor={FlowHubColors.white}
                />
              </Pressable>
            ) : (
              headerLeft ?? <View style={styles.topSpacer} />
            )}
            {headerRight ?? (onBack ? <View style={styles.topSpacer} /> : null)}
          </View>
        ) : null)}

      <View style={styles.textBlock}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>
        {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
        {footer ? <ThemedText style={styles.footer}>{footer}</ThemedText> : null}
      </View>

      {headerBottom}
    </LinearGradient>
  );
}

const TOP_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    width: '100%',
    borderBottomLeftRadius: HomeLayout.headerBottomRadius,
    borderBottomRightRadius: HomeLayout.headerBottomRadius,
    overflow: 'hidden',
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TOP_SIZE,
  },
  topSpacer: { width: TOP_SIZE, height: TOP_SIZE },
  backBtn: {
    width: TOP_SIZE,
    height: TOP_SIZE,
    borderRadius: TOP_SIZE / 2,
    backgroundColor: FlowHubPalette.whiteSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { gap: Spacing.one },
  title: {
    ...Typography.greeting,
    color: FlowHubColors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: { fontSize: 14, fontWeight: '500', color: FlowHubPalette.whiteMuted },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubPalette.whiteMuted,
    opacity: 0.85,
    marginTop: 2,
  },
  pressed: { opacity: 0.88 },
});
