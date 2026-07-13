import { StyleSheet, View } from 'react-native';

import { cardShadowSoft, FlowHubColors, Radius, SemanticColors, Spacing } from '@/constants/theme';

export function ClienteListCardSkeleton() {
  return (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={styles.avatar} />
      <View style={styles.textCol}>
        <View style={styles.lineTitle} />
        <View style={styles.lineSub} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: SemanticColors.borderSubtle },
  textCol: { flex: 1, gap: 8 },
  lineTitle: { height: 16, width: '55%', borderRadius: 6, backgroundColor: SemanticColors.borderSubtle },
  lineSub: { height: 12, width: '40%', borderRadius: 4, backgroundColor: SemanticColors.borderSubtle },
});
