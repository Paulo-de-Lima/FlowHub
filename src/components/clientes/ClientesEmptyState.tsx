import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';

type ClientesEmptyStateProps = {
  onAdd: () => void;
};

export function ClientesEmptyState({ onAdd }: ClientesEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
          size={44}
          tintColor={FlowHubColors.petroleum}
        />
      </View>
      <ThemedText style={styles.title}>Nenhum cliente cadastrado</ThemedText>
      <ThemedText style={styles.text} themeColor="textSecondary">
        Cadastre clientes aqui para gerenciar mesas, leituras e vínculos com cobranças.
      </ThemedText>
      <Pressable style={styles.cta} onPress={onAdd}>
        <ThemedText style={styles.ctaText}>Adicionar primeiro cliente</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: Spacing.five, paddingHorizontal: Spacing.four, gap: Spacing.two },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: FlowHubColors.navy },
  text: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 300 },
  cta: {
    marginTop: Spacing.two,
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  ctaText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 14 },
});
