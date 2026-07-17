import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Spacing } from '@/constants/theme';

type FlowHubEmptyStateProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function FlowHubEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: FlowHubEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <SymbolView name={icon} size={40} tintColor={FlowHubColors.petroleum} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.text} themeColor="textSecondary">
        {description}
      </ThemedText>
      {actionLabel && onAction ? (
        <FlowHubAddButton
          variant="primary"
          label={actionLabel}
          onPress={onAction}
          style={styles.cta}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: FlowHubPalette.kpiIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: FlowHubColors.navy, textAlign: 'center' },
  text: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 300 },
  cta: { marginTop: Spacing.two, alignSelf: 'stretch', maxWidth: 320, marginHorizontal: 0 },
});
