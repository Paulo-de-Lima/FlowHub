import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { FlowHubColors, FlowHubPalette, HeaderTokens } from '@/constants/theme';

const TOP_BAR_SIZE = HeaderTokens.topRowMinHeight;

type HeaderLogoNotificationRowProps = {
  onNotificationPress?: () => void;
  showNotifications?: boolean;
};

/** Reservado para sino de notificações — oculto até existir feature real. */
export function HeaderLogoNotificationRow({
  onNotificationPress,
  showNotifications = false,
}: HeaderLogoNotificationRowProps) {
  if (!showNotifications) return null;

  return (
    <View style={styles.row}>
      <View style={styles.spacer} />
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
    justifyContent: 'flex-end',
    minHeight: TOP_BAR_SIZE,
  },
  spacer: { flex: 1 },
  notificationButton: {
    width: TOP_BAR_SIZE,
    height: TOP_BAR_SIZE,
    borderRadius: TOP_BAR_SIZE / 2,
    backgroundColor: FlowHubPalette.whiteSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
});
