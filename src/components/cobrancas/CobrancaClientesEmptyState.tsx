import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';

type CobrancaClientesEmptyStateProps = {
  onAdd: () => void;
};

export function CobrancaClientesEmptyState({ onAdd }: CobrancaClientesEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
          size={44}
          tintColor={FlowHubColors.petroleum}
        />
      </View>
      <ThemedText style={styles.title}>Nenhum cliente vinculado</ThemedText>
      <ThemedText style={styles.text} themeColor="textSecondary">
        Adicione clientes a esta viagem para registrar leituras nas mesas de cada um.
      </ThemedText>
      <Pressable style={styles.cta} onPress={onAdd}>
        <ThemedText style={styles.ctaText}>Adicionar primeiro cliente</ThemedText>
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
