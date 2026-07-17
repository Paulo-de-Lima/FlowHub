import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubSearchField } from '@/components/ui/FlowHubSearchField';
import { FlowHubColors, FlowHubPalette, Spacing, Typography } from '@/constants/theme';

export type CobrancaViagemFiltro = 'todos' | 'pendentes' | 'cobrados';

type CobrancaViagemFiltersProps = {
  filtro: CobrancaViagemFiltro;
  busca: string;
  counts: { todos: number; pendentes: number; cobrados: number };
  onFiltroChange: (f: CobrancaViagemFiltro) => void;
  onBuscaChange: (v: string) => void;
};

const FILTROS: { key: CobrancaViagemFiltro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'cobrados', label: 'Cobrados' },
];

export function CobrancaViagemFilters({
  filtro,
  busca,
  counts,
  onFiltroChange,
  onBuscaChange,
}: CobrancaViagemFiltersProps) {
  return (
    <View style={styles.wrap}>
      <FlowHubSearchField
        value={busca}
        onChangeText={onBuscaChange}
        placeholder="Buscar por nome..."
      />

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

      <ThemedText style={styles.sectionTitle}>Clientes desta viagem</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
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
  sectionTitle: {
    ...Typography.sectionTitle,
    color: FlowHubColors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 13,
  },
});
