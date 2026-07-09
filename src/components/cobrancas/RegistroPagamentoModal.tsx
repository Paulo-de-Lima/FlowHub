import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { RegistroMesa } from '@/services/api';

type RegistroPagamentoModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  registro: RegistroMesa | null;
  onClose: () => void;
  onSave: (valorPago: number) => void;
};

export function RegistroPagamentoModal({
  visible,
  saving,
  error,
  registro,
  onClose,
  onSave,
}: RegistroPagamentoModalProps) {
  const [valorPago, setValorPago] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && registro) {
      setValorPago(String(registro.valor_pago ?? 0).replace('.', ','));
      setLocalError(null);
    }
  }, [visible, registro]);

  const valorTotal = registro?.deve ?? 0;
  const valorPagoNum = useMemo(() => {
    const parsed = Number.parseFloat(valorPago.trim().replace(',', '.'));
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [valorPago]);

  const saldo = registro ? Math.max(0, valorTotal - valorPagoNum) : 0;
  const displayError = localError ?? error;

  function handleSave() {
    if (!registro) return;
    if (Number.isNaN(valorPagoNum) || valorPagoNum < 0) {
      setLocalError('Informe um valor válido.');
      return;
    }
    if (valorPagoNum > valorTotal) {
      setLocalError(`O valor pago não pode ser maior que ${formatCurrency(valorTotal)}.`);
      return;
    }
    setLocalError(null);
    onSave(valorPagoNum);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.title}>Registrar pagamento</ThemedText>
            {registro ? (
              <ThemedText style={styles.context} themeColor="textSecondary">
                Leitura {registro.leitura} · {formatCurrency(valorTotal)} no total
              </ThemedText>
            ) : null}

            <View style={styles.resumo}>
              <ResumoItem label="Valor da leitura" value={formatCurrency(valorTotal)} />
              <ResumoItem
                label="Em aberto"
                value={formatCurrency(saldo)}
                highlight={saldo > 0}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Valor já pago (R$)</ThemedText>
              <TextInput
                value={valorPago}
                onChangeText={setValorPago}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor={FlowHubColors.darkGray}
                style={styles.input}
              />
              <ThemedText style={styles.helper} themeColor="textSecondary">
                Ex.: deve R$ 200,00 e pagou R$ 150,00 — informe 150.
              </ThemedText>
            </View>

            <View style={styles.quickRow}>
              <Pressable
                style={styles.quickBtn}
                onPress={() => setValorPago('0')}
                disabled={saving}>
                <ThemedText style={styles.quickText}>Zerar</ThemedText>
              </Pressable>
              <Pressable
                style={styles.quickBtn}
                onPress={() => setValorPago(String(valorTotal).replace('.', ','))}
                disabled={saving}>
                <ThemedText style={styles.quickText}>Pagou tudo</ThemedText>
              </Pressable>
            </View>

            {displayError ? <ThemedText style={styles.formError}>{displayError}</ThemedText> : null}

            <Pressable
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving || !registro}>
              {saving ? (
                <ActivityIndicator color={FlowHubColors.white} />
              ) : (
                <ThemedText style={styles.saveBtnText}>Salvar pagamento</ThemedText>
              )}
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ResumoItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.resumoItem}>
      <ThemedText style={styles.resumoLabel}>{label}</ThemedText>
      <ThemedText style={[styles.resumoValue, highlight && styles.resumoHighlight]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  overlayPress: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: { fontSize: 20, fontWeight: '700', color: FlowHubColors.navy },
  context: { fontSize: 14, fontWeight: '500' },
  resumo: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.two,
  },
  resumoItem: { flex: 1, gap: 2 },
  resumoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: FlowHubColors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  resumoValue: { fontSize: 16, fontWeight: '800', color: FlowHubColors.navy },
  resumoHighlight: { color: FlowHubColors.petroleum },
  field: { gap: Spacing.one },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },
  input: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
    color: FlowHubColors.navy,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  helper: { fontSize: 12, lineHeight: 17 },
  quickRow: { flexDirection: 'row', gap: Spacing.two },
  quickBtn: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quickText: { fontSize: 13, fontWeight: '700', color: FlowHubColors.petroleum },
  formError: { color: FlowHubColors.petroleum, fontSize: 14 },
  saveBtn: {
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: FlowHubColors.white, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.three },
  cancelText: { color: FlowHubColors.darkGray, fontWeight: '600' },
});
