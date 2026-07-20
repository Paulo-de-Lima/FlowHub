import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubSearchField } from '@/components/ui/FlowHubSearchField';
import { FlowHubColors, FlowHubPalette, Spacing } from '@/constants/theme';

import type { ClienteFilterOption, ClientesFiltro } from '@/components/clientes/use-clientes-screen';

type ClientesSearchBarProps = {
  busca: string;
  filtro: ClientesFiltro;
  options: ClienteFilterOption[];
  onBuscaChange: (v: string) => void;
  onFiltroToggle: (key: ClienteFilterOption['key']) => void;
};

export function ClientesSearchBar({
  busca,
  filtro,
  options,
  onBuscaChange,
  onFiltroToggle,
}: ClientesSearchBarProps) {
  return (
    <View style={styles.wrap}>
      <FlowHubSearchField
        value={busca}
        onChangeText={onBuscaChange}
        placeholder="Buscar por nome, CPF ou telefone..."
      />

      <View style={styles.chips}>
        {options.map((f) => {
          const active = filtro === f.key;
          return (
            <Pressable
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onFiltroToggle(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label} ({f.count})
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
