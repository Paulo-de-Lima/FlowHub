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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { Cliente } from '@/services/api';

type CobrancaAddClienteModalProps = {
  visible: boolean;
  saving: boolean;
  error: string | null;
  allClientes: Cliente[];
  vinculadosIds: number[];
  onClose: () => void;
  onVincular: (clienteId: number) => void;
  onCriar: (data: {
    nome: string;
    cpf: string;
    endereco: string;
    numero: string;
    mesas: { numeracao: string }[];
  }) => void;
};

export function CobrancaAddClienteModal({
  visible,
  saving,
  error,
  allClientes,
  vinculadosIds,
  onClose,
  onVincular,
  onCriar,
}: CobrancaAddClienteModalProps) {
  const [modoNovo, setModoNovo] = React.useState(false);
  const [busca, setBusca] = React.useState('');
  const [nome, setNome] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [numero, setNumero] = React.useState('');
  const [mesas, setMesas] = React.useState<string[]>(['']);
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setModoNovo(false);
      setBusca('');
      setNome('');
      setCpf('');
      setEndereco('');
      setNumero('');
      setMesas(['']);
      setLocalError(null);
    }
  }, [visible]);

  const disponiveis = React.useMemo(() => {
    const vinculados = new Set(vinculadosIds);
    const termo = busca.trim().toLowerCase();
    return allClientes.filter((c) => {
      if (vinculados.has(c.id)) return false;
      if (!termo) return true;
      return c.nome?.toLowerCase().includes(termo);
    });
  }, [allClientes, vinculadosIds, busca]);

  const todosVinculados = allClientes.length > 0 && disponiveis.length === 0 && !busca.trim();
  const displayError = localError ?? error;

  function updateMesa(index: number, value: string) {
    setMesas((prev) => prev.map((m, i) => (i === index ? value : m)));
  }

  function addMesa() {
    setMesas((prev) => [...prev, '']);
  }

  function removeMesa(index: number) {
    if (mesas.length <= 1) return;
    setMesas((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCriar() {
    setLocalError(null);
    if (!nome.trim()) {
      setLocalError('Informe o nome do cliente.');
      return;
    }
    const mesasValidas = mesas.map((m) => m.trim()).filter(Boolean);
    if (mesasValidas.length === 0) {
      setLocalError('Informe ao menos uma numeração de mesa.');
      return;
    }
    onCriar({
      nome,
      cpf,
      endereco,
      numero,
      mesas: mesasValidas.map((numeracao) => ({ numeracao })),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.card, cardShadowSoft]}>
          <ThemedText style={styles.title}>Adicionar cliente</ThemedText>

          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, !modoNovo && styles.tabActive]}
              onPress={() => setModoNovo(false)}>
              <ThemedText style={[styles.tabText, !modoNovo && styles.tabTextActive]}>
                Existente
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.tab, modoNovo && styles.tabActive]}
              onPress={() => setModoNovo(true)}>
              <ThemedText style={[styles.tabText, modoNovo && styles.tabTextActive]}>Novo</ThemedText>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}>
            <Animated.View
              key={modoNovo ? 'novo' : 'existente'}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={styles.tabContent}>
              {modoNovo ? (
                <>
                  <Field label="Nome *" value={nome} onChangeText={setNome} />
                  <Field label="CPF" value={cpf} onChangeText={setCpf} />
                  <Field label="Endereço" value={endereco} onChangeText={setEndereco} />
                  <Field
                    label="Telefone"
                    value={numero}
                    onChangeText={setNumero}
                    keyboardType="number-pad"
                  />

                  <View style={styles.mesasSection}>
                    <ThemedText style={styles.sectionLabel}>Mesas do cliente *</ThemedText>
                    {mesas.map((mesa, index) => (
                      <View key={index} style={styles.mesaRow}>
                        <View style={styles.mesaField}>
                          <ThemedText style={styles.mesaFieldLabel}>Numeração *</ThemedText>
                          <TextInput
                            value={mesa}
                            onChangeText={(v) => updateMesa(index, v)}
                            placeholder="Ex.: N324"
                            placeholderTextColor={FlowHubColors.darkGray}
                            style={styles.input}
                          />
                        </View>
                        {mesas.length > 1 ? (
                          <Pressable
                            style={styles.removeMesaBtn}
                            onPress={() => removeMesa(index)}
                            accessibilityLabel="Remover mesa">
                            <SymbolView
                              name={{ ios: 'minus.circle.fill', android: 'remove_circle', web: 'remove_circle' }}
                              size={22}
                              tintColor="#DC2626"
                            />
                          </Pressable>
                        ) : null}
                      </View>
                    ))}
                    <Pressable style={styles.addMesaBtn} onPress={addMesa}>
                      <SymbolView
                        name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }}
                        size={18}
                        tintColor={FlowHubColors.turquoise}
                      />
                      <ThemedText style={styles.addMesaText}>Adicionar outra mesa</ThemedText>
                    </Pressable>
                  </View>

                  <Pressable
                    style={[styles.primaryBtn, saving && styles.btnDisabled]}
                    onPress={handleCriar}
                    disabled={saving}>
                    {saving ? (
                      <ActivityIndicator color={FlowHubColors.white} />
                    ) : (
                      <ThemedText style={styles.primaryBtnText}>Criar e vincular</ThemedText>
                    )}
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.searchWrap}>
                    <SymbolView
                      name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                      size={16}
                      tintColor={FlowHubColors.darkGray}
                    />
                    <TextInput
                      value={busca}
                      onChangeText={setBusca}
                      placeholder="Buscar cliente..."
                      placeholderTextColor={FlowHubColors.darkGray}
                      style={styles.searchInput}
                    />
                  </View>

                  {allClientes.length === 0 ? (
                    <EmptyHint message="Nenhum cliente cadastrado. Use a aba Novo." />
                  ) : todosVinculados ? (
                    <EmptyHint message="Todos os clientes já estão nesta cobrança. Cadastre um novo cliente." />
                  ) : disponiveis.length === 0 ? (
                    <EmptyHint message="Nenhum cliente encontrado para esta busca." />
                  ) : (
                    disponiveis.map((c) => (
                      <Pressable
                        key={c.id}
                        style={({ pressed }) => [styles.clienteRow, pressed && styles.pressed]}
                        onPress={() => onVincular(c.id)}
                        disabled={saving}>
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
            </Animated.View>

            {displayError ? <ThemedText style={styles.error}>{displayError}</ThemedText> : null}
          </ScrollView>

          <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>
            <ThemedText style={styles.cancelText}>Fechar</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <View style={styles.emptyHint}>
      <SymbolView
        name={{ ios: 'person.crop.circle.badge.questionmark', android: 'person', web: 'person' }}
        size={28}
        tintColor={FlowHubColors.darkGray}
      />
      <ThemedText style={styles.emptyHintText} themeColor="textSecondary">
        {message}
      </ThemedText>
    </View>
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
  tabRow: { flexDirection: 'row', gap: Spacing.one, marginBottom: Spacing.three },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
  },
  tabActive: { backgroundColor: FlowHubColors.navy },
  tabText: { fontWeight: '700', color: FlowHubColors.navy },
  tabTextActive: { color: FlowHubColors.white },
  scroll: { gap: Spacing.two, paddingBottom: Spacing.two },
  tabContent: { gap: Spacing.two },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: FlowHubColors.navy,
  },
  clienteRow: {
    padding: Spacing.three,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    gap: 2,
  },
  clienteNome: { fontSize: 15, fontWeight: '600', color: FlowHubColors.navy },
  clienteMeta: { fontSize: 12 },
  emptyHint: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  emptyHintText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  mesasSection: { gap: Spacing.two },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: FlowHubColors.navy },
  mesaRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  mesaField: { flex: 1, gap: Spacing.one },
  mesaFieldLabel: { fontSize: 13, fontWeight: '600', color: FlowHubColors.darkGray },
  removeMesaBtn: { paddingBottom: 12 },
  addMesaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  addMesaText: { fontSize: 14, fontWeight: '600', color: FlowHubColors.turquoise },
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
  primaryBtn: {
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  primaryBtnText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.7 },
  error: { color: FlowHubColors.petroleum, fontSize: 14 },
  cancelBtn: { alignItems: 'center', paddingTop: Spacing.three },
  cancelText: { color: FlowHubColors.darkGray, fontWeight: '700', fontSize: 15 },
  pressed: { opacity: 0.88 },
});
