import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  Radius,
  Spacing,
  Typography,
} from '@/constants/theme';
import {
  createCliente,
  getClientes,
  type Cliente,
  type CreateClienteInput,
} from '@/services/api';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');

  const loadClientes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClientes();
    }, [loadClientes]),
  );

  function resetForm() {
    setNome('');
    setCpf('');
    setEndereco('');
    setNumero('');
    setFormError(null);
  }

  function openModal() {
    resetForm();
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    resetForm();
  }

  async function handleCreateCliente() {
    if (!nome.trim()) {
      setFormError('Informe o nome do cliente.');
      return;
    }

    const payload: CreateClienteInput = {
      nome: nome.trim(),
      cpf: cpf.trim() || null,
      endereco: endereco.trim() || null,
      numero: numero.trim() || null,
    };

    setSaving(true);
    setFormError(null);

    try {
      await createCliente(payload);
      closeModal();
      await loadClientes(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar cliente.');
    } finally {
      setSaving(false);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
          <ThemedText style={styles.stateText} themeColor="textSecondary">
            Carregando clientes...
          </ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerState}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable style={styles.retryButton} onPress={() => loadClientes()}>
            <ThemedText style={styles.retryButtonText}>Tentar novamente</ThemedText>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={clientes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadClientes(true)}
            tintColor={FlowHubColors.turquoise}
            colors={[FlowHubColors.turquoise]}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerState}>
            <ThemedText style={styles.stateText} themeColor="textSecondary">
              Nenhum cliente cadastrado ainda.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, cardShadowSoft]}>
            <ThemedText style={styles.cardTitle}>{item.nome?.trim() || 'Sem nome'}</ThemedText>
            <ThemedText style={styles.cardSubtitle} themeColor="textSecondary">
              {item.cpf?.trim() || 'CPF não informado'}
            </ThemedText>
          </View>
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Clientes</ThemedText>
        <Pressable style={styles.newButton} onPress={openModal}>
          <ThemedText style={styles.newButtonText}>Novo cliente</ThemedText>
        </Pressable>
      </View>

      {renderContent()}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalCard, cardShadowSoft]}>
            <ThemedText style={styles.modalTitle}>Novo cliente</ThemedText>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.form}>
              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>Nome *</ThemedText>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome completo"
                  placeholderTextColor={FlowHubColors.darkGray}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>CPF</ThemedText>
                <TextInput
                  value={cpf}
                  onChangeText={setCpf}
                  placeholder="000.000.000-00"
                  placeholderTextColor={FlowHubColors.darkGray}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>Endereço</ThemedText>
                <TextInput
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholder="Rua, bairro, cidade"
                  placeholderTextColor={FlowHubColors.darkGray}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>Número</ThemedText>
                <TextInput
                  value={numero}
                  onChangeText={setNumero}
                  placeholder="Ex.: 12"
                  placeholderTextColor={FlowHubColors.darkGray}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>

              {formError ? <ThemedText style={styles.formError}>{formError}</ThemedText> : null}

              <View style={styles.modalActions}>
                <Pressable style={styles.cancelButton} onPress={closeModal} disabled={saving}>
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleCreateCliente}
                  disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color={FlowHubColors.white} />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    ...Typography.sectionTitle,
    color: FlowHubColors.navy,
    flex: 1,
  },
  newButton: {
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  newButtonText: {
    color: FlowHubColors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
    flexGrow: 1,
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  stateText: {
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: FlowHubColors.petroleum,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryButtonText: {
    color: FlowHubColors.navy,
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    maxHeight: '88%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginBottom: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
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
  formError: {
    color: FlowHubColors.petroleum,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  cancelButton: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  cancelButtonText: {
    color: FlowHubColors.darkGray,
    fontWeight: '700',
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.navy,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: FlowHubColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
