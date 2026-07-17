import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, HeaderTypography, Radius, Spacing } from '@/constants/theme';

type FlowHubHeaderFooterChipProps = {
  label: string;
};

export function FlowHubHeaderFooterChip({ label }: FlowHubHeaderFooterChipProps) {
  return (
    <View style={styles.chip}>
      <View style={styles.dot} />
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: FlowHubPalette.whiteSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  label: {
    ...HeaderTypography.footer,
    color: FlowHubColors.white,
    opacity: 0.92,
  },
});
