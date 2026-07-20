import React, { useMemo, useState } from 'react';
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

import { FlowHubModalHeaderStrip, flowHubModalStyles } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';
import type { Material } from '@/services/api';

export type MaterialFormData = {
  nome: string;
  unidade: string;
  quantidade: string;
  estoqueMinimo: string;
};

type MaterialFormModalProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  saving: boolean;
  deleting?: boolean;
  error: string | null;
  materiais: Material[];
  initial?: Material | null;
  onClose: () => void;
  onSave: (data: MaterialFormData) => void;
  onDelete?: () => void;
};

export function MaterialFormModal({
  visible,
  mode,
  saving,
  deleting = false,
  error,
  materiais,
  initial = null,
  onClose,
  onSave,
  onDelete,
}: MaterialFormModalProps) {
  const isEdit = mode === 'edit' && initial != null;
  const busy = saving || deleting;

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('5');
  const [localError, setLocalError] = useState<string | null>(null);
  const [nomeFocused, setNomeFocused] = useState(false);

  React.useEffect(() => {
    if (!visible) return;
    if (isEdit && initial) {
      setNome(initial.nome);
      setUnidade(initial.unidade?.trim() || '');
      setQuantidade(String(initial.quantidade));
      setEstoqueMinimo(String(initial.estoqueMinimo));
    } else {
      setNome('');
      setUnidade('');
      setQuantidade('');
      setEstoqueMinimo('5');
    }
    setLocalError(null);
    setNomeFocused(false);
  }, [visible, isEdit, initial]);

  const sugestoes = useMemo(() => {
    if (isEdit) return [];
    const termo = nome.trim().toLowerCase();
    if (!termo) return [];
    const seen = new Set<string>();
    const matches: Material[] = [];
    for (const m of materiais) {
      const key = m.nome.trim().toLowerCase();
      if (!key.includes(termo) || seen.has(key)) continue;
      seen.add(key);
      matches.push(m);
      if (matches.length >= 6) break;
    }
    return matches;
  }, [materiais, nome, isEdit]);

  const displayError = localError ?? error;

  function selectSugestao(material: Material) {
    setNome(material.nome);
    setUnidade(material.unidade?.trim() || '');
    setEstoqueMinimo(String(material.estoqueMinimo));
    setNomeFocused(false);
  }

  function handleSave() {
    setLocalError(null);
    onSave({ nome, unidade, quantidade, estoqueMinimo });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={flowHubModalStyles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={flowHubModalStyles.overlayPress} onPress={onClose}>
          <Pressable style={[flowHubModalStyles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
            <FlowHubModalHeaderStrip />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={flowHubModalStyles.scroll}
              showsVerticalScrollIndicator={false}>
              <ThemedText style={flowHubModalStyles.title}>
                {isEdit ? 'Editar material' : 'Registrar material'}
              </ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                {isEdit
                  ? 'Atualize nome, unidade, quantidade em estoque e estoque mínimo.'
                  : 'Informe nome, unidade, quantidade inicial e estoque mínimo.'}
              </ThemedText>

              <Field label="Nome *">
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  onFocus={() => setNomeFocused(true)}
                  onBlur={() => setTimeout(() => setNomeFocused(false), 150)}
                  placeholder="Ex.: Tinta branca"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="words"
                  style={flowHubModalStyles.input}
                />
                {nomeFocused && sugestoes.length > 0 ? (
                  <View style={styles.suggestions}>
                    {sugestoes.map((m) => (
                      <Pressable key={m.id} style={styles.suggestionItem} onPress={() => selectSugestao(m)}>
                        <ThemedText style={styles.suggestionNome} numberOfLines={1}>
                          {m.nome}
                        </ThemedText>
                        <ThemedText style={styles.suggestionMeta} themeColor="textSecondary">
                          {m.unidade?.trim() || 'un'}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </Field>

              <Field label="Unidade *">
                <TextInput
                  value={unidade}
                  onChangeText={setUnidade}
                  placeholder="Ex.: kg, L, un"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="none"
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label={isEdit ? 'Quantidade *' : 'Quantidade inicial *'}>
                <TextInput
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label="Estoque mínimo *">
                <TextInput
                  value={estoqueMinimo}
                  onChangeText={setEstoqueMinimo}
                  keyboardType="number-pad"
                  placeholder="5"
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={flowHubModalStyles.input}
                />
              </Field>

              {displayError ? <ThemedText style={styles.error}>{displayError}</ThemedText> : null}

              {isEdit && onDelete ? (
                <Pressable style={styles.deleteBtn} onPress={onDelete} disabled={busy}>
                  <ThemedText style={styles.deleteText}>Excluir material</ThemedText>
                </Pressable>
              ) : null}

              <View style={styles.actions}>
                <Pressable style={flowHubModalStyles.secondaryBtn} onPress={onClose} disabled={busy}>
                  <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
                </Pressable>
                <Pressable
                  style={[flowHubModalStyles.primaryBtn, busy && styles.btnDisabled]}
                  onPress={handleSave}
                  disabled={busy}>
                  {saving ? (
                    <ActivityIndicator color={FlowHubColors.white} />
                  ) : (
                    <ThemedText style={styles.saveText}>
                      {isEdit ? 'Salvar alterações' : 'Salvar material'}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.one },
  field: { marginTop: Spacing.one },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray, marginBottom: 4 },
  suggestions: {
    marginTop: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    backgroundColor: FlowHubColors.white,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: FlowHubPalette.borderSubtle,
  },
  suggestionNome: { flex: 1, fontSize: 15, fontWeight: '600', color: FlowHubColors.navy },
  suggestionMeta: { fontSize: 12, fontWeight: '500' },
  error: { color: FeatureColors.expense, fontSize: 14, marginTop: Spacing.three, textAlign: 'center' },
  deleteBtn: {
    marginTop: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    backgroundColor: FeatureColors.expenseBg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: { color: FeatureColors.expense, fontWeight: '700', fontSize: 15 },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  cancelText: { fontSize: 16, fontWeight: '600', color: FlowHubColors.petroleum },
  saveText: { fontSize: 16, fontWeight: '700', color: FlowHubColors.white },
  btnDisabled: { opacity: 0.6 },
});
