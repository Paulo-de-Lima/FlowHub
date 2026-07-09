import { StyleSheet, View } from 'react-native';

import { cardShadowSoft, FlowHubColors, Radius, SemanticColors, Spacing } from '@/constants/theme';

export function MesaAccordionSkeleton() {
  return (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={styles.row}>
        <View style={styles.icon} />
        <View style={styles.textCol}>
          <View style={styles.lineTitle} />
          <View style={styles.lineSub} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SemanticColors.borderSubtle,
  },
  textCol: { flex: 1, gap: 8 },
  lineTitle: {
    height: 16,
    width: '45%',
    borderRadius: 6,
    backgroundColor: SemanticColors.borderSubtle,
  },
  lineSub: {
    height: 12,
    width: '70%',
    borderRadius: 4,
    backgroundColor: SemanticColors.borderSubtle,
  },
});
