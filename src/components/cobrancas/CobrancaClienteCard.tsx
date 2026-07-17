import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatDate,
  formatTelefone,
  getClienteInitials,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  CobrancaTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { CobrancaClienteItem } from '@/services/api';

type CobrancaClienteCardProps = {
  item: CobrancaClienteItem;
  variant?: 'default' | 'compact';
  onMarcarCobrado: () => void;
  onDesfazer: () => void;
  onEditar: () => void;
  onVerMesas: () => void;
};

export function CobrancaClienteCard({
  item,
  variant = 'default',
  onMarcarCobrado,
  onDesfazer,
  onEditar,
  onVerMesas,
}: CobrancaClienteCardProps) {
  if (variant === 'compact') {
    return (
      <CompactClienteCard
        item={item}
        onMarcarCobrado={onMarcarCobrado}
        onDesfazer={onDesfazer}
        onEditar={onEditar}
        onVerMesas={onVerMesas}
      />
    );
  }

  return (
    <DefaultClienteCard
      item={item}
      onMarcarCobrado={onMarcarCobrado}
      onDesfazer={onDesfazer}
      onEditar={onEditar}
      onVerMesas={onVerMesas}
    />
  );
}

function getCardStyle(cobrado: boolean, totalDeve: number) {
  if (!cobrado) {
    return {
      card: [styles.cardBase, styles.cardPendente],
      deveBox: styles.deveBoxNeutral,
    };
  }
  if (totalDeve > 0) {
    return {
      card: [styles.cardBase, styles.cardRecebidoComDivida],
      deveBox: styles.deveBoxNeutral,
    };
  }
  return {
    card: [styles.cardBase, styles.cardQuitado],
    deveBox: styles.deveBoxNeutral,
  };
}

function CompactClienteCard({
  item,
  onMarcarCobrado,
  onDesfazer,
  onEditar,
  onVerMesas,
}: Omit<CobrancaClienteCardProps, 'variant'>) {
  const { cliente, cobrado, qtdMesas, totalDeve, data_cobranca } = item;
  const nome = cliente.nome?.trim() || 'Sem nome';
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const { card, deveBox } = getCardStyle(cobrado, totalDeve);

  const deveLabel = cobrado
    ? totalDeve > 0
      ? 'Ainda em registros'
      : 'Registros em dia'
    : 'Valor em aberto';

  return (
    <View style={[...(Array.isArray(card) ? card : [card]), cardShadowSoft]}>
      <View style={styles.compactHeader}>
        <View style={styles.compactTitleRow}>
          <ThemedText style={styles.compactNome} numberOfLines={1}>
            {nome}
          </ThemedText>
          {cobrado ? (
            <View style={[styles.badge, totalDeve === 0 ? styles.badgeQuitado : styles.badgeRecebido]}>
              <ThemedText
                style={[
                  styles.badgeText,
                  totalDeve === 0 ? styles.badgeTextQuitado : styles.badgeTextRecebido,
                ]}>
                {totalDeve === 0 ? 'Quitado' : 'Cobrado na viagem'}
                {data_cobranca && totalDeve === 0 ? ` · ${formatDate(data_cobranca)}` : ''}
              </ThemedText>
            </View>
          ) : null}
        </View>
        {qtdMesas > 0 ? (
          <ThemedText style={styles.mesasHint}>
            {qtdMesas} mesa{qtdMesas !== 1 ? 's' : ''}
          </ThemedText>
        ) : null}
      </View>

      <View style={[styles.deveBox, deveBox]}>
        <ThemedText style={[styles.deveLabel, cobrado && totalDeve > 0 && styles.deveLabelRegistros]}>
          {deveLabel}
        </ThemedText>
        <ThemedText
          style={[
            styles.compactDeveValue,
            !cobrado && styles.deveValuePendente,
            cobrado && totalDeve > 0 && styles.deveValueRegistros,
            cobrado && totalDeve === 0 && styles.deveValueQuitado,
          ]}>
          {formatCurrency(totalDeve)}
        </ThemedText>
      </View>

      <Pressable
        style={({ pressed }) => [styles.ctaPrimary, pressed && styles.pressed]}
        onPress={onVerMesas}
        accessibilityLabel={`Registrar leituras de ${nome}`}>
        <SymbolView
          name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
          size={18}
          tintColor={FlowHubColors.navy}
        />
        <ThemedText style={styles.ctaPrimaryText}>Registrar leituras</ThemedText>
      </Pressable>

      <View style={styles.secondaryActions}>
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
          onPress={onEditar}
          accessibilityLabel="Editar cliente">
          <SymbolView
            name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            size={16}
            tintColor={FlowHubColors.petroleum}
          />
          <ThemedText style={styles.secondaryBtnText}>Editar</ThemedText>
        </Pressable>

        {!cobrado ? (
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, styles.secondaryBtnOutline, pressed && styles.pressed]}
            onPress={onMarcarCobrado}
            accessibilityLabel="Marcar como cobrado na viagem">
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={16}
              tintColor={SemanticColors.success}
            />
            <ThemedText style={[styles.secondaryBtnText, styles.secondaryBtnTextSuccess]}>
              Marcar cobrado
            </ThemedText>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, styles.secondaryBtnOutline, pressed && styles.pressed]}
            onPress={onDesfazer}
            accessibilityLabel="Desfazer marcação de cobrado">
            <SymbolView
              name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
              size={16}
              tintColor={FlowHubColors.darkGray}
            />
            <ThemedText style={styles.secondaryBtnText}>Desfazer</ThemedText>
          </Pressable>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.detalhesToggle, pressed && styles.pressed]}
        onPress={() => setDetalhesAbertos((v) => !v)}
        accessibilityLabel={detalhesAbertos ? 'Ocultar detalhes' : 'Ver detalhes do cliente'}>
        <ThemedText style={styles.detalhesToggleText}>
          {detalhesAbertos ? 'Ocultar detalhes' : 'Ver detalhes'}
        </ThemedText>
        <SymbolView
          name={{
            ios: detalhesAbertos ? 'chevron.up' : 'chevron.down',
            android: detalhesAbertos ? 'expand_less' : 'expand_more',
            web: detalhesAbertos ? 'expand_less' : 'expand_more',
          }}
          size={14}
          tintColor={FlowHubColors.darkGray}
        />
      </Pressable>

      {detalhesAbertos ? (
        <View style={styles.detalhesBox}>
          <DetalheRow label="CPF" value={cliente.cpf?.trim() || '—'} />
          <DetalheRow label="Telefone" value={formatTelefone(cliente.numero)} />
          <DetalheRow label="Endereço" value={cliente.endereco?.trim() || 'Não informado'} />
        </View>
      ) : null}
    </View>
  );
}

function DefaultClienteCard({
  item,
  onMarcarCobrado,
  onDesfazer,
  onEditar,
  onVerMesas,
}: Omit<CobrancaClienteCardProps, 'variant'>) {
  const { cliente, cobrado, qtdMesas, totalDeve, data_cobranca } = item;
  const nome = cliente.nome?.trim() || 'Sem nome';
  const { card, deveBox } = getCardStyle(cobrado, totalDeve);

  return (
    <View style={[...(Array.isArray(card) ? card : [card]), cardShadowSoft]}>
      <View style={styles.header}>
        <View style={[styles.avatar, cobrado && totalDeve === 0 && styles.avatarCobrado]}>
          <ThemedText style={styles.avatarText}>{getClienteInitials(cliente.nome)}</ThemedText>
        </View>

        <View style={styles.headerInfo}>
          <ThemedText style={styles.nome} numberOfLines={1}>
            {nome}
          </ThemedText>
          {cobrado ? (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, totalDeve === 0 ? styles.badgeQuitado : styles.badgeRecebido]}>
                <ThemedText
                  style={[
                    styles.badgeText,
                    totalDeve === 0 ? styles.badgeTextQuitado : styles.badgeTextRecebido,
                  ]}>
                  {totalDeve === 0 ? 'Quitado' : 'Cobrado na viagem'}
                  {data_cobranca ? ` · ${formatDate(data_cobranca)}` : ''}
                </ThemedText>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && styles.pressed]}
            onPress={onEditar}
            accessibilityLabel="Editar cliente"
            hitSlop={6}>
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={18}
              tintColor={FlowHubColors.petroleum}
            />
          </Pressable>
          {!cobrado ? (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.okBtnOutline, pressed && styles.pressed]}
              onPress={onMarcarCobrado}
              accessibilityLabel="Marcar como cobrado na viagem"
              hitSlop={6}>
              <SymbolView
                name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                size={20}
                tintColor={SemanticColors.success}
              />
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.undoBtn, pressed && styles.pressed]}
              onPress={onDesfazer}
              accessibilityLabel="Desfazer marcação de cobrado"
              hitSlop={6}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={20}
                tintColor={FeatureColors.expense}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.deveBox, deveBox]}>
        <ThemedText style={[styles.deveLabel, cobrado && totalDeve > 0 && styles.deveLabelRegistros]}>
          {cobrado
            ? totalDeve > 0
              ? 'Ainda em registros'
              : 'Registros em dia'
            : 'Dívida em aberto'}
        </ThemedText>
        <ThemedText
          style={[
            styles.deveValue,
            cobrado && totalDeve > 0 && styles.deveValueRegistros,
            cobrado && totalDeve === 0 && styles.deveValueQuitado,
          ]}>
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

function DetalheRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detalheRow}>
      <ThemedText style={styles.detalheLabel}>{label}</ThemedText>
      <ThemedText style={styles.detalheValue} numberOfLines={2}>
        {value}
      </ThemedText>
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
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  cardBase: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  cardPendente: {
    borderLeftWidth: 3,
    borderLeftColor: SemanticColors.danger,
  },
  cardRecebidoComDivida: {
    borderLeftWidth: 3,
    borderLeftColor: FeatureColors.material,
  },
  cardQuitado: {
    borderLeftWidth: 3,
    borderLeftColor: SemanticColors.success,
  },
  compactHeader: { gap: 4 },
  compactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  compactNome: {
    ...CobrancaTypography.screenTitle,
    fontSize: 18,
    color: FlowHubColors.navy,
    flex: 1,
  },
  mesasHint: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
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
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCobrado: { backgroundColor: FeatureColors.incomeBg },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: FlowHubColors.petroleum,
  },
  headerInfo: { flex: 1, gap: 4, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '700', color: FlowHubColors.navy },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeRecebido: { backgroundColor: FeatureColors.incomeBg },
  badgeQuitado: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextRecebido: { color: FeatureColors.income },
  badgeTextQuitado: { color: SemanticColors.success },
  headerActions: { flexDirection: 'row', gap: Spacing.one },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderColor: FlowHubPalette.borderSubtle,
  },
  okBtnOutline: {
    backgroundColor: FeatureColors.incomeBg,
    borderWidth: 1.5,
    borderColor: FeatureColors.income,
  },
  undoBtn: {
    backgroundColor: FeatureColors.expenseBg,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  deveBox: {
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: 4,
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  deveBoxNeutral: {
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  deveLabel: {
    ...CobrancaTypography.label,
    color: SemanticColors.danger,
  },
  deveLabelRegistros: { color: FeatureColors.material },
  deveValue: {
    ...CobrancaTypography.kpi,
    color: SemanticColors.danger,
  },
  deveValuePendente: { color: SemanticColors.danger },
  compactDeveValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    color: SemanticColors.danger,
  },
  deveValueRegistros: { color: FeatureColors.material },
  deveValueQuitado: { color: FlowHubColors.darkGray, fontSize: 20 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingVertical: 14,
  },
  ctaPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: FlowHubColors.lightGray,
  },
  secondaryBtnOutline: {
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  secondaryBtnTextSuccess: { color: SemanticColors.success },
  detalhesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  detalhesToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
  },
  detalhesBox: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  detalheRow: { gap: 2 },
  detalheLabel: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
  },
  detalheValue: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
  metaRow: { flexDirection: 'row', gap: Spacing.two },
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
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
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
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
