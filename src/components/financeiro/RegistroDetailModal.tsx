import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { FlowHubModalHeaderStrip } from '@/components/ui/flowHubModalStyles';
import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { LancamentoFinanceiro } from '@/services/api';

import {
  formatCurrency,
  formatLancamentoDate,
  formatLancamentoValor,
  getLancamentoColors,
  getLancamentoIcon,
  getLancamentoTipoLabel,
} from './financeiro-utils';

type RegistroDetailModalProps = {
  visible: boolean;
  item: LancamentoFinanceiro | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RegistroDetailModal({
  visible,
  item,
  onClose,
  onEdit,
  onDelete,
}: RegistroDetailModalProps) {
  if (!item) return null;

  const colors = getLancamentoColors(item.tipo);
  const canManage = !item.automatico;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
          <FlowHubModalHeaderStrip />

          <View style={[styles.iconWrap, { backgroundColor: colors.iconBg }]}>
            <SymbolView name={getLancamentoIcon(item.tipo)} size={32} tintColor={colors.iconColor} />
          </View>

          <ThemedText style={styles.title}>{item.origem}</ThemedText>
          <ThemedText style={[styles.valor, { color: colors.valueColor }]}>
            {formatLancamentoValor(item.valor, item.tipo)}
          </ThemedText>

          <View style={styles.details}>
            <DetailRow label="Tipo" value={getLancamentoTipoLabel(item.tipo)} />
            <DetailRow label="Data" value={formatLancamentoDate(item.dataGasto)} />
            <DetailRow label="Valor total" value={formatCurrency(item.total)} />
            <View style={styles.badgeRow}>
              {item.automatico ? (
                <FlowHubStatusBadge variant="neutral" label="Registro automático" />
              ) : (
                <FlowHubStatusBadge variant="ok" label="Registro manual" />
              )}
            </View>
            {item.automatico ? (
              <ThemedText style={styles.hint} themeColor="textSecondary">
                Registros de compra de material são gerados pelo estoque e não podem ser editados
                aqui.
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <ThemedText style={styles.cancelText}>Fechar</ThemedText>
            </Pressable>
            {canManage && onEdit ? (
              <Pressable style={styles.editBtn} onPress={onEdit}>
                <ThemedText style={styles.editText}>Editar</ThemedText>
              </Pressable>
            ) : null}
            {canManage && onDelete ? (
              <Pressable style={styles.deleteBtn} onPress={onDelete}>
                <ThemedText style={styles.deleteText}>Excluir</ThemedText>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel} themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  valor: { fontSize: 24, fontWeight: '800' },
  details: {
    width: '100%',
    gap: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 30, 46, 0.08)',
  },
  detailRow: { gap: 4 },
  detailLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  detailValue: { fontSize: 16, fontWeight: '600', color: FlowHubColors.navy },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  hint: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, width: '100%', marginTop: Spacing.two },
  cancelBtn: {
    flex: 1,
    minWidth: 100,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  cancelText: { color: FlowHubColors.darkGray, fontWeight: '700', fontSize: 15 },
  editBtn: {
    flex: 1,
    minWidth: 100,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.navy,
  },
  editText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
  deleteBtn: {
    flex: 1,
    minWidth: 100,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FeatureColors.expense,
  },
  deleteText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
});
