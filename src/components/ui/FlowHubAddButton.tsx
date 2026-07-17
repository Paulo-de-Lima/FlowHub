import { SymbolView, type SymbolViewProps } from 'expo-symbols';
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
  FeatureColors,
  FlowHubColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';

export type FlowHubAddButtonVariant = 'fab' | 'bar' | 'primary' | 'secondary' | 'success' | 'danger';

export type FlowHubAddButtonLeadingIcon = 'plus' | 'checkmark' | 'finance' | 'map' | 'trash';

type FlowHubAddButtonProps = {
  variant: FlowHubAddButtonVariant;
  label?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Ícone à direita (ex.: navegação). Padrão: nenhum em ações de adicionar. */
  trailingIcon?: 'chevron' | 'none';
  /** Exibir + à esquerda. Padrão true, exceto quando trailingIcon é chevron. */
  showPlus?: boolean;
  /** Ícone à esquerda no lugar do + (ex.: checkmark, financeiro, mapa). */
  leadingIcon?: FlowHubAddButtonLeadingIcon;
  /** `fill` ocupa a largura disponível; `hug` ajusta ao conteúdo (padrão em CTAs de card). */
  layout?: 'fill' | 'hug';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const PLUS_ICON = { ios: 'plus', android: 'add', web: 'add' } as const;
const CHECK_ICON = { ios: 'checkmark', android: 'check', web: 'check' } as const;
const FINANCE_ICON = { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' } as const;
const MAP_ICON = { ios: 'map.fill', android: 'map', web: 'map' } as const;
const TRASH_ICON = { ios: 'trash', android: 'delete', web: 'delete' } as const;
const CHEVRON_ICON = {
  ios: 'chevron.right',
  android: 'chevron_right',
  web: 'chevron_right',
} as const;

function resolveLeadingIcon(icon: FlowHubAddButtonLeadingIcon): SymbolViewProps['name'] {
  switch (icon) {
    case 'checkmark':
      return CHECK_ICON;
    case 'finance':
      return FINANCE_ICON;
    case 'map':
      return MAP_ICON;
    case 'trash':
      return TRASH_ICON;
    default:
      return PLUS_ICON;
  }
}

export function FlowHubAddButton({
  variant,
  label,
  onPress,
  accessibilityLabel,
  trailingIcon = 'none',
  showPlus,
  leadingIcon,
  layout,
  style,
  disabled,
}: FlowHubAddButtonProps) {
  const a11y = accessibilityLabel ?? label ?? 'Adicionar';
  const isNav = trailingIcon === 'chevron';
  const withPlus = showPlus ?? !isNav;
  const isDanger = variant === 'danger';
  const isBar = variant === 'bar';
  const resolvedLayout = layout ?? (isBar ? 'fill' : 'hug');
  const isHug = resolvedLayout === 'hug';
  const leftIcon = leadingIcon ? resolveLeadingIcon(leadingIcon) : PLUS_ICON;
  const showLeading =
    leadingIcon != null || (withPlus && variant !== 'success' && variant !== 'danger');
  const leadingTint = isDanger ? FeatureColors.expense : FlowHubColors.white;
  const useCompactText = variant === 'success' || variant === 'danger';

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
        isBar && styles.pillBar,
        isHug && styles.pillHug,
        !isHug && styles.pillFill,
        isNav && styles.pillNav,
        variant === 'success' && styles.pillSuccess,
        isDanger && styles.pillDanger,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={a11y}
      accessibilityRole="button">
      {isNav ? (
        <>
          <View style={styles.navLabelWrap}>
            {label ? (
              <ThemedText style={styles.pillText} numberOfLines={2}>
                {label}
              </ThemedText>
            ) : null}
          </View>
          <SymbolView name={CHEVRON_ICON} size={18} tintColor={FlowHubColors.white} />
        </>
      ) : (
        <View style={[styles.contentCluster, isHug && styles.contentClusterHug]}>
          {showLeading ? (
            <SymbolView name={leftIcon} size={18} tintColor={leadingTint} />
          ) : null}
          {label ? (
            <ThemedText
              style={[
                styles.pillText,
                useCompactText && styles.pillTextCompact,
                isDanger && styles.pillTextDanger,
              ]}
              numberOfLines={isHug ? 1 : 2}>
              {label}
            </ThemedText>
          ) : null}
        </View>
      )}
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
    justifyContent: 'center',
    backgroundColor: FlowHubColors.petroleum,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: 12,
    minHeight: 48,
  },
  pillBar: {
    borderRadius: Radius.lg,
  },
  pillHug: {
    alignSelf: 'center',
    maxWidth: '100%',
  },
  pillFill: {
    alignSelf: 'stretch',
  },
  pillNav: {
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  pillSuccess: {
    backgroundColor: SemanticColors.success,
  },
  pillDanger: {
    backgroundColor: FeatureColors.expenseBg,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  contentCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    flexShrink: 1,
    maxWidth: '100%',
  },
  contentClusterHug: {
    flexShrink: 0,
  },
  navLabelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.white,
    lineHeight: 20,
    flexShrink: 1,
    textAlign: 'center',
  },
  pillTextCompact: {
    fontSize: 13,
    lineHeight: 17,
  },
  pillTextDanger: {
    color: FeatureColors.expense,
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
  layout = 'fill',
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  layout?: 'fill' | 'hug';
}) {
  return (
    <FlowHubAddButton
      variant="primary"
      label={label}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}
      trailingIcon="chevron"
      showPlus={false}
      layout={layout}
      style={style}
    />
  );
}
