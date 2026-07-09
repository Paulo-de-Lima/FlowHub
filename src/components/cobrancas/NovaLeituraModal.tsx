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

import {
  calcularDeveLeitura,
  calcularDiferencaLeitura,
  formatCurrency,
  formatLeituraMedidor,
  getLeituraAnterior,
  isRolagemMedidor,
  MAX_LEITURA,
  parseDisplayDateToISO,
  todayDisplay,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { Mesa } from '@/services/api';

type NovaLeituraModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  mesa: Mesa | null;
  onClose: () => void;
  onSave: (data: { data_leitura: string; leitura: number; deve: number; valor_pago: number }) => void;
};

export function NovaLeituraModal({
  visible,
  saving,
  error,
  mesa,
  onClose,
  onSave,
}: NovaLeituraModalProps) {
  const [dataLeitura, setDataLeitura] = useState('');
  const [leitura, setLeitura] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setDataLeitura(todayDisplay());
      setLeitura('');
      setLocalError(null);
    }
  }, [visible]);

  const leituraAnterior = useMemo(
    () => (mesa ? getLeituraAnterior(mesa.registros) : null),
    [mesa],
  );

  const valorFicha = mesa?.valor_ficha ?? 1.5;

  const breakdown = useMemo(() => {
    const leituraNum = Number.parseInt(leitura.trim(), 10);
    if (!mesa || Number.isNaN(leituraNum) || leituraNum < 0) {
      return null;
    }

    if (leituraAnterior === null) {
      return {
        primeiraLeitura: true as const,
        deve: 0,
      };
    }

    const diferenca = calcularDiferencaLeitura(leituraAnterior, leituraNum);
    const bruto = diferenca * valorFicha;
    const deve = calcularDeveLeitura(leituraNum, leituraAnterior, valorFicha);
    const rolagem = isRolagemMedidor(leituraAnterior, leituraNum);
    const leituraIncomum = !rolagem && diferenca > 5000;

    return {
      primeiraLeitura: false as const,
      leituraAnterior,
      leituraAtual: leituraNum,
      diferenca,
      bruto,
      deve,
      rolagem,
      leituraIncomum,
    };
  }, [leitura, leituraAnterior, mesa, valorFicha]);

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

    if (!breakdown) {
      setLocalError('Informe a leitura do medidor.');
      return;
    }

    setLocalError(null);
    onSave({
      data_leitura: iso,
      leitura: leituraNum,
      deve: breakdown.deve,
      valor_pago: 0,
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
              Mesa {mesa?.numeracao ?? '—'} · Ficha {formatCurrency(valorFicha)}
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

              {breakdown ? (
                <View style={styles.breakdown}>
                  {breakdown.primeiraLeitura ? (
                    <ThemedText style={styles.breakdownHint} themeColor="textSecondary">
                      Primeira leitura desta mesa: valor a cobrar será R$ 0,00. A partir da
                      próxima leitura o valor será calculado automaticamente.
                    </ThemedText>
                  ) : (
                    <>
                      <ThemedText style={styles.breakdownTitle}>Cálculo</ThemedText>
                      {breakdown.rolagem ? (
                        <>
                          <ThemedText style={styles.rolagemHint}>
                            Rolagem do medidor detectada (99999 → 00000)
                          </ThemedText>
                          <ThemedText style={styles.breakdownLine} themeColor="textSecondary">
                            ({formatLeituraMedidor(breakdown.leituraAnterior)} →{' '}
                            {formatLeituraMedidor(breakdown.leituraAtual)}, rolagem) ={' '}
                            {breakdown.diferenca} fichas
                          </ThemedText>
                          <ThemedText style={styles.breakdownLine} themeColor="textSecondary">
                            ({MAX_LEITURA} − {breakdown.leituraAnterior} + 1) +{' '}
                            {breakdown.leituraAtual} = {breakdown.diferenca}
                          </ThemedText>
                        </>
                      ) : (
                        <ThemedText style={styles.breakdownLine} themeColor="textSecondary">
                          Diferença: {breakdown.leituraAtual} − {breakdown.leituraAnterior} ={' '}
                          {breakdown.diferenca}
                        </ThemedText>
                      )}
                      <ThemedText style={styles.breakdownLine} themeColor="textSecondary">
                        Bruto: {breakdown.diferenca} × {formatCurrency(valorFicha)} ={' '}
                        {formatCurrency(breakdown.bruto)}
                      </ThemedText>
                      <ThemedText style={styles.breakdownLine} themeColor="textSecondary">
                        ÷ 2 = {formatCurrency(breakdown.deve)}
                      </ThemedText>
                      <ThemedText style={styles.breakdownTotal}>
                        Valor a cobrar: {formatCurrency(breakdown.deve)}
                      </ThemedText>
                      {breakdown.leituraIncomum ? (
                        <ThemedText style={styles.avisoLeitura}>
                          Leitura incomum — confira se digitou corretamente.
                        </ThemedText>
                      ) : null}
                    </>
                  )}
                </View>
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
  breakdown: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  breakdownLine: { fontSize: 13, lineHeight: 19 },
  breakdownTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginTop: Spacing.one,
  },
  breakdownHint: { fontSize: 13, lineHeight: 19 },
  rolagemHint: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  avisoLeitura: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#B45309',
    marginTop: Spacing.one,
  },
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
