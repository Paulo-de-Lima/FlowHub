import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';

type MesasEmptyStateProps = {
  onAdd: () => void;
};

export function MesasEmptyState({ onAdd }: MesasEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={{ ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' }}
          size={44}
          tintColor={FlowHubColors.petroleum}
        />
      </View>
      <ThemedText style={styles.title}>Este cliente ainda não tem mesas</ThemedText>
      <ThemedText style={styles.text} themeColor="textSecondary">
        Cadastre a numeração da mesa (ex.: N324) e o valor da ficha para começar a registrar leituras.
      </ThemedText>
      <Pressable style={styles.cta} onPress={onAdd}>
        <ThemedText style={styles.ctaText}>Adicionar primeira mesa</ThemedText>
      </Pressable>
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
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
  },
  cta: {
    marginTop: Spacing.two,
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  ctaText: {
    color: FlowHubColors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
