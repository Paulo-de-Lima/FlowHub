import { SymbolView } from 'expo-symbols';
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
  formatDate,
  formatLeituraMedidor,
  getLeituraAnteriorParaEdicao,
  getUltimoRegistro,
  isDataAnteriorUltimaLeitura,
  isLeituraMedidorValida,
  isRolagemMedidor,
  MAX_LEITURA,
  parseDisplayDateToISO,
  todayDisplay,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, modalWebCard, QuickActionColors, Radius, SemanticColors, Spacing } from '@/constants/theme';
import type { Mesa, RegistroMesa } from '@/services/api';

type NovaLeituraModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  mesa: Mesa | null;
  mode?: 'create' | 'edit';
  registroEdit?: RegistroMesa | null;
  onClose: () => void;
  onSave: (data: { data_leitura: string; leitura: number; deve: number; valor_pago?: number }) => void;
};

export function NovaLeituraModal({
  visible,
  saving,
  error,
  mesa,
  mode = 'create',
  registroEdit = null,
  onClose,
  onSave,
}: NovaLeituraModalProps) {
  const isEdit = mode === 'edit' && registroEdit != null;
  const [dataLeitura, setDataLeitura] = useState('');
  const [leitura, setLeitura] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const ultimoRegistro = useMemo(
    () => (mesa && !isEdit ? getUltimoRegistro(mesa.registros) : null),
    [mesa, isEdit],
  );

  const leituraAnterior = useMemo(() => {
    if (!mesa) return null;
    if (isEdit && registroEdit) {
      return getLeituraAnteriorParaEdicao(mesa.registros, registroEdit.id);
    }
    return ultimoRegistro?.leitura ?? null;
  }, [mesa, isEdit, registroEdit, ultimoRegistro]);

  const valorFicha = mesa?.valor_ficha ?? 1.5;

  useEffect(() => {
    if (!visible) return;
    if (isEdit && registroEdit) {
      setDataLeitura(formatDate(registroEdit.data_leitura));
      setLeitura(String(registroEdit.leitura));
    } else {
      setDataLeitura(todayDisplay());
      setLeitura('');
    }
    setLocalError(null);
  }, [visible, isEdit, registroEdit]);

  const breakdown = useMemo(() => {
    const leituraNum = Number.parseInt(leitura.trim(), 10);
    if (!mesa || Number.isNaN(leituraNum)) return null;

    if (leituraAnterior === null) {
      return { primeiraLeitura: true as const, deve: 0 };
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

  const dataIncoerente = useMemo(() => {
    const iso = parseDisplayDateToISO(dataLeitura);
    if (!iso || isEdit) return false;
    return isDataAnteriorUltimaLeitura(iso, ultimoRegistro);
  }, [dataLeitura, isEdit, ultimoRegistro]);

  const leituraForaRange = useMemo(() => {
    if (!leitura.trim()) return false;
    const n = Number.parseInt(leitura.trim(), 10);
    return Number.isNaN(n) || !isLeituraMedidorValida(n);
  }, [leitura]);

  const displayError = localError ?? error;

  function handleSave() {
    const iso = parseDisplayDateToISO(dataLeitura);
    if (!iso) {
      setLocalError('Data inválida. Use DD/MM/AAAA.');
      return;
    }

    const leituraNum = Number.parseInt(leitura.trim(), 10);
    if (!isLeituraMedidorValida(leituraNum)) {
      setLocalError(`Leitura inválida. Use 0 a ${MAX_LEITURA} (5 dígitos).`);
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
      ...(isEdit && registroEdit ? { valor_pago: registroEdit.valor_pago } : {}),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.title}>{isEdit ? 'Editar leitura' : 'Nova leitura'}</ThemedText>
            <ThemedText style={styles.context} themeColor="textSecondary">
              Mesa {mesa?.numeracao ?? '—'} · Ficha {formatCurrency(valorFicha)}
            </ThemedText>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}>
              {!isEdit ? (
                <View style={styles.infoBoxHighlight}>
                  <SymbolView
                    name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
                    size={20}
                    tintColor={FlowHubColors.petroleum}
                  />
                  {ultimoRegistro ? (
                    <ThemedText style={styles.infoText} themeColor="textSecondary">
                      Última leitura:{' '}
                      <ThemedText style={styles.infoHighlight}>
                        {formatLeituraMedidor(ultimoRegistro.leitura)}
                      </ThemedText>{' '}
                      em {formatDate(ultimoRegistro.data_leitura)}
                    </ThemedText>
                  ) : (
                    <ThemedText style={styles.infoText} themeColor="textSecondary">
                      Primeira leitura desta mesa
                    </ThemedText>
                  )}
                </View>
              ) : leituraAnterior != null ? (
                <View style={styles.infoBoxHighlight}>
                  <ThemedText style={styles.infoText} themeColor="textSecondary">
                    Leitura anterior:{' '}
                    <ThemedText style={styles.infoHighlight}>
                      {formatLeituraMedidor(leituraAnterior)}
                    </ThemedText>
                  </ThemedText>
                </View>
              ) : null}

              <Field label="Data" value={dataLeitura} onChange={setDataLeitura} placeholder="DD/MM/AAAA" />
              <Field
                label="Leitura"
                value={leitura}
                onChange={setLeitura}
                keyboardType="number-pad"
                placeholder="00000"
                hint="5 dígitos (0 a 99999)"
              />

              {dataIncoerente ? (
                <ThemedText style={styles.avisoLeitura}>
                  Data anterior à última leitura — confira se está correto.
                </ThemedText>
              ) : null}

              {leituraForaRange ? (
                <ThemedText style={styles.avisoLeitura}>
                  Leitura fora do intervalo 0–99999 — confira o medidor.
                </ThemedText>
              ) : null}

              {breakdown ? (
                <View style={styles.breakdown}>
                  {breakdown.primeiraLeitura ? (
                    <ThemedText style={styles.breakdownHint} themeColor="textSecondary">
                      Primeira leitura: valor a cobrar será R$ 0,00.
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
  hint,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
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
        maxLength={keyboardType === 'number-pad' ? 5 : undefined}
      />
      {hint ? (
        <ThemedText style={styles.fieldHint} themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  overlayPress: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    padding: Platform.OS === 'web' ? Spacing.four : 0,
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    maxHeight: '85%',
    ...modalWebCard,
    ...(Platform.OS === 'web' ? { borderRadius: Radius.xl } : {}),
  },
  title: { fontSize: 20, fontWeight: '700', color: FlowHubColors.navy },
  context: { fontSize: 14, fontWeight: '500', marginBottom: Spacing.two },
  form: { gap: Spacing.two, paddingBottom: Spacing.two },
  infoBoxHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: QuickActionColors.background,
    borderRadius: Radius.md,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(20, 200, 196, 0.35)',
  },
  infoBox: {
    backgroundColor: QuickActionColors.background,
    borderRadius: Radius.md,
    padding: Spacing.two,
  },
  infoText: { fontSize: 13, lineHeight: 19 },
  infoHighlight: { fontWeight: '700', color: FlowHubColors.navy },
  field: { gap: Spacing.one },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },
  fieldHint: { fontSize: 12, lineHeight: 17 },
  input: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
    color: FlowHubColors.navy,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
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
