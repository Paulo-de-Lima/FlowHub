import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatDate,
  formatTelefone,
  getClienteInitials,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { CobrancaClienteItem } from '@/services/api';

type CobrancaClienteCardProps = {
  item: CobrancaClienteItem;
  onMarcarCobrado: () => void;
  onDesfazer: () => void;
  onEditar: () => void;
  onVerMesas: () => void;
};

export function CobrancaClienteCard({
  item,
  onMarcarCobrado,
  onDesfazer,
  onEditar,
  onVerMesas,
}: CobrancaClienteCardProps) {
  const { cliente, cobrado, qtdMesas, totalDeve, data_cobranca } = item;
  const nome = cliente.nome?.trim() || 'Sem nome';

  return (
    <View style={[styles.card, cobrado ? styles.cardCobrado : styles.cardPendente, cardShadowSoft]}>
      <View style={styles.header}>
        <View style={[styles.avatar, cobrado && styles.avatarCobrado]}>
          <ThemedText style={styles.avatarText}>{getClienteInitials(cliente.nome)}</ThemedText>
        </View>

        <View style={styles.headerInfo}>
          <ThemedText style={styles.nome} numberOfLines={1}>
            {nome}
          </ThemedText>
          {cobrado ? (
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  Cobrado{data_cobranca ? ` em ${formatDate(data_cobranca)}` : ''}
                </ThemedText>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && styles.pressed]}
            onPress={onEditar}
            accessibilityLabel="Editar cliente">
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={18}
              tintColor={FlowHubColors.petroleum}
            />
          </Pressable>
          {!cobrado ? (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.okBtn, pressed && styles.pressed]}
              onPress={onMarcarCobrado}
              accessibilityLabel="Marcar como cobrado nesta viagem">
              <SymbolView
                name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                size={20}
                tintColor={FlowHubColors.white}
              />
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.undoBtn, pressed && styles.pressed]}
              onPress={onDesfazer}
              accessibilityLabel="Desfazer marcação de cobrado">
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={20}
                tintColor={FlowHubColors.white}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.deveBox, cobrado && styles.deveBoxCobrado]}>
        <ThemedText style={[styles.deveLabel, cobrado && styles.deveLabelCobrado]}>
          {cobrado ? 'Dívida em registros' : 'Dívida em aberto'}
        </ThemedText>
        <ThemedText style={[styles.deveValue, cobrado && styles.deveValueCobrado]}>
          {formatCurrency(totalDeve)}
        </ThemedText>
      </View>

      <View style={styles.metaRow}>
        <MetaCell label="CPF" value={cliente.cpf?.trim() || '—'} />
        <MetaCell label="Telefone" value={formatTelefone(cliente.numero)} />
      </View>

      <View style={styles.metaCellFull}>
        <ThemedText style={styles.metaLabel}>Endereço</ThemedText>
        <ThemedText style={styles.metaValue} numberOfLines={2}>
          {cliente.endereco?.trim() || 'Endereço não informado'}
        </ThemedText>
      </View>

      <Pressable
        style={({ pressed }) => [styles.mesasRow, pressed && styles.pressed]}
        onPress={onVerMesas}
        accessibilityLabel={`Abrir leituras de ${nome}`}>
        <SymbolView
          name={{ ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' }}
          size={20}
          tintColor={FlowHubColors.petroleum}
        />
        <View style={styles.mesasInfo}>
          <View style={styles.mesasTitleRow}>
            <ThemedText style={styles.metaLabel}>Mesas</ThemedText>
            <ThemedText style={styles.metaValue}>{qtdMesas}</ThemedText>
          </View>
          <ThemedText style={styles.mesasSubtitle}>
            {qtdMesas === 0 ? 'Nenhuma mesa — toque para adicionar' : 'Leituras e valores'}
          </ThemedText>
        </View>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={14}
          tintColor={FlowHubColors.darkGray}
        />
      </Pressable>
    </View>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      <ThemedText style={styles.metaValue} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
  },
  cardPendente: {
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  cardCobrado: {
    borderWidth: 1,
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F9F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCobrado: {
    backgroundColor: FeatureColors.incomeBg,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: FlowHubColors.petroleum,
  },
  headerInfo: { flex: 1, gap: 4, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '700', color: FlowHubColors.navy },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: {
    backgroundColor: FeatureColors.incomeBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: FeatureColors.income },
  headerActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: { backgroundColor: FlowHubColors.lightGray },
  okBtn: { backgroundColor: '#16A34A' },
  undoBtn: { backgroundColor: '#DC2626' },
  deveBox: {
    backgroundColor: FeatureColors.expenseBg,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: 4,
  },
  deveBoxCobrado: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  deveLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: FeatureColors.expense,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deveLabelCobrado: { color: FlowHubColors.darkGray },
  deveValue: {
    fontSize: 22,
    fontWeight: '800',
    color: FeatureColors.expense,
  },
  deveValueCobrado: {
    fontSize: 18,
    color: FlowHubColors.darkGray,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metaCell: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: 2,
  },
  metaCellFull: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
  mesasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  mesasInfo: { flex: 1, gap: 2, minWidth: 0 },
  mesasTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  mesasSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  pressed: { opacity: 0.88 },
});
