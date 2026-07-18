import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import {
  formatManutencaoDate,
  formatMaterialChipLabel,
  summarizeDescricao,
} from '@/components/manutencao/manutencao-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { Manutencao } from '@/services/api';

type ManutencaoListCardProps = {
  item: Manutencao;
};

export function ManutencaoListCard({ item }: ManutencaoListCardProps) {
  return (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <SymbolView
            name={{ ios: 'wrench.fill', android: 'build', web: 'build' }}
            size={16}
            tintColor={FlowHubColors.petroleum}
          />
        </View>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.clienteNome} numberOfLines={1}>
            {item.clienteNome}
          </ThemedText>
          <ThemedText style={styles.data}>{formatManutencaoDate(item.data)}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.descricao} numberOfLines={3}>
        {summarizeDescricao(item.descricao)}
      </ThemedText>

      {item.itens.length > 0 ? (
        <View style={styles.chips}>
          {item.itens.map((material) => (
            <View key={material.id} style={styles.chip}>
              <ThemedText style={styles.chipText} numberOfLines={1}>
                {formatMaterialChipLabel(
                  material.materialNome,
                  material.quantidade,
                  material.unidade,
                )}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: FlowHubPalette.kpiIconBgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, gap: 2, minWidth: 0 },
  clienteNome: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  data: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
    color: FlowHubColors.darkGray,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
});
