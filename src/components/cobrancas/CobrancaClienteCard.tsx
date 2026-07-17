import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatDate,
  formatTelefone,
  getClienteInitials,
} from '@/components/cobrancas/cobrancas-utils';
import { ClienteDetalhesPanel } from '@/components/cobrancas/ClienteDetalhesPanel';
import { ThemedText } from '@/components/themed-text';
import { FlowHubStatusBadge, type FlowHubStatusBadgeVariant } from '@/components/ui/FlowHubStatusBadge';
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

function getStatusInfo(cobrado: boolean, totalDeve: number, data_cobranca?: string | null) {
  if (!cobrado) {
    return {
      badge: { variant: 'pending' as FlowHubStatusBadgeVariant, label: 'Pendente na viagem' },
      valorLabel: 'Em aberto',
      valorColor: SemanticColors.danger,
    };
  }
  if (totalDeve > 0) {
    return {
      badge: {
        variant: 'collected' as FlowHubStatusBadgeVariant,
        label: data_cobranca ? `Cobrado · ${formatDate(data_cobranca)}` : 'Cobrado na viagem',
      },
      valorLabel: 'Em registros',
      valorColor: FeatureColors.material,
    };
  }
  return {
    badge: {
      variant: 'quitado' as FlowHubStatusBadgeVariant,
      label: data_cobranca ? `Quitado · ${formatDate(data_cobranca)}` : 'Quitado',
    },
    valorLabel: 'Em dia',
    valorColor: SemanticColors.success,
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
  const status = getStatusInfo(cobrado, totalDeve, data_cobranca);
  const mesasLabel = qtdMesas === 0 ? 'Sem mesa' : qtdMesas === 1 ? '1 mesa' : `${qtdMesas} mesas`;

  return (
    <View style={[styles.cardBase, cardShadowSoft]}>
      <View style={styles.compactHeader}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{getClienteInitials(cliente.nome)}</ThemedText>
        </View>

        <View style={styles.compactHeaderInfo}>
          <ThemedText style={styles.compactNome} numberOfLines={1}>
            {nome}
          </ThemedText>
          <FlowHubStatusBadge variant={status.badge.variant} label={status.badge.label} />
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
                name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
                size={18}
                tintColor={FlowHubColors.darkGray}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <ThemedText style={styles.statLabel}>{status.valorLabel}</ThemedText>
          <ThemedText style={[styles.statValue, { color: status.valorColor }]}>
            {formatCurrency(totalDeve)}
          </ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <ThemedText style={styles.statLabel}>Mesas</ThemedText>
          <ThemedText style={styles.statValue}>{mesasLabel}</ThemedText>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.ctaPrimary, pressed && styles.pressed]}
        onPress={onVerMesas}
        accessibilityLabel={`Registrar leituras de ${nome}`}>
        <SymbolView
          name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
          size={18}
          tintColor={FlowHubColors.white}
        />
        <ThemedText style={styles.ctaPrimaryText}>Registrar leituras</ThemedText>
      </Pressable>

      <ClienteDetalhesPanel
        open={detalhesAbertos}
        onToggle={() => setDetalhesAbertos((v) => !v)}
        telefone={formatTelefone(cliente.numero)}
        cpf={cliente.cpf?.trim() || '—'}
        endereco={cliente.endereco?.trim() || 'Não informado'}
      />
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
  const status = getStatusInfo(cobrado, totalDeve, data_cobranca);

  return (
    <View style={[styles.cardBase, cardShadowSoft]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{getClienteInitials(cliente.nome)}</ThemedText>
        </View>

        <View style={styles.headerInfo}>
          <ThemedText style={styles.nome} numberOfLines={2} ellipsizeMode="tail">
            {nome}
          </ThemedText>
          <FlowHubStatusBadge variant={status.badge.variant} label={status.badge.label} />
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
                name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
                size={18}
                tintColor={FlowHubColors.darkGray}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <ThemedText style={styles.statLabel}>{status.valorLabel}</ThemedText>
          <ThemedText style={[styles.statValue, { color: status.valorColor }]}>
            {formatCurrency(totalDeve)}
          </ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <ThemedText style={styles.statLabel}>Mesas</ThemedText>
          <ThemedText style={styles.statValue}>
            {qtdMesas === 0 ? '—' : qtdMesas}
          </ThemedText>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaCell label="Telefone" value={formatTelefone(cliente.numero)} />
        <MetaCell label="CPF" value={cliente.cpf?.trim() || '—'} />
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
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  cardBase: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  compactHeaderInfo: { flex: 1, gap: 6, minWidth: 0 },
  compactNome: {
    fontSize: 17,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: Radius.md,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  statCell: { flex: 1, gap: 4, alignItems: 'center' },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: FlowHubPalette.borderSubtle,
  },
  statLabel: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: FlowHubColors.navy,
    textAlign: 'center',
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
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: FlowHubColors.petroleum,
  },
  headerInfo: { flex: 1, gap: 6, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '700', color: FlowHubColors.navy },
  headerActions: { flexDirection: 'row', gap: Spacing.one, flexShrink: 0 },
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
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderColor: FlowHubPalette.borderSubtle,
  },
  metaRow: { flexDirection: 'row', gap: Spacing.two },
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
