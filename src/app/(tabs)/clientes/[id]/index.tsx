import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { CobrancaBreadcrumb } from '@/components/cobrancas/CobrancaBreadcrumb';
import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { formatTelefone } from '@/components/cobrancas/cobrancas-utils';
import { ClienteDetailHeroCard } from '@/components/clientes/ClienteDetailHeroCard';
import { ClienteFormModal } from '@/components/clientes/ClienteFormModal';
import { ClientesHeader } from '@/components/clientes/ClientesHeader';
import {
  CLIENTES_LIST_PATH,
  clienteMesasPath,
} from '@/components/clientes/route-utils';
import { useClienteDetailScreen } from '@/components/clientes/use-cliente-detail-screen';
import type { ClienteFormData } from '@/components/clientes/use-clientes-screen';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  HomeLayout,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import { deleteCliente, updateCliente, type UpdateClienteInput } from '@/services/api';

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useClienteDetailScreen(id);
  const scrollPad = useTabBarScrollPadding();

  const [formVisible, setFormVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      s.loadData();
    }, [s.loadData]),
  );

  const nome = s.cliente?.nome?.trim() || 'Cliente';

  function toPayload(data: ClienteFormData): UpdateClienteInput {
    return {
      nome: data.nome.trim(),
      cpf: data.cpf.trim() || null,
      endereco: data.endereco.trim() || null,
      numero: data.numero.trim() || null,
    };
  }

  async function handleSave(data: ClienteFormData) {
    if (!data.nome.trim()) {
      setFormError('Informe o nome do cliente.');
      return;
    }
    if (s.clienteId === null) return;

    setSaving(true);
    setFormError(null);

    try {
      await updateCliente(s.clienteId, toPayload(data));
      setFormVisible(false);
      s.showSuccess('Cliente atualizado.');
      await s.loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar cliente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (s.clienteId === null) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteCliente(s.clienteId);
      setDeleteVisible(false);
      setFormVisible(false);
      router.replace(CLIENTES_LIST_PATH);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir cliente.');
    } finally {
      setDeleting(false);
    }
  }

  if (s.loading && !s.cliente) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
      </View>
    );
  }

  if (s.error && !s.cliente) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.errorText}>{s.error}</ThemedText>
        <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
          <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPad }]}
          refreshControl={
            <RefreshControl
              refreshing={s.refreshing}
              onRefresh={() => s.loadData(true)}
              tintColor={FlowHubColors.turquoise}
            />
          }>
          <ClientesHeader
            title={nome}
            subtitle="Detalhes do cliente"
            onBack={() => router.navigate(CLIENTES_LIST_PATH)}
          />

          <CobrancaBreadcrumb
            segments={[
              { label: 'Clientes', onPress: () => router.navigate(CLIENTES_LIST_PATH) },
              { label: nome },
            ]}
          />

          <View style={styles.heroWrap}>
            {s.cliente ? (
              <ClienteDetailHeroCard
                totalDeve={s.cliente.totalDeve}
                totalPago={s.totalPago}
                qtdMesas={s.cliente.qtdMesas}
                registrosPendentes={s.cliente.registrosPendentes}
              />
            ) : null}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Dados cadastrais</ThemedText>
            <View style={[styles.card, cardShadowSoft]}>
              <DataRow label="CPF" value={s.clienteBase?.cpf || '—'} />
              <DataRow label="Telefone" value={formatTelefone(s.clienteBase?.numero)} />
              <DataRow label="Endereço" value={s.clienteBase?.endereco || '—'} />

              <Pressable
                style={styles.editBtn}
                onPress={() => {
                  setFormError(null);
                  setFormVisible(true);
                }}>
                <SymbolView
                  name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                  size={16}
                  tintColor={FlowHubColors.petroleum}
                />
                <ThemedText style={styles.editBtnText}>Editar dados</ThemedText>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.cta}
            onPress={() => {
              if (s.clienteId != null) router.push(clienteMesasPath(s.clienteId));
            }}>
            <ThemedText style={styles.ctaText}>Gerenciar mesas e leituras</ThemedText>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={18}
              tintColor={FlowHubColors.white}
            />
          </Pressable>
        </ScrollView>
      </View>

      <ClienteFormModal
        visible={formVisible}
        mode="edit"
        saving={saving}
        error={formError}
        initial={
          s.cliente
            ? {
                nome: s.cliente.nome ?? '',
                cpf: s.cliente.cpf ?? '',
                endereco: s.cliente.endereco ?? '',
                numero: s.cliente.numero ?? '',
              }
            : null
        }
        onClose={() => {
          setFormVisible(false);
          setFormError(null);
        }}
        onSave={handleSave}
        onDelete={() => {
          setDeleteError(null);
          setDeleteVisible(true);
        }}
      />

      <ConfirmDeleteModal
        visible={deleteVisible}
        title="Excluir cliente"
        message="Deseja excluir"
        highlight={nome}
        hint="Mesas, leituras e vínculos com cobranças serão removidos."
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          setDeleteVisible(false);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataRow}>
      <ThemedText style={styles.dataLabel}>{label}</ThemedText>
      <ThemedText style={styles.dataValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: FlowHubColors.lightGray },
  scrollContent: {},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.lightGray,
  },
  heroWrap: { marginTop: HomeLayout.heroOverlap, paddingHorizontal: Spacing.four, zIndex: 3 },
  section: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.two },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  dataRow: { gap: 4 },
  dataLabel: { fontSize: 12, fontWeight: '600', color: FlowHubColors.darkGray },
  dataValue: { fontSize: 15, fontWeight: '600', color: FlowHubColors.navy },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: FlowHubColors.petroleum },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: 16,
  },
  ctaText: { fontSize: 15, fontWeight: '700', color: FlowHubColors.navy },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
});
