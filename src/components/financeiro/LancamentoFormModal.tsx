import React from 'react';
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
  formatDate,
  parseDisplayDateToISO,
  todayDisplay,
} from '@/components/cobrancas/cobrancas-utils';
import { flowHubModalStyles, FlowHubModalHeaderStrip } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  modalWebCard,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { LancamentoFinanceiro } from '@/services/api';

import { formatValorInput, parseValorInput, todayISO } from './financeiro-utils';
import type { LancamentoFormData } from './use-financeiro-screen';

type LancamentoFormModalProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  saving: boolean;
  error: string | null;
  initialTipo: 'receita' | 'despesa';
  editItem?: LancamentoFinanceiro | null;
  onClose: () => void;
  onSubmit: (data: LancamentoFormData) => void;
};

export function LancamentoFormModal({
  visible,
  mode,
  saving,
  error,
  initialTipo,
  editItem = null,
  onClose,
  onSubmit,
}: LancamentoFormModalProps) {
  const isEdit = mode === 'edit' && editItem != null;
  const [tipo, setTipo] = React.useState<'receita' | 'despesa'>(initialTipo);
  const [origem, setOrigem] = React.useState('');
  const [valorText, setValorText] = React.useState('');
  const [dataGasto, setDataGasto] = React.useState('');

  React.useEffect(() => {
    if (!visible) return;
    if (isEdit && editItem) {
      setTipo(editItem.tipo);
      setOrigem(editItem.origem);
      setValorText(formatValorInput(editItem.valor));
      setDataGasto(formatDate(editItem.dataGasto ?? todayISO()));
    } else {
      setTipo(initialTipo);
      setOrigem('');
      setValorText('');
      setDataGasto(todayDisplay());
    }
  }, [visible, initialTipo, isEdit, editItem]);

  function handleSubmit() {
    const valor = parseValorInput(valorText);
    const iso = parseDisplayDateToISO(dataGasto) ?? todayISO();
    onSubmit({
      tipo,
      origem,
      valor: valor ?? 0,
      dataGasto: iso,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={flowHubModalStyles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <FlowHubModalHeaderStrip />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={flowHubModalStyles.scroll}>
              <ThemedText style={flowHubModalStyles.title}>
                {isEdit ? 'Editar registro' : 'Novo registro'}
              </ThemedText>

              <ThemedText style={styles.sectionLabel}>Tipo</ThemedText>
              <View style={styles.tipoRow}>
                <TipoChip
                  label="Receita"
                  active={tipo === 'receita'}
                  activeColor={FeatureColors.income}
                  activeBg={FeatureColors.incomeBg}
                  onPress={() => setTipo('receita')}
                />
                <TipoChip
                  label="Despesa"
                  active={tipo === 'despesa'}
                  activeColor={FeatureColors.expense}
                  activeBg={FeatureColors.expenseBg}
                  onPress={() => setTipo('despesa')}
                />
              </View>

              <Field label="Origem *">
                <TextInput
                  value={origem}
                  onChangeText={setOrigem}
                  placeholder="Ex.: Venda, material, combustível..."
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label="Valor *">
                <TextInput
                  value={valorText}
                  onChangeText={setValorText}
                  placeholder="0,00"
                  placeholderTextColor={FlowHubColors.darkGray}
                  keyboardType="decimal-pad"
                  style={flowHubModalStyles.input}
                />
                {valorText ? (
                  <ThemedText style={styles.hint}>
                    {formatValorInput(parseValorInput(valorText) ?? 0)}
                  </ThemedText>
                ) : null}
              </Field>

              <Field label="Data">
                <TextInput
                  value={dataGasto}
                  onChangeText={setDataGasto}
                  placeholder={todayDisplay()}
                  placeholderTextColor={FlowHubColors.darkGray}
                  keyboardType="numbers-and-punctuation"
                  style={flowHubModalStyles.input}
                />
                <ThemedText style={styles.hint}>Formato DD/MM/AAAA</ThemedText>
              </Field>

              {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

              <View style={styles.actions}>
                <Pressable style={flowHubModalStyles.secondaryBtn} onPress={onClose} disabled={saving}>
                  <ThemedText style={styles.secondaryText}>Cancelar</ThemedText>
                </Pressable>
                <Pressable
                  style={[flowHubModalStyles.primaryBtn, saving && styles.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color={FlowHubColors.white} />
                  ) : (
                    <ThemedText style={styles.primaryText}>
                      {isEdit ? 'Salvar alterações' : 'Salvar registro'}
                    </ThemedText>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function TipoChip({
  label,
  active,
  activeColor,
  activeBg,
  onPress,
}: {
  label: string;
  active: boolean;
  activeColor: string;
  activeBg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tipoChip, active && { backgroundColor: activeBg, borderColor: activeColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <ThemedText style={[styles.tipoChipText, active && { color: activeColor }]}>{label}</ThemedText>
    </Pressable>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 46, 0.45)',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    padding: Platform.OS === 'web' ? Spacing.four : 0,
  },
  card: {
    backgroundColor: FlowHubPalette.surfaceElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '92%',
    overflow: 'hidden',
    ...modalWebCard,
    ...(Platform.OS === 'web' ? { borderRadius: Radius.xl } : {}),
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: FlowHubColors.navy,
    marginTop: Spacing.two,
  },
  tipoRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  tipoChip: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: FlowHubPalette.borderSubtle,
    backgroundColor: FlowHubPalette.surfaceSunken,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tipoChipText: { fontSize: 15, fontWeight: '700', color: FlowHubColors.darkGray },
  field: { gap: Spacing.one },
  label: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy, marginTop: Spacing.two },
  hint: { fontSize: 12, color: FlowHubColors.darkGray, marginTop: 4 },
  error: { color: FeatureColors.expense, fontSize: 14, marginTop: Spacing.two },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  secondaryText: { color: FlowHubColors.darkGray, fontWeight: '700', fontSize: 15 },
  primaryText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.7 },
});
