import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Radius, Spacing } from '@/constants/theme';

type FlowHubToastProps = {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
};

export function FlowHubToast({ message, onDismiss, durationMs = 2500 }: FlowHubToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  return (
    <View
      style={[styles.container, { top: insets.top + Spacing.two }]}
      pointerEvents="box-none"
      accessibilityLiveRegion="polite">
      <Pressable
        style={styles.toast}
        onPress={onDismiss}
        accessibilityLabel={`${message}. Toque para fechar.`}>
        <SymbolView
          name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
          size={18}
          tintColor={FlowHubColors.white}
        />
        <ThemedText style={styles.text}>{message}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    zIndex: 100,
    alignItems: 'center',
    ...Platform.select({
      web: { maxWidth: 480, alignSelf: 'center', left: 0, right: 0, marginHorizontal: 'auto' as unknown as number },
      default: {},
    }),
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(20, 200, 196, 0.35)' },
      default: {
        shadowColor: FlowHubColors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.navy,
    lineHeight: 20,
  },
});
