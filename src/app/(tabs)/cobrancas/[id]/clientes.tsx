import { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { CobrancaAddBar } from '@/components/cobrancas/CobrancaAddBar';
import { CobrancaAddClienteModal } from '@/components/cobrancas/CobrancaAddClienteModal';
import { CobrancaBreadcrumb } from '@/components/cobrancas/CobrancaBreadcrumb';
import { CobrancaClienteCard } from '@/components/cobrancas/CobrancaClienteCard';
import { CobrancaClienteCardSkeleton } from '@/components/cobrancas/CobrancaClienteCardSkeleton';
import { CobrancaClientesEmptyState } from '@/components/cobrancas/CobrancaClientesEmptyState';
import { CobrancaConfirmModal } from '@/components/cobrancas/CobrancaConfirmModal';
import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { CobrancaEditClienteModal } from '@/components/cobrancas/CobrancaEditClienteModal';
import { CobrancaViagemFilters } from '@/components/cobrancas/CobrancaViagemFilters';
import { CobrancaViagemHeader } from '@/components/cobrancas/CobrancaViagemHeader';
import { CobrancaViagemHeroCard } from '@/components/cobrancas/CobrancaViagemHeroCard';
import { CobrancaViagemKpiStrip } from '@/components/cobrancas/CobrancaViagemKpiStrip';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { COBRANCAS_LIST_PATH } from '@/components/cobrancas/route-utils';
import { useCobrancaClientesScreen } from '@/components/cobrancas/use-cobranca-clientes-screen';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  HomeLayout,
  Radius,
  Spacing,
} from '@/constants/theme';

export default function CobrancaClientesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useCobrancaClientesScreen(id);
  const scrollPad = useTabBarScrollPadding();

  useFocusEffect(useCallback(() => { s.loadData(); }, [s.loadData]));

  const listHeader = (
    <>
      <CobrancaViagemHeader
        nome={s.cobrancaNome}
        intervaloDias={s.intervaloDias}
        dataViagem={s.dataViagem}
        onBack={() => router.navigate(COBRANCAS_LIST_PATH)}
      />
      <CobrancaBreadcrumb
        segments={[
          { label: 'Cobranças', onPress: () => router.navigate(COBRANCAS_LIST_PATH) },
          { label: s.cobrancaNome || 'Viagem' },
        ]}
      />
      <View style={styles.heroWrap}>
        {s.loading && s.clientes.length === 0 ? (
          <View style={[styles.heroSkeleton, cardShadowSoft]} />
        ) : (
          <CobrancaViagemHeroCard
            aReceber={s.stats.totalDeve}
            cobradosMarcados={s.stats.cobradosCount}
            total={s.stats.total}
          />
        )}
      </View>
      <View style={styles.filtersBlock}>
        <CobrancaViagemKpiStrip
          pendentes={s.stats.pendentesCount}
          cobrados={s.stats.cobradosCount}
          totalDeve={s.stats.totalDeve}
        />
        <CobrancaViagemFilters
          filtro={s.filtro}
          busca={s.busca}
          counts={s.filterCounts}
          onFiltroChange={s.setFiltro}
          onBuscaChange={s.setBusca}
        />
      </View>
      <CobrancaAddBar label="Adicionar cliente" onPress={s.openAddModal} />
      {s.actionError ? (
        <Pressable style={styles.errorBanner} onPress={s.dismissActionError}>
          <ThemedText style={styles.errorBannerText}>{s.actionError}</ThemedText>
          <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} size={14} tintColor={FlowHubColors.white} />
        </Pressable>
      ) : null}
    </>
  );

  const listEmpty = s.loading && s.clientes.length === 0 ? (
    <View style={styles.skeletonList}>
      <CobrancaClienteCardSkeleton />
      <CobrancaClienteCardSkeleton />
      <CobrancaClienteCardSkeleton />
    </View>
  ) : s.error ? (
    <View style={styles.centerState}>
      <ThemedText style={styles.errorText}>{s.error}</ThemedText>
      <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
        <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
      </Pressable>
    </View>
  ) : s.clientes.length === 0 ? (
    <CobrancaClientesEmptyState onAdd={s.openAddModal} />
  ) : (
    <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
      Nenhum cliente neste filtro.
    </ThemedText>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

        <FlatList
          data={s.error || (s.loading && s.clientes.length === 0) ? [] : s.filtrados}
          keyExtractor={(item) => String(item.vinculoId)}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: scrollPad }]}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          refreshControl={
            <RefreshControl refreshing={s.refreshing} onRefresh={() => s.loadData(true)} tintColor={FlowHubColors.turquoise} />
          }
          renderItem={({ item }) => (
              <View style={styles.cardWrap}>
                <CobrancaClienteCard
                  variant="compact"
                  item={item}
                  onMarcarCobrado={() => s.openConfirm(item)}
                  onDesfazer={() => s.desfazerCobrado(item)}
                  onEditar={() => s.openEdit(item)}
                  onVerMesas={() => s.goToMesas(item.cliente.id)}
                />
              </View>
            )}
        />

      </View>

      <CobrancaConfirmModal
        visible={s.confirmVisible}
        nome={s.confirmItem?.cliente.nome?.trim() || 'Cliente'}
        totalDeve={s.confirmItem?.totalDeve ?? 0}
        confirming={s.confirming}
        error={s.confirmError}
        onClose={s.closeConfirm}
        onConfirm={s.handleConfirmRecebimento}
      />
      <CobrancaAddClienteModal
        visible={s.addVisible}
        saving={s.saving}
        error={s.formError}
        allClientes={s.allClientes}
        vinculadosIds={s.vinculadosIds}
        onClose={() => s.setAddVisible(false)}
        onVincular={s.handleVincular}
        onCriar={s.handleCriar}
      />
      <CobrancaEditClienteModal
        visible={s.editVisible}
        saving={s.saving}
        error={s.formError}
        initial={
          s.editItem
            ? {
                nome: s.editItem.cliente.nome ?? '',
                cpf: s.editItem.cliente.cpf ?? '',
                endereco: s.editItem.cliente.endereco ?? '',
                numero: s.editItem.cliente.numero != null ? String(s.editItem.cliente.numero) : '',
              }
            : null
        }
        onClose={() => s.setEditVisible(false)}
        onSave={s.handleEditSave}
        onDesvincular={s.requestDesvincular}
        onExcluir={s.requestExcluir}
      />
      <ConfirmDeleteModal
        visible={s.clienteActionVisible}
        title={s.clienteActionMeta?.title ?? 'Confirmar'}
        message={s.clienteActionMeta?.message ?? ''}
        highlight={s.clienteActionMeta?.highlight}
        hint={s.clienteActionMeta?.hint}
        confirmLabel={s.clienteActionMeta?.confirmLabel}
        deleting={s.clienteActionLoading}
        error={s.clienteActionError}
        onClose={s.closeClienteAction}
        onConfirm={s.handleConfirmClienteAction}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: FlowHubColors.lightGray },
  list: { flex: 1 },
  heroWrap: { marginTop: HomeLayout.heroOverlap, paddingHorizontal: Spacing.four, zIndex: 3 },
  heroSkeleton: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.six,
    minHeight: 140,
  },
  filtersBlock: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    backgroundColor: FlowHubColors.petroleum,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  errorBannerText: { flex: 1, color: FlowHubColors.white, fontSize: 13, fontWeight: '600' },
  listContent: {
    flexGrow: 1,
    gap: Spacing.two,
  },
  skeletonList: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  cardWrap: { paddingHorizontal: Spacing.four },
  centerState: { alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingVertical: Spacing.five },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
  filterEmpty: { textAlign: 'center', padding: Spacing.four, paddingHorizontal: Spacing.four },
});
