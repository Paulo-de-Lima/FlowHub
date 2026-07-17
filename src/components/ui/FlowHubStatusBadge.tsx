import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  SemanticColors,
} from '@/constants/theme';

export type FlowHubStatusBadgeVariant =
  | 'pending'
  | 'collected'
  | 'debt'
  | 'ok'
  | 'quitado'
  | 'neutral';

type FlowHubStatusBadgeProps = {
  variant: FlowHubStatusBadgeVariant;
  label: string;
};

const VARIANT_STYLES: Record<
  FlowHubStatusBadgeVariant,
  { bg: string; text: string; border?: string }
> = {
  pending: { bg: FeatureColors.materialBg, text: FeatureColors.material, border: 'rgba(245, 158, 11, 0.25)' },
  collected: { bg: FeatureColors.incomeBg, text: FeatureColors.income, border: 'rgba(13, 148, 136, 0.2)' },
  debt: { bg: FlowHubPalette.expenseBg, text: FeatureColors.expense },
  ok: { bg: FeatureColors.incomeBg, text: FeatureColors.income },
  quitado: { bg: SemanticColors.successBg, text: SemanticColors.success, border: SemanticColors.successBorder },
  neutral: { bg: FlowHubPalette.surfaceSunken, text: FlowHubColors.darkGray },
};

export function FlowHubStatusBadge({ variant, label }: FlowHubStatusBadgeProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
      ]}>
      <ThemedText style={[styles.text, { color: v.text }]} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
