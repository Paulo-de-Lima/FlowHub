import { StyleSheet, View } from 'react-native';

import { cardShadowSoft, FlowHubColors, Radius, SemanticColors, Spacing } from '@/constants/theme';

export function CobrancaClienteCardSkeleton() {
  return (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={styles.lineTitle} />
      <View style={styles.lineValue} />
      <View style={styles.lineBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  lineTitle: {
    height: 18,
    width: '55%',
    borderRadius: 6,
    backgroundColor: SemanticColors.borderSubtle,
  },
  lineValue: {
    height: 28,
    width: '40%',
    borderRadius: 8,
    backgroundColor: SemanticColors.borderSubtle,
  },
  lineBtn: {
    height: 44,
    width: '100%',
    borderRadius: Radius.md,
    backgroundColor: SemanticColors.borderSubtle,
  },
});
