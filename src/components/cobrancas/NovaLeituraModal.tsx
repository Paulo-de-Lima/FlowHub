import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { formatCurrency, parseDisplayDateToISO, todayDisplay } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type NovaLeituraModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  mesaNumeracao: string;
  onClose: () => void;
  onSave: (data: { data_leitura: string; leitura: number; deve: number; valor_pago: number }) => void;
};

export function NovaLeituraModal({
  visible,
  saving,
  error,
  mesaNumeracao,
  onClose,
  onSave,
}: NovaLeituraModalProps) {
  const [dataLeitura, setDataLeitura] = useState('');
  const [leitura, setLeitura] = useState('');
  const [valor, setValor] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setDataLeitura(todayDisplay());
      setLeitura('');
      setValor('');
      setValorPago('');
      setLocalError(null);
    }
  }, [visible]);

  const valorNum = useMemo(() => {
    const parsed = Number.parseFloat(valor.trim().replace(',', '.'));
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [valor]);

  const valorPagoNum = useMemo(() => {
    if (!valorPago.trim()) return 0;
    const parsed = Number.parseFloat(valorPago.trim().replace(',', '.'));
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [valorPago]);

  const saldo = Math.max(0, valorNum - valorPagoNum);
  const displayError = localError ?? error;

  function handleSave() {
    const iso = parseDisplayDateToISO(dataLeitura);
    if (!iso) {
      setLocalError('Data inválida. Use DD/MM/AAAA.');
      return;
    }

    const leituraNum = Number.parseInt(leitura.trim(), 10);
    if (Number.isNaN(leituraNum) || leituraNum < 0) {
      setLocalError('Leitura inválida.');
      return;
    }

    if (Number.isNaN(valorNum) || valorNum < 0) {
      setLocalError('Valor deve ser ≥ 0.');
      return;
    }

    if (valorPago.trim() && (Number.isNaN(valorPagoNum) || valorPagoNum < 0)) {
      setLocalError('Valor pago inválido.');
      return;
    }

    if (valorPagoNum > valorNum) {
      setLocalError('O valor pago não pode ser maior que o valor da leitura.');
      return;
    }

    setLocalError(null);
    onSave({
      data_leitura: iso,
      leitura: leituraNum,
      deve: valorNum,
      valor_pago: valorPagoNum,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.title}>Nova leitura</ThemedText>
            <ThemedText style={styles.context} themeColor="textSecondary">
              Mesa {mesaNumeracao}
            </ThemedText>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}>
              <Field
                label="Data"
                value={dataLeitura}
                onChange={setDataLeitura}
                placeholder="DD/MM/AAAA"
              />
              <Field
                label="Leitura"
                value={leitura}
                onChange={setLeitura}
                keyboardType="number-pad"
                placeholder="Número do medidor"
              />
              <Field
                label="Valor (R$)"
                value={valor}
                onChange={setValor}
                keyboardType="decimal-pad"
                placeholder="0,00"
              />
              <Field
                label="Valor já pago (R$)"
                value={valorPago}
                onChange={setValorPago}
                keyboardType="decimal-pad"
                placeholder="0,00 — opcional"
              />

              {valorNum > 0 ? (
                <ThemedText style={styles.preview} themeColor="textSecondary">
                  Em aberto após salvar: {formatCurrency(saldo)}
                </ThemedText>
              ) : null}

              {displayError ? <ThemedText style={styles.formError}>{displayError}</ThemedText> : null}

              <Pressable
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={FlowHubColors.white} />
                ) : (
                  <ThemedText style={styles.saveBtnText}>Salvar</ThemedText>
                )}
              </Pressable>
            </ScrollView>

            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={FlowHubColors.darkGray}
        style={styles.input}
      />
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
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  context: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.two,
  },
  form: { gap: Spacing.two, paddingBottom: Spacing.two },
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
  preview: { fontSize: 13, fontWeight: '600' },
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
