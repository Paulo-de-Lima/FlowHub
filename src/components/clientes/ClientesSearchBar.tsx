import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubSearchField } from '@/components/ui/FlowHubSearchField';
import { FlowHubColors, FlowHubPalette, Spacing } from '@/constants/theme';

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
      <FlowHubSearchField
        value={busca}
        onChangeText={onBuscaChange}
        placeholder="Buscar por nome, CPF ou telefone..."
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    backgroundColor: FlowHubColors.white,
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
