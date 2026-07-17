import { type StyleProp, type ViewStyle } from 'react-native';

import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { Spacing } from '@/constants/theme';

type CobrancaAddBarProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** @deprecated Use FlowHubAddButton variant="bar" */
export function CobrancaAddBar({ label, onPress, accessibilityLabel, style }: CobrancaAddBarProps) {
  return (
    <FlowHubAddButton
      variant="bar"
      label={label}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[{ marginHorizontal: Spacing.four, marginTop: Spacing.two }, style]}
    />
  );
}
