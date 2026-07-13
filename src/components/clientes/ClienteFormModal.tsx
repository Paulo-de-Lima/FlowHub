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
import {
  cardShadowSoft,
  FlowHubColors,
  modalWebCard,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';

export type ClienteFormValues = {
  nome: string;
  cpf: string;
  endereco: string;
  numero: string;
};

type ClienteFormModalProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  saving: boolean;
  deleting?: boolean;
  error: string | null;
  initial: ClienteFormValues | null;
  onClose: () => void;
  onSave: (data: ClienteFormValues) => void;
  onDelete?: () => void;
};

export function ClienteFormModal({
  visible,
  mode,
  saving,
  deleting = false,
  error,
  initial,
  onClose,
  onSave,
  onDelete,
}: ClienteFormModalProps) {
  const [nome, setNome] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [numero, setNumero] = React.useState('');

  const busy = saving || deleting;
  const isEdit = mode === 'edit';

  React.useEffect(() => {
    if (visible) {
      setNome(initial?.nome ?? '');
      setCpf(initial?.cpf ?? '');
      setEndereco(initial?.endereco ?? '');
      setNumero(initial?.numero ?? '');
    }
  }, [visible, initial]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose}>
          <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.title}>
              {isEdit ? 'Editar cliente' : 'Novo cliente'}
            </ThemedText>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}>
              <Field label="Nome *" value={nome} onChangeText={setNome} autoCapitalize="words" />
              <Field label="CPF" value={cpf} onChangeText={setCpf} keyboardType="number-pad" />
              <Field label="Endereço" value={endereco} onChangeText={setEndereco} />
              <Field
                label="Telefone"
                value={numero}
                onChangeText={setNumero}
                keyboardType="phone-pad"
              />

              {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

              {isEdit && onDelete ? (
                <Pressable
                  style={[styles.destructiveBtn, busy && styles.btnDisabled]}
                  onPress={onDelete}
                  disabled={busy}
                  accessibilityLabel="Excluir cliente">
                  <ThemedText style={styles.destructiveBtnText}>Excluir cliente</ThemedText>
                </Pressable>
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
                    <ThemedText style={styles.saveText}>{isEdit ? 'Salvar' : 'Criar'}</ThemedText>
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

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
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
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    padding: Platform.OS === 'web' ? Spacing.four : 0,
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    maxHeight: '90%',
    ...modalWebCard,
    ...(Platform.OS === 'web' ? { borderRadius: Radius.xl } : {}),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginBottom: Spacing.three,
  },
  form: { gap: Spacing.three, paddingBottom: Spacing.two },
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
    borderColor: SemanticColors.borderSubtle,
  },
  error: { color: FlowHubColors.petroleum, fontSize: 14 },
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
