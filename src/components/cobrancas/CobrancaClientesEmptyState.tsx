import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Radius, Spacing } from '@/constants/theme';

type CobrancaClientesEmptyStateProps = {
  onAdd: () => void;
};

export function CobrancaClientesEmptyState({ onAdd }: CobrancaClientesEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
          size={36}
          tintColor={FlowHubColors.petroleum}
        />
      </View>
      <ThemedText style={styles.title}>Nenhum cliente vinculado</ThemedText>
      <ThemedText style={styles.text} themeColor="textSecondary">
        Adicione clientes a esta viagem para registrar cobranças e mesas.
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F9F8',
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
