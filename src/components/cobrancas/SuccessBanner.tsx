import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Radius, Spacing } from '@/constants/theme';

type SuccessBannerProps = {
  message: string;
  onDismiss: () => void;
};

export function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <Pressable style={styles.banner} onPress={onDismiss} accessibilityLabel="Fechar mensagem">
      <SymbolView
        name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
        size={18}
        tintColor="#16A34A"
      />
      <ThemedText style={styles.text}>{message}</ThemedText>
      <SymbolView
        name={{ ios: 'xmark', android: 'close', web: 'close' }}
        size={14}
        tintColor={FlowHubColors.petroleum}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.navy,
    lineHeight: 18,
  },
});
