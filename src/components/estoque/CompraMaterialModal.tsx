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

import { todayIsoDate } from '@/components/estoque/estoque-utils';
import type { CompraMaterialFormData } from '@/components/estoque/use-estoque-screen';
import { FlowHubModalHeaderStrip, flowHubModalStyles } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';
import type { Material } from '@/services/api';

type CompraMaterialModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  materiais: Material[];
  onClose: () => void;
  onSave: (data: CompraMaterialFormData) => void;
};

export function CompraMaterialModal({
  visible,
  saving,
  error,
  materiais,
  onClose,
  onSave,
}: CompraMaterialModalProps) {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [dataCompra, setDataCompra] = useState(todayIsoDate());
  const [localError, setLocalError] = useState<string | null>(null);
  const [nomeFocused, setNomeFocused] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setNome('');
      setUnidade('');
      setQuantidade('');
      setValorTotal('');
      setDataCompra(todayIsoDate());
      setLocalError(null);
      setNomeFocused(false);
    }
  }, [visible]);

  const sugestoes = useMemo(() => {
    const termo = nome.trim().toLowerCase();
    if (!termo || termo.length < 1) return [];

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
  }, [materiais, nome]);

  const showSugestoes = nomeFocused && sugestoes.length > 0;
  const displayError = localError ?? error;

  function selectSugestao(material: Material) {
    setNome(material.nome);
    setUnidade(material.unidade?.trim() || '');
    setNomeFocused(false);
  }

  function handleSave() {
    setLocalError(null);
    onSave({ nome, unidade, quantidade, valorTotal, dataCompra });
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
              <ThemedText style={flowHubModalStyles.title}>Registrar compra</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Informe o material, quantidade e valor da compra.
              </ThemedText>

              <Field label="Material *">
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  onFocus={() => setNomeFocused(true)}
                  onBlur={() => setTimeout(() => setNomeFocused(false), 150)}
                  placeholder="Ex.: Tinta branca"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="words"
                  style={[flowHubModalStyles.input, styles.inputTight]}
                />
                {showSugestoes ? (
                  <View style={styles.suggestions}>
                    {sugestoes.map((m) => (
                      <Pressable
                        key={m.id}
                        style={styles.suggestionItem}
                        onPress={() => selectSugestao(m)}>
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

              <Field label="Unidade">
                <TextInput
                  value={unidade}
                  onChangeText={setUnidade}
                  placeholder="Ex.: L, kg, un"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="none"
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label="Quantidade *">
                <TextInput
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label="Valor total (R$) *">
                <TextInput
                  value={valorTotal}
                  onChangeText={setValorTotal}
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={flowHubModalStyles.input}
                />
              </Field>

              <Field label="Data da compra">
                <TextInput
                  value={dataCompra}
                  onChangeText={setDataCompra}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="none"
                  style={flowHubModalStyles.input}
                />
              </Field>

              {displayError ? <ThemedText style={styles.error}>{displayError}</ThemedText> : null}

              <View style={styles.actions}>
                <Pressable style={flowHubModalStyles.secondaryBtn} onPress={onClose} disabled={saving}>
                  <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
                </Pressable>
                <Pressable
                  style={[flowHubModalStyles.primaryBtn, saving && styles.btnDisabled]}
                  onPress={handleSave}
                  disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color={FlowHubColors.white} />
                  ) : (
                    <ThemedText style={styles.saveText}>Salvar</ThemedText>
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
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.one,
  },
  field: {
    marginTop: Spacing.one,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
    marginBottom: 4,
  },
  inputTight: {
    marginTop: 0,
  },
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
  suggestionNome: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
  suggestionMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  error: {
    color: FeatureColors.expense,
    fontSize: 14,
    marginTop: Spacing.three,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  btnDisabled: { opacity: 0.6 },
});
