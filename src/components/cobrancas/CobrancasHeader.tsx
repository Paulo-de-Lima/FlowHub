import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getLogoDimensions, LOGO_SOURCE } from '@/components/home/home-utils';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, HomeLayout, Spacing, Typography } from '@/constants/theme';

const TOP_BAR_SIZE = 40;

type CobrancasHeaderProps = {
  totalViagens?: number;
  onNotificationPress?: () => void;
};

export function CobrancasHeader({ totalViagens = 0, onNotificationPress }: CobrancasHeaderProps) {
  const insets = useSafeAreaInsets();
  const logoSize = getLogoDimensions(TOP_BAR_SIZE);
  const horizontalPadding = insets.left + Spacing.four;

  const contadorLabel =
    totalViagens === 0
      ? 'Nenhuma viagem cadastrada'
      : totalViagens === 1
        ? '1 viagem cadastrada'
        : `${totalViagens} viagens cadastradas`;

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
            contentFit="contain"
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

      <View style={styles.textBlock}>
        <ThemedText style={styles.title}>Cobranças</ThemedText>
        <ThemedText style={styles.subtitle}>Suas viagens e arrecadações</ThemedText>
        <ThemedText style={styles.counter}>{contadorLabel}</ThemedText>
      </View>
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
  textBlock: {
    gap: Spacing.one,
  },
  title: {
    ...Typography.greeting,
    color: FlowHubColors.white,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  counter: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
