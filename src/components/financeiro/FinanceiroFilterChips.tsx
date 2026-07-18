import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Spacing } from '@/constants/theme';

import type { FinanceiroFiltro } from './use-financeiro-screen';

type FinanceiroFilterChipsProps = {
  filtro: FinanceiroFiltro;
  counts: { todos: number; receita: number; despesa: number };
  onFiltroChange: (f: FinanceiroFiltro) => void;
};

const FILTROS: { key: FinanceiroFiltro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'receita', label: 'Receitas' },
  { key: 'despesa', label: 'Despesas' },
];

export function FinanceiroFilterChips({ filtro, counts, onFiltroChange }: FinanceiroFilterChipsProps) {
  return (
    <View style={styles.chips}>
      {FILTROS.map((f) => {
        const active = filtro === f.key;
        return (
          <Pressable
            key={f.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onFiltroChange(f.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
              {f.label} ({counts[f.key]})
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: FlowHubColors.navy,
    borderColor: FlowHubColors.navy,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray },
  chipTextActive: { color: FlowHubColors.white },
});
