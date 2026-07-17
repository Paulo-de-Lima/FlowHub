import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { Spacing } from '@/constants/theme';

type CobrancaAddBarProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** @deprecated Use FlowHubAddButton variant="bar" */
export function CobrancaAddBar({ label, onPress, accessibilityLabel }: CobrancaAddBarProps) {
  return (
    <FlowHubAddButton
      variant="bar"
      label={label}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={{ marginHorizontal: Spacing.four, marginTop: Spacing.two }}
    />
  );
}
