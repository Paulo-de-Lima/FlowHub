import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';
import { FlowHubSectionHeader } from '@/components/ui/FlowHubSectionHeader';
import { router, useFocusEffect } from 'expo-router';

import { CobrancaCard } from '@/components/cobrancas/CobrancaCard';
import { CobrancaDashboard } from '@/components/cobrancas/CobrancaDashboard';
import { CobrancaDeleteModal } from '@/components/cobrancas/CobrancaDeleteModal';
import { CobrancaFormModal } from '@/components/cobrancas/CobrancaFormModal';
import { CobrancasHeader } from '@/components/cobrancas/CobrancasHeader';
import { CobrancasHeroCard } from '@/components/cobrancas/CobrancasHeroCard';
import { CobrancasKpiStrip } from '@/components/cobrancas/CobrancasKpiStrip';
import { getCurrentMonthLabel } from '@/components/home/home-utils';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  HomeLayout,
  Radius,
  Spacing,
} from '@/constants/theme';
import {
  createCobranca,
  deleteCobranca,
  getCobrancas,
  getCobrancasDashboard,
  updateCobranca,
  type Cobranca,
  type CobrancaInput,
  type CobrancasDashboard,
} from '@/services/api';

export default function CobrancasScreen() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [proximaId, setProximaId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<CobrancasDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCobranca, setEditingCobranca] = useState<Cobranca | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingCobranca, setDeletingCobranca] = useState<Cobranca | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [arrecadadoMes, setArrecadadoMes] = useState(0);
  const monthLabel = getCurrentMonthLabel();
  const scrollPad = useTabBarScrollPadding();
  const isWeb = Platform.OS === 'web';

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [lista, dash] = await Promise.all([getCobrancas(), getCobrancasDashboard()]);
      setCobrancas(lista.cobrancas);
      setProximaId(lista.proximaId);
      setArrecadadoMes(lista.arrecadadoMes ?? 0);
      setDashboard(dash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cobranças.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const proximaCobranca = useMemo(() => {
    if (proximaId == null) return cobrancas[0] ?? null;
    return cobrancas.find((c) => c.id === proximaId) ?? cobrancas[0] ?? null;
  }, [cobrancas, proximaId]);

  const kpis = useMemo(() => {
    const clientes = cobrancas.reduce((sum, c) => sum + c.totalClientes, 0);
    return { viagens: cobrancas.length, clientes };
  }, [cobrancas]);

  async function handleSubmit(data: CobrancaInput) {
    if (!data.nome) {
      setFormError('Informe o nome da cobrança.');
      return;
    }

    if (!Number.isInteger(data.intervalo_dias) || data.intervalo_dias < 1) {
      setFormError('Informe um intervalo válido (mínimo 1 dia).');
      return;
    }

    if (!data.data_viagem) {
      setFormError('Informe a data da próxima viagem (DD/MM/AAAA).');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingCobranca) {
        await updateCobranca(editingCobranca.id, data);
      } else {
        await createCobranca(data);
      }
      setModalVisible(false);
      setEditingCobranca(null);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar cobrança.');
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setFormError(null);
    setEditingCobranca(null);
    setModalVisible(true);
  }

  function openEditModal(cobranca: Cobranca) {
    setFormError(null);
    setEditingCobranca(cobranca);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingCobranca(null);
    setFormError(null);
  }

  function openDeleteModal(cobranca: Cobranca) {
    setDeleteError(null);
    setDeletingCobranca(cobranca);
    setDeleteModalVisible(true);
  }

  function closeDeleteModal() {
    if (deleting) return;
    setDeleteModalVisible(false);
    setDeletingCobranca(null);
    setDeleteError(null);
  }

  async function handleDeleteConfirm() {
    if (!deletingCobranca) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteCobranca(deletingCobranca.id);
      setDeleteModalVisible(false);
      setDeletingCobranca(null);
      await loadData(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir cobrança.');
    } finally {
      setDeleting(false);
    }
  }

  function renderListHeader() {
    return (
      <>
        <CobrancasHeader totalViagens={cobrancas.length} />

        <View style={styles.heroWrap}>
          {loading && cobrancas.length === 0 ? (
            <View style={[styles.heroSkeleton, cardShadowSoft]}>
              <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
            </View>
          ) : (
            <CobrancasHeroCard
              proxima={proximaCobranca}
              onIniciar={() => {
                if (proximaCobranca) {
                  router.push(`/cobrancas/${proximaCobranca.id}/clientes`);
                }
              }}
              onCriar={openCreateModal}
            />
          )}
        </View>

        <View style={styles.body}>
          {error ? (
            <View style={styles.inlineError}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <Pressable style={styles.retryButton} onPress={() => loadData()}>
                <ThemedText style={styles.retryButtonText}>Tentar novamente</ThemedText>
              </Pressable>
            </View>
          ) : (
            <>
              <CobrancasKpiStrip
                viagens={kpis.viagens}
                clientes={kpis.clientes}
                arrecadadoMes={arrecadadoMes}
                monthLabel={monthLabel}
              />

              <CobrancaDashboard data={dashboard} loading={loading && !dashboard} defaultExpanded />

              {cobrancas.length > 0 ? (
                <FlowHubSectionHeader title="Suas rotas" count={cobrancas.length} />
              ) : null}

              {isWeb ? (
                <FlowHubAddButton
                  variant="bar"
                  label="Nova cobrança"
                  onPress={openCreateModal}
                  style={styles.webAddBar}
                />
              ) : null}
            </>
          )}
        </View>
      </>
    );
  }

  return (
    <FlowHubScreenBackdrop>
      <FlatList
        data={loading || error ? [] : cobrancas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: scrollPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={FlowHubColors.turquoise}
            colors={[FlowHubColors.turquoise]}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          !loading && !error ? (
            <FlowHubEmptyState
              icon={{ ios: 'map.fill', android: 'map', web: 'map' }}
              title="Nenhuma viagem ainda"
              description="Planeje sua primeira rota de cobrança e acompanhe tudo por aqui."
              actionLabel="Planejar primeira viagem"
              onAction={openCreateModal}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <CobrancaCard
              cobranca={item}
              destacada={item.id === proximaId}
              onIniciar={() => router.push(`/cobrancas/${item.id}/clientes`)}
              onEdit={() => openEditModal(item)}
              onDelete={() => openDeleteModal(item)}
            />
          </View>
        )}
      />

      {!isWeb ? (
        <FlowHubAddButton
          variant="fab"
          onPress={openCreateModal}
          accessibilityLabel="Nova cobrança"
          style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
        />
      ) : null}

      <CobrancaFormModal
        visible={modalVisible}
        saving={saving}
        error={formError}
        cobranca={editingCobranca}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <CobrancaDeleteModal
        visible={deleteModalVisible}
        cobranca={deletingCobranca}
        deleting={deleting}
        error={deleteError}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    zIndex: 3,
    marginBottom: Spacing.four,
  },
  heroSkeleton: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  webAddBar: { marginHorizontal: 0, marginTop: Spacing.four, marginBottom: Spacing.four },
  listContent: {
    flexGrow: 1,
  },
  cardWrap: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  inlineError: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
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
});
