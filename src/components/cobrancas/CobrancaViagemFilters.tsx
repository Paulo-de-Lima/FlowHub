import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Radius, Spacing, Typography } from '@/constants/theme';

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
      <View style={styles.chips}>
        {FILTROS.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.chip, filtro === f.key && styles.chipActive]}
            onPress={() => onFiltroChange(f.key)}>
            <ThemedText style={[styles.chipText, filtro === f.key && styles.chipTextActive]}>
              {f.label} ({counts[f.key]})
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={FlowHubColors.darkGray}
        />
        <TextInput
          value={busca}
          onChangeText={onBuscaChange}
          placeholder="Buscar por nome..."
          placeholderTextColor={FlowHubColors.darkGray}
          style={styles.search}
        />
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
    borderColor: '#E8EDF2',
  },
  chipActive: {
    backgroundColor: FlowHubColors.navy,
    borderColor: FlowHubColors.navy,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray },
  chipTextActive: { color: FlowHubColors.white },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: FlowHubColors.navy,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    color: FlowHubColors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 13,
  },
});
