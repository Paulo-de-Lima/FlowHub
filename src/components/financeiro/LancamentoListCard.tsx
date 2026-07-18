import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { LancamentoFinanceiro } from '@/services/api';

import {
  formatLancamentoDate,
  formatLancamentoValor,
  getLancamentoColors,
  getLancamentoIcon,
} from './financeiro-utils';

type LancamentoListCardProps = {
  item: LancamentoFinanceiro;
};

export function LancamentoListCard({ item }: LancamentoListCardProps) {
  const colors = getLancamentoColors(item.tipo);

  return (
    <View style={[styles.card, cardShadowSoft]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.iconBg }]}>
        <SymbolView name={getLancamentoIcon(item.tipo)} size={20} tintColor={colors.iconColor} />
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.origem} numberOfLines={1}>
          {item.origem}
        </ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={styles.date}>{formatLancamentoDate(item.dataGasto)}</ThemedText>
          {item.automatico ? (
            <FlowHubStatusBadge variant="neutral" label="Automático" />
          ) : null}
        </View>
      </View>

      <ThemedText style={[styles.valor, { color: colors.valueColor }]}>
        {formatLancamentoValor(item.valor, item.tipo)}
      </ThemedText>
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
    borderColor: FlowHubPalette.borderSubtle,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: { flex: 1, gap: 4, minWidth: 0 },
  origem: { fontSize: 16, fontWeight: '700', color: FlowHubColors.navy },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  date: { fontSize: 12, fontWeight: '500', color: FlowHubColors.darkGray },
  valor: { fontSize: 15, fontWeight: '800', flexShrink: 0 },
});
