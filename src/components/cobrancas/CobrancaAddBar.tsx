import { Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, SemanticColors, Spacing } from '@/constants/theme';

type CobrancaAddBarProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function CobrancaAddBar({ label, onPress, accessibilityLabel }: CobrancaAddBarProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.bar, cardShadowSoft, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={{ ios: 'plus', android: 'add', web: 'add' }}
          size={18}
          tintColor={FlowHubColors.navy}
        />
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: FlowHubColors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  pressed: { opacity: 0.88 },
});
