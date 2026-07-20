import { useCallback } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { CobrancaAddBar } from '@/components/cobrancas/CobrancaAddBar';
import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { ClienteFormModal } from '@/components/clientes/ClienteFormModal';
import { ClienteListCard } from '@/components/clientes/ClienteListCard';
import { ClienteListCardSkeleton } from '@/components/clientes/ClienteListCardSkeleton';
import { ClientesEmptyState } from '@/components/clientes/ClientesEmptyState';
import { ClientesHeader } from '@/components/clientes/ClientesHeader';
import { ClientesHeroCard } from '@/components/clientes/ClientesHeroCard';
import { ClientesScreenBackdrop } from '@/components/clientes/ClientesScreenBackdrop';
import { ClientesSearchBar } from '@/components/clientes/ClientesSearchBar';
import { clienteDetailPath } from '@/components/clientes/route-utils';
import { useClientesScreen } from '@/components/clientes/use-clientes-screen';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  FlowHubColors,
  HomeLayout,
  Radius,
  Spacing,
} from '@/constants/theme';

export default function ClientesListScreen() {
  const s = useClientesScreen();
  const isWeb = Platform.OS === 'web';
  const scrollPad = useTabBarScrollPadding();

  useFocusEffect(
    useCallback(() => {
      s.loadData();
    }, [s.loadData]),
  );

  const listHeader = (
    <>
      <ClientesHeader totalClientes={s.stats.total} />
      <View style={styles.heroWrap}>
        {s.loading && s.clientes.length === 0 ? (
          <View style={styles.heroSkeleton} />
        ) : (
          <ClientesHeroCard
            total={s.stats.total}
            comDivida={s.stats.comDivida}
            totalReceber={s.stats.totalReceber}
          />
        )}
      </View>
      <View style={styles.filtersBlock}>
        <ClientesSearchBar
          busca={s.busca}
          filtro={s.filtro}
          options={s.filterOptions}
          onBuscaChange={s.setBusca}
          onFiltroToggle={s.toggleFiltro}
        />
      </View>
      {isWeb ? <CobrancaAddBar label="Novo cliente" onPress={s.openCreate} /> : null}
    </>
  );

  const listEmpty =
    s.loading && s.clientes.length === 0 ? (
      <View style={styles.skeletonList}>
        <ClienteListCardSkeleton />
        <ClienteListCardSkeleton />
        <ClienteListCardSkeleton />
      </View>
    ) : s.error ? (
      <View style={styles.centerState}>
        <ThemedText style={styles.errorText}>{s.error}</ThemedText>
        <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
          <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
        </Pressable>
      </View>
    ) : s.clientes.length === 0 ? (
      <ClientesEmptyState onAdd={s.openCreate} />
    ) : (
      <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
        Nenhum cliente neste filtro.
      </ThemedText>
    );

  return (
    <ClientesScreenBackdrop>
      <View style={styles.screen}>
      <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

      <FlatList
        data={s.error || (s.loading && s.clientes.length === 0) ? [] : s.filtrados}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: scrollPad }]}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        refreshControl={
          <RefreshControl
            refreshing={s.refreshing}
            onRefresh={() => s.loadData(true)}
            tintColor={FlowHubColors.turquoise}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ClienteListCard
              item={item}
              onPress={() => router.push(clienteDetailPath(item.id))}
            />
          </View>
        )}
      />

      {!isWeb ? (
        <FlowHubAddButton
          variant="fab"
          onPress={s.openCreate}
          accessibilityLabel="Novo cliente"
          style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
        />
      ) : null}

      <ClienteFormModal
        visible={s.formVisible}
        mode={s.formMode}
        saving={s.saving}
        error={s.formError}
        initial={
          s.editItem
            ? {
                nome: s.editItem.nome ?? '',
                cpf: s.editItem.cpf ?? '',
                endereco: s.editItem.endereco ?? '',
                numero: s.editItem.numero ?? '',
              }
            : null
        }
        onClose={s.closeForm}
        onSave={s.handleSave}
        onDelete={s.formMode === 'edit' ? s.requestDelete : undefined}
      />

      <ConfirmDeleteModal
        visible={s.deleteVisible}
        title="Excluir cliente"
        message="Deseja excluir"
        highlight={s.editItem?.nome?.trim() || 'este cliente'}
        hint="Mesas, leituras e vínculos com cobranças serão removidos."
        deleting={s.deleting}
        error={s.deleteError}
        onClose={s.closeDelete}
        onConfirm={s.handleConfirmDelete}
      />
      </View>
    </ClientesScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  list: { flex: 1 },
  heroWrap: { marginTop: HomeLayout.heroOverlap, paddingHorizontal: Spacing.four, zIndex: 3, marginBottom: Spacing.four },
  heroSkeleton: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    minHeight: 140,
  },
  filtersBlock: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  listContent: {
    flexGrow: 1,
    gap: Spacing.two,
  },
  skeletonList: { paddingHorizontal: Spacing.four, gap: Spacing.two, paddingTop: Spacing.two },
  cardWrap: { paddingHorizontal: Spacing.four },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
  filterEmpty: { textAlign: 'center', padding: Spacing.four },
});
