import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Radius, SemanticColors, Spacing } from '@/constants/theme';

import type { ClientesFiltro } from '@/components/clientes/use-clientes-screen';

type ClientesSearchBarProps = {
  busca: string;
  filtro: ClientesFiltro;
  counts: Record<ClientesFiltro, number>;
  onBuscaChange: (v: string) => void;
  onFiltroChange: (f: ClientesFiltro) => void;
};

const FILTROS: { key: ClientesFiltro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'com_divida', label: 'Com dívida' },
  { key: 'em_dia', label: 'Em dia' },
  { key: 'sem_mesa', label: 'Sem mesa' },
];

export function ClientesSearchBar({
  busca,
  filtro,
  counts,
  onBuscaChange,
  onFiltroChange,
}: ClientesSearchBarProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.sectionTitle}>Seus clientes</ThemedText>

      <View style={styles.searchWrap}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={FlowHubColors.darkGray}
        />
        <TextInput
          value={busca}
          onChangeText={onBuscaChange}
          placeholder="Buscar por nome, CPF ou telefone..."
          placeholderTextColor={FlowHubColors.darkGray}
          style={styles.search}
        />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: FlowHubColors.navy,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  chipActive: { backgroundColor: FlowHubColors.navy, borderColor: FlowHubColors.navy },
  chipText: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray },
  chipTextActive: { color: FlowHubColors.white },
});
