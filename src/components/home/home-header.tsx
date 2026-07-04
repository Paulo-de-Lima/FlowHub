import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HomeBillingPreview } from '@/components/home/home-mock';
import { getLogoDimensions, LOGO_SOURCE } from '@/components/home/home-utils';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, HomeLayout, Radius, Spacing, Typography } from '@/constants/theme';

const TOP_BAR_SIZE = 40;

type HomeHeaderProps = {
  firstName: string;
  monthLabel: string;
  nextBilling: HomeBillingPreview | null;
  onNotificationPress?: () => void;
  onCobrancaPress?: () => void;
};

export function HomeHeader({
  firstName,
  monthLabel,
  nextBilling,
  onNotificationPress,
  onCobrancaPress,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const logoSize = getLogoDimensions(TOP_BAR_SIZE);
  const horizontalPadding = insets.left + Spacing.four;

  return (
    <LinearGradient
      colors={[FlowHubColors.navy, FlowHubColors.petroleum]}
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: Spacing.five + Math.abs(HomeLayout.heroOverlap),
          paddingLeft: horizontalPadding,
          paddingRight: insets.right + Spacing.four,
        },
      ]}>
      <View style={styles.topRow}>
        <View style={styles.logoSlot}>
          <Image
            source={LOGO_SOURCE}
            style={logoSize}
            resizeMode="contain"
            accessibilityLabel="FlowHub"
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
          onPress={onNotificationPress}
          accessibilityLabel="Notificações">
          <SymbolView
            name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
            size={20}
            tintColor={FlowHubColors.white}
          />
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <ThemedText style={styles.greeting}>Olá, {firstName}!</ThemedText>
        <ThemedText style={styles.subtitle}>Resumo de {monthLabel}</ThemedText>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cobrancaCard, pressed && styles.pressed]}
        onPress={onCobrancaPress}>
        <View style={styles.cobrancaAccent} />
        <View style={styles.cobrancaContent}>
          {nextBilling ? (
            <>
              <View style={styles.cobrancaTitleRow}>
                <SymbolView
                  name={{ ios: 'map.fill', android: 'map', web: 'map' }}
                  size={16}
                  tintColor={FlowHubColors.turquoise}
                />
                <ThemedText style={styles.cobrancaTitle}>
                  Próxima cobrança: {nextBilling.region}
                </ThemedText>
              </View>
              <ThemedText style={styles.cobrancaSubtitle}>{nextBilling.subtitle}</ThemedText>
            </>
          ) : (
            <>
              <View style={styles.cobrancaTitleRow}>
                <SymbolView
                  name={{ ios: 'calendar.badge.plus', android: 'event', web: 'event' }}
                  size={16}
                  tintColor={FlowHubColors.turquoise}
                />
                <ThemedText style={styles.cobrancaTitle}>Nenhuma cobrança agendada</ThemedText>
              </View>
              <ThemedText style={styles.cobrancaSubtitle}>
                Toque para planejar sua próxima rota
              </ThemedText>
            </>
          )}
        </View>
        <View style={styles.cobrancaChevronWrap}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            tintColor={FlowHubColors.turquoise}
          />
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: HomeLayout.headerBottomRadius,
    borderBottomRightRadius: HomeLayout.headerBottomRadius,
    overflow: 'hidden',
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TOP_BAR_SIZE,
  },
  logoSlot: {
    width: TOP_BAR_SIZE,
    height: TOP_BAR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: TOP_BAR_SIZE,
    height: TOP_BAR_SIZE,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingBlock: {
    gap: Spacing.one,
  },
  greeting: {
    ...Typography.greeting,
    color: FlowHubColors.white,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.72)',
  },
  cobrancaCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  cobrancaAccent: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  cobrancaContent: {
    flex: 1,
    gap: 3,
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
  },
  cobrancaChevronWrap: {
    justifyContent: 'center',
    paddingRight: Spacing.three,
  },
  cobrancaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cobrancaTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  cobrancaSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
