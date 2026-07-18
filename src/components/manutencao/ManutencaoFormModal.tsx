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
import { SymbolView } from 'expo-symbols';

import { formatQuantidade } from '@/components/manutencao/manutencao-utils';
import type { ManutencaoFormPayload } from '@/components/manutencao/manutencao-utils';
import { ThemedText } from '@/components/themed-text';
import { FlowHubModalHeaderStrip, flowHubModalStyles } from '@/components/ui/flowHubModalStyles';
import { FlowHubSearchField } from '@/components/ui/FlowHubSearchField';
import {
  cardShadowSoft,
  FeatureColors,
  FlowHubColors,
  modalWebCard,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { ClienteSummary, Material } from '@/services/api';

type MaterialRow = {
  key: string;
  materialId: number | null;
  quantidade: string;
};

type ManutencaoFormModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  clientes: ClienteSummary[];
  materiais: Material[];
  onClose: () => void;
  onSave: (data: ManutencaoFormPayload) => void;
};

function createEmptyRow(): MaterialRow {
  return { key: String(Date.now()) + Math.random(), materialId: null, quantidade: '' };
}

export function ManutencaoFormModal({
  visible,
  saving,
  error,
  clientes,
  materiais,
  onClose,
  onSave,
}: ManutencaoFormModalProps) {
  const [clienteId, setClienteId] = React.useState<number | null>(null);
  const [descricao, setDescricao] = React.useState('');
  const [buscaCliente, setBuscaCliente] = React.useState('');
  const [rows, setRows] = React.useState<MaterialRow[]>([createEmptyRow()]);
  const [pickerRowKey, setPickerRowKey] = React.useState<string | null>(null);
  const [buscaMaterial, setBuscaMaterial] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setClienteId(null);
      setDescricao('');
      setBuscaCliente('');
      setRows([createEmptyRow()]);
      setPickerRowKey(null);
      setBuscaMaterial('');
      setLocalError(null);
    }
  }, [visible]);

  const clientesFiltrados = React.useMemo(() => {
    const termo = buscaCliente.trim().toLowerCase();
    return clientes.filter((c) => {
      if (!termo) return true;
      const nome = c.nome?.toLowerCase() ?? '';
      const endereco = c.endereco?.toLowerCase() ?? '';
      return nome.includes(termo) || endereco.includes(termo);
    });
  }, [clientes, buscaCliente]);

  const materiaisFiltrados = React.useMemo(() => {
    const termo = buscaMaterial.trim().toLowerCase();
    return materiais.filter((m) => {
      if (!termo) return true;
      return m.nome.toLowerCase().includes(termo);
    });
  }, [materiais, buscaMaterial]);

  const materiaisById = React.useMemo(
    () => new Map(materiais.map((m) => [m.id, m])),
    [materiais],
  );

  const displayError = localError ?? error;
  const selectedCliente = clientes.find((c) => c.id === clienteId) ?? null;

  function updateRow(key: string, patch: Partial<MaterialRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, createEmptyRow()]);
  }

  function removeRow(key: string) {
    setRows((prev) => {
      if (prev.length <= 1) return [createEmptyRow()];
      return prev.filter((row) => row.key !== key);
    });
    if (pickerRowKey === key) setPickerRowKey(null);
  }

  function selectMaterial(rowKey: string, materialId: number) {
    updateRow(rowKey, { materialId });
    setPickerRowKey(null);
    setBuscaMaterial('');
  }

  function handleSubmit() {
    setLocalError(null);

    if (!clienteId) {
      setLocalError('Selecione um cliente.');
      return;
    }

    if (!descricao.trim()) {
      setLocalError('Informe a descrição da manutenção.');
      return;
    }

    const itens = rows
      .filter((row) => row.materialId != null)
      .map((row) => ({
        materialId: row.materialId!,
        quantidade: Number(row.quantidade.replace(',', '.')),
      }));

    if (itens.length === 0) {
      setLocalError('Adicione pelo menos um material.');
      return;
    }

    onSave({
      clienteId,
      descricao: descricao.trim(),
      itens,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlayPress} onPress={onClose} accessibilityLabel="Fechar" />
        <View style={[flowHubModalStyles.card, styles.card, cardShadowSoft]}>
          <FlowHubModalHeaderStrip />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={flowHubModalStyles.scroll}>
            <ThemedText style={flowHubModalStyles.title}>Nova manutenção</ThemedText>
            <ThemedText style={styles.subtitle}>
              Selecione o cliente, descreva o serviço e informe os materiais utilizados.
            </ThemedText>

            <SectionLabel label="Cliente *" />
            {selectedCliente ? (
              <View style={styles.selectedCliente}>
                <View style={styles.selectedClienteInfo}>
                  <ThemedText style={styles.selectedClienteNome}>
                    {selectedCliente.nome ?? 'Sem nome'}
                  </ThemedText>
                  {selectedCliente.endereco ? (
                    <ThemedText style={styles.selectedClienteMeta} themeColor="textSecondary">
                      {selectedCliente.endereco}
                    </ThemedText>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => setClienteId(null)}
                  style={({ pressed }) => [styles.changeBtn, pressed && styles.pressed]}
                  accessibilityLabel="Trocar cliente">
                  <ThemedText style={styles.changeBtnText}>Trocar</ThemedText>
                </Pressable>
              </View>
            ) : (
              <>
                <FlowHubSearchField
                  value={buscaCliente}
                  onChangeText={setBuscaCliente}
                  placeholder="Buscar cliente..."
                />
                {clientes.length === 0 ? (
                  <HintBox message="Nenhum cliente cadastrado. Cadastre clientes antes de registrar manutenções." />
                ) : clientesFiltrados.length === 0 ? (
                  <HintBox message="Nenhum cliente encontrado para esta busca." />
                ) : (
                  clientesFiltrados.map((c) => (
                    <Pressable
                      key={c.id}
                      style={({ pressed }) => [styles.clienteRow, pressed && styles.pressed]}
                      onPress={() => setClienteId(c.id)}>
                      <ThemedText style={styles.clienteNome}>{c.nome ?? 'Sem nome'}</ThemedText>
                      {c.endereco ? (
                        <ThemedText style={styles.clienteMeta} themeColor="textSecondary">
                          {c.endereco}
                        </ThemedText>
                      ) : null}
                    </Pressable>
                  ))
                )}
              </>
            )}

            <SectionLabel label="Descrição *" />
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva o serviço realizado..."
              placeholderTextColor={FlowHubColors.darkGray}
              multiline
              textAlignVertical="top"
              style={[flowHubModalStyles.input, styles.textArea]}
            />

            <View style={styles.materialsHeader}>
              <SectionLabel label="Materiais utilizados *" />
              <Pressable
                style={({ pressed }) => [styles.addRowBtn, pressed && styles.pressed]}
                onPress={addRow}
                accessibilityLabel="Adicionar material">
                <SymbolView
                  name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }}
                  size={18}
                  tintColor={FlowHubColors.turquoise}
                />
                <ThemedText style={styles.addRowText}>Adicionar</ThemedText>
              </Pressable>
            </View>

            {materiais.length === 0 ? (
              <HintBox message="Nenhum material cadastrado no estoque." />
            ) : (
              rows.map((row, index) => {
                const material = row.materialId ? materiaisById.get(row.materialId) : null;
                const pickerOpen = pickerRowKey === row.key;

                return (
                  <View key={row.key} style={styles.materialRow}>
                    <View style={styles.materialRowHeader}>
                      <ThemedText style={styles.materialRowLabel}>Material {index + 1}</ThemedText>
                      {rows.length > 1 ? (
                        <Pressable
                          onPress={() => removeRow(row.key)}
                          style={({ pressed }) => [styles.removeBtn, pressed && styles.pressed]}
                          accessibilityLabel="Remover material">
                          <SymbolView
                            name={{
                              ios: 'minus.circle.fill',
                              android: 'remove_circle',
                              web: 'remove_circle',
                            }}
                            size={20}
                            tintColor={FeatureColors.expense}
                          />
                        </Pressable>
                      ) : null}
                    </View>

                    <Pressable
                      style={({ pressed }) => [
                        styles.materialPicker,
                        pickerOpen && styles.materialPickerActive,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {
                        setPickerRowKey(pickerOpen ? null : row.key);
                        setBuscaMaterial('');
                      }}>
                      <ThemedText
                        style={[
                          styles.materialPickerText,
                          !material && styles.materialPickerPlaceholder,
                        ]}
                        numberOfLines={1}>
                        {material?.nome ?? 'Selecionar material'}
                      </ThemedText>
                      <SymbolView
                        name={{
                          ios: pickerOpen ? 'chevron.up' : 'chevron.down',
                          android: pickerOpen ? 'expand_less' : 'expand_more',
                          web: pickerOpen ? 'expand_less' : 'expand_more',
                        }}
                        size={16}
                        tintColor={FlowHubColors.darkGray}
                      />
                    </Pressable>

                    {pickerOpen ? (
                      <View style={styles.pickerPanel}>
                        <FlowHubSearchField
                          value={buscaMaterial}
                          onChangeText={setBuscaMaterial}
                          placeholder="Buscar material..."
                        />
                        {materiaisFiltrados.length === 0 ? (
                          <ThemedText style={styles.pickerEmpty} themeColor="textSecondary">
                            Nenhum material encontrado.
                          </ThemedText>
                        ) : (
                          materiaisFiltrados.map((m) => (
                            <Pressable
                              key={m.id}
                              style={({ pressed }) => [
                                styles.materialOption,
                                row.materialId === m.id && styles.materialOptionSelected,
                                pressed && styles.pressed,
                              ]}
                              onPress={() => selectMaterial(row.key, m.id)}>
                              <ThemedText style={styles.materialOptionNome}>{m.nome}</ThemedText>
                              <ThemedText style={styles.materialOptionStock} themeColor="textSecondary">
                                Disponível: {formatQuantidade(m.quantidade, m.unidade)}
                              </ThemedText>
                            </Pressable>
                          ))
                        )}
                      </View>
                    ) : null}

                    <View style={styles.qtyRow}>
                      <View style={styles.qtyField}>
                        <ThemedText style={styles.fieldLabel}>Quantidade *</ThemedText>
                        <TextInput
                          value={row.quantidade}
                          onChangeText={(v) => updateRow(row.key, { quantidade: v })}
                          placeholder="0"
                          placeholderTextColor={FlowHubColors.darkGray}
                          keyboardType="decimal-pad"
                          style={styles.qtyInput}
                        />
                      </View>
                      {material ? (
                        <View style={styles.stockHint}>
                          <ThemedText style={styles.stockHintLabel}>Estoque disponível</ThemedText>
                          <ThemedText style={styles.stockHintValue}>
                            {formatQuantidade(material.quantidade, material.unidade)}
                          </ThemedText>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}

            {displayError ? <ThemedText style={styles.error}>{displayError}</ThemedText> : null}

            <View style={styles.actions}>
              <Pressable
                style={[flowHubModalStyles.secondaryBtn, saving && styles.btnDisabled]}
                onPress={onClose}
                disabled={saving}>
                <ThemedText style={styles.secondaryBtnText}>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={[flowHubModalStyles.primaryBtn, saving && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={FlowHubColors.white} />
                ) : (
                  <ThemedText style={styles.primaryBtnText}>Registrar</ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <ThemedText style={styles.sectionLabel}>{label}</ThemedText>;
}

function HintBox({ message }: { message: string }) {
  return (
    <View style={styles.hintBox}>
      <ThemedText style={styles.hintText} themeColor="textSecondary">
        {message}
      </ThemedText>
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
  overlayPress: { ...StyleSheet.absoluteFill },
  card: {
    ...(Platform.OS === 'web' ? { borderRadius: Radius.xl, maxWidth: 560, alignSelf: 'center', width: '100%' } : {}),
    ...modalWebCard,
  },
  subtitle: {
    fontSize: 14,
    color: FlowHubColors.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  clienteRow: {
    padding: Spacing.three,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    gap: 2,
  },
  clienteNome: { fontSize: 15, fontWeight: '600', color: FlowHubColors.navy },
  clienteMeta: { fontSize: 12 },
  selectedCliente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: FlowHubColors.turquoise,
  },
  selectedClienteInfo: { flex: 1, gap: 2 },
  selectedClienteNome: { fontSize: 15, fontWeight: '700', color: FlowHubColors.navy },
  selectedClienteMeta: { fontSize: 12 },
  changeBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    backgroundColor: FlowHubColors.white,
    borderWidth: 1,
    borderColor: '#D8E0E8',
  },
  changeBtnText: { fontSize: 13, fontWeight: '700', color: FlowHubColors.petroleum },
  textArea: {
    minHeight: 96,
    paddingTop: 12,
  },
  materialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.one,
  },
  addRowText: { fontSize: 14, fontWeight: '600', color: FlowHubColors.turquoise },
  materialRow: {
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    marginTop: Spacing.one,
  },
  materialRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  materialRowLabel: { fontSize: 13, fontWeight: '700', color: FlowHubColors.petroleum },
  removeBtn: { padding: 2 },
  materialPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },
  materialPickerActive: {
    borderColor: FlowHubColors.turquoise,
  },
  materialPickerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
  materialPickerPlaceholder: {
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  pickerPanel: {
    gap: Spacing.one,
    padding: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  pickerEmpty: { fontSize: 13, textAlign: 'center', paddingVertical: Spacing.two },
  materialOption: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    gap: 2,
  },
  materialOptionSelected: {
    backgroundColor: 'rgba(20, 200, 196, 0.12)',
  },
  materialOptionNome: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },
  materialOptionStock: { fontSize: 12 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  qtyField: { flex: 1, gap: Spacing.one },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray },
  qtyInput: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    color: FlowHubColors.navy,
  },
  stockHint: {
    flex: 1,
    gap: 2,
    paddingBottom: 4,
  },
  stockHintLabel: { fontSize: 11, fontWeight: '600', color: FlowHubColors.darkGray },
  stockHintValue: { fontSize: 14, fontWeight: '700', color: FlowHubColors.petroleum },
  hintBox: {
    padding: Spacing.three,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
  },
  hintText: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  error: {
    color: FeatureColors.expense,
    fontSize: 14,
    marginTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  primaryBtnText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
  secondaryBtnText: { color: FlowHubColors.navy, fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.7 },
  pressed: { opacity: 0.88 },
});
