import { StyleSheet, View } from 'react-native';

import {
  formatMaterialQuantidade,
  materialStatusBadgeVariant,
  materialStatusLabel,
} from '@/components/estoque/estoque-utils';
import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { Material } from '@/services/api';

type MaterialListCardProps = {
  item: Material;
};

function getMaterialInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function MaterialListCard({ item }: MaterialListCardProps) {
  const nome = item.nome?.trim() || 'Sem nome';
  const minimoLabel = `Mín. ${item.estoqueMinimo} ${item.unidade?.trim() || 'un'}`;

  return (
    <View style={[styles.card, cardShadowSoft]} accessibilityLabel={`Material ${nome}`}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{getMaterialInitials(nome)}</ThemedText>
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.nome} numberOfLines={1}>
          {nome}
        </ThemedText>
        <ThemedText style={styles.quantidade}>{formatMaterialQuantidade(item)}</ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={styles.meta}>{minimoLabel}</ThemedText>
          <FlowHubStatusBadge
            variant={materialStatusBadgeVariant(item.status)}
            label={materialStatusLabel(item.status)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: FlowHubColors.petroleum },
  info: { flex: 1, gap: 4, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '800', color: FlowHubColors.navy },
  quantidade: { fontSize: 13, fontWeight: '600', color: FlowHubColors.petroleum },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  meta: { fontSize: 12, fontWeight: '500', color: FlowHubColors.darkGray },
});
