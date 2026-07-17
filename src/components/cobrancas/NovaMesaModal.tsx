import { useEffect, useState } from 'react';
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

import {
  VALOR_FICHA_PADRAO,
  formatValorFichaInput,
  parseValorFichaInput,
} from '@/components/cobrancas/cobrancas-utils';
import { FlowHubModalHeaderStrip } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type NovaMesaModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  initialNumeracao?: string;
  initialValorFicha?: number;
  title?: string;
  onClose: () => void;
  onSave: (data: { numeracao: string; valor_ficha: number }) => void;
};

export function NovaMesaModal({
  visible,
  saving,
  error,
  initialNumeracao = '',
  initialValorFicha = VALOR_FICHA_PADRAO,
  title = 'Nova mesa',
  onClose,
  onSave,
}: NovaMesaModalProps) {
  const [numeracao, setNumeracao] = useState('');
  const [valorFicha, setValorFicha] = useState(formatValorFichaInput(VALOR_FICHA_PADRAO));
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setNumeracao(initialNumeracao);
      setValorFicha(formatValorFichaInput(initialValorFicha));
      setLocalError(null);
    }
  }, [visible, initialNumeracao, initialValorFicha]);

  const displayError = localError ?? error;

  function handleSave() {
    if (!numeracao.trim()) {
      setLocalError('Informe a numeração.');
      return;
    }

    const ficha = parseValorFichaInput(valorFicha);
    if (ficha === null) {
      setLocalError('Valor da ficha inválido.');
      return;
    }

    setLocalError(null);
    onSave({ numeracao: numeracao.trim(), valor_ficha: ficha });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <FlowHubModalHeaderStrip />
            <ThemedText style={styles.title}>{title}</ThemedText>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Numeração *</ThemedText>
              <TextInput
                value={numeracao}
                onChangeText={setNumeracao}
                placeholder="N324, Mesa 1…"
                placeholderTextColor={FlowHubColors.darkGray}
                style={styles.input}
                autoFocus
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Valor da ficha (R$) *</ThemedText>
              <TextInput
                value={valorFicha}
                onChangeText={setValorFicha}
                placeholder="1,50"
                placeholderTextColor={FlowHubColors.darkGray}
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <ThemedText style={styles.hint} themeColor="textSecondary">
                Usado no cálculo: diferença × ficha ÷ 2
              </ThemedText>
            </View>

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

            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginBottom: Spacing.one,
  },
  field: { gap: Spacing.one },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },
  hint: { fontSize: 12, lineHeight: 17 },
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
