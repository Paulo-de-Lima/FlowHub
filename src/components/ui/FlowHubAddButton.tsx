import { SymbolView } from 'expo-symbols';
import {
  type StyleProp,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  fabShadow,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';

export type FlowHubAddButtonVariant = 'fab' | 'bar' | 'primary' | 'secondary';

type FlowHubAddButtonProps = {
  variant: FlowHubAddButtonVariant;
  label?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Ícone à direita (ex.: navegação). Padrão: nenhum em ações de adicionar. */
  trailingIcon?: 'chevron' | 'none';
  /** Exibir + à esquerda. Padrão true, exceto quando trailingIcon é chevron. */
  showPlus?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const PLUS_ICON = { ios: 'plus', android: 'add', web: 'add' } as const;
const CHEVRON_ICON = {
  ios: 'chevron.right',
  android: 'chevron_right',
  web: 'chevron_right',
} as const;

export function FlowHubAddButton({
  variant,
  label,
  onPress,
  accessibilityLabel,
  trailingIcon = 'none',
  showPlus,
  style,
  disabled,
}: FlowHubAddButtonProps) {
  const a11y = accessibilityLabel ?? label ?? 'Adicionar';
  const isNav = trailingIcon === 'chevron';
  const withPlus = showPlus ?? !isNav;

  if (variant === 'fab') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          fabShadow,
          style,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={a11y}
        accessibilityRole="button">
        <SymbolView name={PLUS_ICON} size={28} tintColor={FlowHubColors.white} />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pill,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={a11y}
      accessibilityRole="button">
      <View style={styles.pillLeading}>
        {withPlus ? (
          <SymbolView name={PLUS_ICON} size={18} tintColor={FlowHubColors.white} />
        ) : null}
        {label ? (
          <ThemedText style={[styles.pillText, !withPlus && styles.pillTextSolo]} numberOfLines={2}>
            {label}
          </ThemedText>
        ) : null}
      </View>
      {trailingIcon === 'chevron' ? (
        <SymbolView name={CHEVRON_ICON} size={18} tintColor={FlowHubColors.white} />
      ) : null}
    </Pressable>
  );
}

const FAB_SIZE = 56;

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlowHubColors.petroleum,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.petroleum,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: 16,
    minHeight: 52,
  },
  pillLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minWidth: 0,
  },
  pillText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.white,
    lineHeight: 20,
  },
  pillTextSolo: {
    flex: 1,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});

/** Botão pill de navegação (sem +, com chevron). */
export function FlowHubNavButton({
  label,
  onPress,
  accessibilityLabel,
  style,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <FlowHubAddButton
      variant="primary"
      label={label}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}
      trailingIcon="chevron"
      showPlus={false}
      style={style}
    />
  );
}
