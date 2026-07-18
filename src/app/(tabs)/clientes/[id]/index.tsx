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
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { formatTelefone } from '@/components/cobrancas/cobrancas-utils';
import { ClienteDetailHeroCard } from '@/components/clientes/ClienteDetailHeroCard';
import { ClienteFormModal } from '@/components/clientes/ClienteFormModal';
import { ClientesHeader } from '@/components/clientes/ClientesHeader';
import { ClientesScreenBackdrop } from '@/components/clientes/ClientesScreenBackdrop';
import {
  CLIENTES_LIST_PATH,
  clienteMesasPath,
} from '@/components/clientes/route-utils';
import { FlowHubAddButton, FlowHubNavButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubHeaderActionButton } from '@/components/ui/FlowHubScreenHeader';
import { useClienteDetailScreen } from '@/components/clientes/use-cliente-detail-screen';
import type { ClienteFormData } from '@/components/clientes/use-clientes-screen';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  HomeLayout,
  Radius,
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

      <ClientesScreenBackdrop>
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
            breadcrumb={[
              { label: 'Clientes', onPress: () => router.navigate(CLIENTES_LIST_PATH) },
              { label: nome },
            ]}
            headerRight={
              <FlowHubHeaderActionButton
                icon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                accessibilityLabel="Editar cliente"
                onPress={() => {
                  setFormError(null);
                  setFormVisible(true);
                }}
              />
            }
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
              <DataRow
                label="CPF"
                value={s.clienteBase?.cpf || '—'}
                icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
                iconBg={QuickActionColors.background}
              />
              <DataRow
                label="Telefone"
                value={formatTelefone(s.clienteBase?.numero)}
                icon={{ ios: 'phone.fill', android: 'phone', web: 'phone' }}
                iconBg={FlowHubPalette.kpiIconBgAlt}
              />
              <DataRow
                label="Endereço"
                value={s.clienteBase?.endereco || '—'}
                icon={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                iconBg={FlowHubPalette.surfaceTint}
                isLast
              />
            </View>
          </View>

          <View style={styles.actions}>
            <FlowHubNavButton
              label="Gerenciar mesas e leituras"
              onPress={() => {
                if (s.clienteId != null) router.push(clienteMesasPath(s.clienteId));
              }}
              style={styles.ctaBtn}
            />
            <FlowHubAddButton
              variant="danger"
              label="Excluir cliente"
              leadingIcon="trash"
              showPlus={false}
              layout="fill"
              onPress={() => {
                setDeleteError(null);
                setDeleteVisible(true);
              }}
              accessibilityLabel="Excluir cliente"
              style={styles.ctaBtn}
            />
          </View>
        </ScrollView>
      </View>
      </ClientesScreenBackdrop>

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

function DataRow({
  label,
  value,
  icon,
  iconBg,
  isLast = false,
}: {
  label: string;
  value: string;
  icon: SymbolViewProps['name'];
  iconBg: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.dataRow, isLast && styles.dataRowLast]}>
      <View style={[styles.dataIconWrap, { backgroundColor: iconBg }]}>
        <SymbolView name={icon} size={18} tintColor={FlowHubColors.petroleum} />
      </View>
      <View style={styles.dataContent}>
        <ThemedText style={styles.dataLabel}>{label}</ThemedText>
        <ThemedText style={styles.dataValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
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
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    overflow: 'hidden',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: FlowHubPalette.borderSubtle,
  },
  dataRowLast: {
    borderBottomWidth: 0,
  },
  dataIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dataContent: { flex: 1, gap: 4, minWidth: 0 },
  dataLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: FlowHubColors.petroleum,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: FlowHubColors.navy,
  },
  actions: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  ctaBtn: { marginHorizontal: 0, marginTop: 0, marginBottom: 0 },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
});
