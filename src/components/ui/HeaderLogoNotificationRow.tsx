import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { getLogoDimensions, LOGO_SOURCE } from '@/components/home/home-utils';
import { FlowHubColors, FlowHubPalette } from '@/constants/theme';

const TOP_BAR_SIZE = 40;

type HeaderLogoNotificationRowProps = {
  onNotificationPress?: () => void;
};

export function HeaderLogoNotificationRow({ onNotificationPress }: HeaderLogoNotificationRowProps) {
  const logoSize = getLogoDimensions(TOP_BAR_SIZE);

  return (
    <View style={styles.row}>
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
  );
}

const styles = StyleSheet.create({
  row: {
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
    backgroundColor: FlowHubPalette.whiteSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
});
