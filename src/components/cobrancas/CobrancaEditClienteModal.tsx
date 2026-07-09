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

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

type CobrancaEditClienteModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  initial: { nome: string; cpf: string; endereco: string; numero: string } | null;
  unlinking?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; cpf: string; endereco: string; numero: string }) => void;
  onDesvincular?: () => void;
  onExcluir?: () => void;
};

export function CobrancaEditClienteModal({
  visible,
  saving,
  error,
  initial,
  unlinking = false,
  deleting = false,
  onClose,
  onSave,
  onDesvincular,
  onExcluir,
}: CobrancaEditClienteModalProps) {
  const [nome, setNome] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [numero, setNumero] = React.useState('');

  const busy = saving || unlinking || deleting;

  React.useEffect(() => {
    if (visible && initial) {
      setNome(initial.nome);
      setCpf(initial.cpf);
      setEndereco(initial.endereco);
      setNumero(initial.numero);
    }
  }, [visible, initial]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.card, cardShadowSoft]}>
          <ThemedText style={styles.title}>Editar cliente</ThemedText>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}>
            <Field label="Nome *" value={nome} onChangeText={setNome} />
            <Field label="CPF" value={cpf} onChangeText={setCpf} />
            <Field label="Endereço" value={endereco} onChangeText={setEndereco} />
            <Field
              label="Telefone"
              value={numero}
              onChangeText={setNumero}
              keyboardType="number-pad"
            />

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            {onDesvincular || onExcluir ? (
              <View style={styles.secondaryActions}>
                {onDesvincular ? (
                  <Pressable
                    style={[styles.secondaryBtn, busy && styles.btnDisabled]}
                    onPress={onDesvincular}
                    disabled={busy}>
                    <ThemedText style={styles.secondaryBtnText}>Desvincular da cobrança</ThemedText>
                  </Pressable>
                ) : null}
                {onExcluir ? (
                  <Pressable
                    style={[styles.destructiveBtn, busy && styles.btnDisabled]}
                    onPress={onExcluir}
                    disabled={busy}>
                    <ThemedText style={styles.destructiveBtnText}>Excluir cliente</ThemedText>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={onClose} disabled={busy}>
                <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, busy && styles.btnDisabled]}
                onPress={() => onSave({ nome, cpf, endereco, numero })}
                disabled={busy}>
                {saving ? (
                  <ActivityIndicator color={FlowHubColors.white} />
                ) : (
                  <ThemedText style={styles.saveText}>Salvar</ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={FlowHubColors.darkGray}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginBottom: Spacing.three,
  },
  form: { gap: Spacing.three },
  field: { gap: Spacing.one },
  label: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },
  input: {
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    color: FlowHubColors.navy,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  error: { color: FlowHubColors.petroleum, fontSize: 14 },
  secondaryActions: { gap: Spacing.two, marginTop: Spacing.one },
  secondaryBtn: {
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  secondaryBtnText: { color: FlowHubColors.petroleum, fontWeight: '700', fontSize: 15 },
  destructiveBtn: {
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FDEBEA',
    borderWidth: 1,
    borderColor: '#F5C6C3',
  },
  destructiveBtnText: { color: '#C0392B', fontWeight: '700', fontSize: 15 },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  cancelBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  cancelText: { color: FlowHubColors.darkGray, fontWeight: '700', fontSize: 15 },
  saveBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.navy,
  },
  saveText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.7 },
});
