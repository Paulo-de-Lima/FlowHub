import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatDate,
  formatLeituraMedidor,
  isRegistroQuitado,
  saldoRegistro,
  temPagamentoParcial,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import {
  CobrancaTypography,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { RegistroMesa } from '@/services/api';

type RegistroCardProps = {
  registro: RegistroMesa;
  isAtual?: boolean;
  compact?: boolean;
  onEditar: () => void;
  onRegistrarPagamento: () => void;
  onDelete: () => void;
};

export function RegistroCard({
  registro,
  isAtual = false,
  compact = false,
  onEditar,
  onRegistrarPagamento,
  onDelete,
}: RegistroCardProps) {
  const quitado = isRegistroQuitado(registro);
  const parcial = temPagamentoParcial(registro);
  const saldo = registro.saldo ?? saldoRegistro(registro);
  const valorPago = registro.valor_pago ?? 0;

  if (compact && !isAtual) {
    const statusLabel = quitado ? 'Quitado' : parcial ? 'Parcial' : saldo > 0 ? 'Pendente' : 'Em dia';
    const statusStyle = quitado
      ? styles.statusQuitado
      : saldo > 0
        ? styles.statusPendente
        : styles.statusOk;

    return (
      <Pressable
        style={({ pressed }) => [styles.compactRow, pressed && styles.pressed]}
        onPress={onEditar}
        accessibilityLabel={`Leitura de ${formatDate(registro.data_leitura)}, ${statusLabel}`}>
        <ThemedText style={styles.compactDate}>{formatDate(registro.data_leitura)}</ThemedText>
        <ThemedText style={styles.compactDot}>·</ThemedText>
        <ThemedText style={styles.compactLeitura}>{formatLeituraMedidor(registro.leitura)}</ThemedText>
        <ThemedText style={styles.compactDot}>·</ThemedText>
        <ThemedText style={styles.compactValor}>{formatCurrency(registro.deve)}</ThemedText>
        <View style={[styles.statusPill, statusStyle]}>
          <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, quitado && styles.cardQuitado, isAtual && styles.cardAtual]}>
      {quitado || isAtual ? (
        <View style={[styles.accentBar, isAtual && !quitado && styles.accentBarAtual]} />
      ) : null}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.leituraIcon, quitado && styles.leituraIconQuitado]}>
            <SymbolView
              name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
              size={16}
              tintColor={quitado ? FeatureColors.income : FlowHubColors.petroleum}
            />
          </View>

          <View style={styles.topInfo}>
            <View style={styles.dateRow}>
              <ThemedText style={styles.date}>{formatDate(registro.data_leitura)}</ThemedText>
              {isAtual ? (
                <View style={styles.atualBadge}>
                  <ThemedText style={styles.atualBadgeText}>Atual</ThemedText>
                </View>
              ) : null}
            </View>
            <View style={[styles.leituraPill, quitado && styles.leituraPillQuitado]}>
              <ThemedText style={[styles.leituraLabel, quitado && styles.leituraLabelQuitado]}>
                Leitura
              </ThemedText>
              <ThemedText style={styles.leitura}>{formatLeituraMedidor(registro.leitura)}</ThemedText>
            </View>
          </View>

          <View style={styles.actionBtns}>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, styles.editBtn, pressed && styles.pressed]}
              onPress={onEditar}
              accessibilityLabel="Editar leitura"
              hitSlop={6}>
              <SymbolView
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                size={18}
                tintColor={FlowHubColors.petroleum}
              />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, styles.deleteBtn, pressed && styles.pressed]}
              onPress={onDelete}
              accessibilityLabel="Excluir leitura"
              hitSlop={6}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={18}
                tintColor={FeatureColors.expense}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.valoresRow}>
          <ValorCell label="Valor" value={formatCurrency(registro.deve)} />
          <ValorCell label="Pago" value={formatCurrency(valorPago)} destaque={quitado || parcial} />
          <ValorCell label="Em aberto" value={formatCurrency(saldo)} destaque={saldo > 0} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.pagamentoBtn, pressed && styles.pressed]}
          onPress={onRegistrarPagamento}
          accessibilityLabel="Registrar pagamento">
          <SymbolView
            name={{ ios: 'banknote', android: 'payments', web: 'payments' }}
            size={16}
            tintColor={quitado ? FeatureColors.income : FlowHubColors.petroleum}
          />
          <ThemedText style={[styles.pagamentoText, quitado && styles.pagamentoTextQuitado]}>
            {quitado ? 'Pagamento registrado' : parcial ? 'Ajustar pagamento' : 'Registrar pagamento'}
          </ThemedText>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={12}
            tintColor={FlowHubColors.darkGray}
          />
        </Pressable>
      </View>
    </View>
  );
}

function ValorCell({
  label,
  value,
  destaque,
}: {
  label: string;
  value: string;
  destaque?: boolean;
}) {
  return (
    <View style={styles.valorCell}>
      <ThemedText style={styles.valorLabel}>{label}</ThemedText>
      <ThemedText style={[styles.valorValue, destaque && styles.valorDestaque]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  compactDate: {
    ...CobrancaTypography.label,
    color: FlowHubColors.petroleum,
  },
  compactDot: {
    fontSize: 12,
    color: FlowHubColors.darkGray,
    opacity: 0.5,
  },
  compactLeitura: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  compactValor: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
  },
  statusPill: {
    marginLeft: 'auto',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusQuitado: { backgroundColor: FeatureColors.incomeBg },
  statusPendente: { backgroundColor: SemanticColors.warningBg },
  statusOk: { backgroundColor: FlowHubColors.lightGray },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  card: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: FlowHubColors.white,
    borderColor: SemanticColors.borderSubtle,
  },
  cardQuitado: {
    backgroundColor: FeatureColors.incomeBg,
    borderColor: 'rgba(20, 200, 196, 0.28)',
  },
  cardAtual: {
    borderColor: FlowHubColors.turquoise,
    borderWidth: 2,
  },
  accentBar: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  accentBarAtual: { backgroundColor: FlowHubColors.petroleum },
  content: {
    flex: 1,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  leituraIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  leituraIconQuitado: { backgroundColor: QuickActionColors.background },
  topInfo: { flex: 1, gap: 4, minWidth: 0 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  atualBadge: {
    backgroundColor: QuickActionColors.background,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  atualBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
    textTransform: 'uppercase',
  },
  leituraPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: FlowHubColors.lightGray,
  },
  leituraPillQuitado: { backgroundColor: QuickActionColors.background },
  leituraLabel: {
    ...CobrancaTypography.label,
    color: FlowHubColors.darkGray,
  },
  leituraLabelQuitado: { color: FeatureColors.income },
  leitura: {
    fontSize: 18,
    fontWeight: '800',
    color: FlowHubColors.navy,
  },
  actionBtns: { flexDirection: 'row', gap: Spacing.one },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderColor: FlowHubPalette.borderSubtle,
  },
  deleteBtn: {
    backgroundColor: FeatureColors.expenseBg,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  valoresRow: { flexDirection: 'row', gap: Spacing.one },
  valorCell: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    gap: 2,
    alignItems: 'center',
  },
  valorLabel: {
    ...CobrancaTypography.label,
    fontSize: 11,
    color: FlowHubColors.darkGray,
  },
  valorValue: {
    fontSize: 13,
    fontWeight: '800',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  valorDestaque: { color: FlowHubColors.petroleum },
  pagamentoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  pagamentoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  pagamentoTextQuitado: { color: FeatureColors.income },
  pressed: { opacity: 0.88 },
});
