import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback } from 'react';

import { CobrancaAddClienteModal } from '@/components/cobrancas/CobrancaAddClienteModal';
import { CobrancaClienteCard } from '@/components/cobrancas/CobrancaClienteCard';
import { CobrancaClientesEmptyState } from '@/components/cobrancas/CobrancaClientesEmptyState';
import { CobrancaConfirmModal } from '@/components/cobrancas/CobrancaConfirmModal';
import { CobrancaEditClienteModal } from '@/components/cobrancas/CobrancaEditClienteModal';
import { CobrancaViagemFilters } from '@/components/cobrancas/CobrancaViagemFilters';
import { CobrancaViagemHeader } from '@/components/cobrancas/CobrancaViagemHeader';
import { CobrancaViagemHeroCard } from '@/components/cobrancas/CobrancaViagemHeroCard';
import { CobrancaViagemKpiStrip } from '@/components/cobrancas/CobrancaViagemKpiStrip';
import { COBRANCAS_LIST_PATH } from '@/components/cobrancas/route-utils';
import { useCobrancaClientesScreen } from '@/components/cobrancas/use-cobranca-clientes-screen';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, HomeLayout, Radius, Spacing } from '@/constants/theme';

export default function CobrancaClientesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useCobrancaClientesScreen(id);

  useFocusEffect(useCallback(() => { s.loadData(); }, [s.loadData]));

  const listHeader = (
    <>
      <CobrancaViagemHeader
        nome={s.cobrancaNome}
        intervaloDias={s.intervaloDias}
        dataViagem={s.dataViagem}
        onBack={() => router.navigate(COBRANCAS_LIST_PATH)}
      />
      <View style={styles.heroWrap}>
        {s.loading && s.clientes.length === 0 ? (
          <View style={[styles.heroSkeleton, cardShadowSoft]}>
            <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
          </View>
        ) : (
          <CobrancaViagemHeroCard
            aReceber={s.stats.totalDeve}
            cobradosMarcados={s.stats.cobradosCount}
            total={s.stats.total}
          />
        )}
      </View>
      <View style={styles.body}>
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
    </>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        {s.loading && s.clientes.length === 0 ? (
          <>
            {listHeader}
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
            </View>
          </>
        ) : s.error ? (
          <>
            {listHeader}
            <View style={styles.centerState}>
              <ThemedText style={styles.errorText}>{s.error}</ThemedText>
              <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
                <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <FlatList
            data={s.filtrados}
            keyExtractor={(item) => String(item.vinculoId)}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={listHeader}
            refreshControl={
              <RefreshControl refreshing={s.refreshing} onRefresh={() => s.loadData(true)} tintColor={FlowHubColors.turquoise} />
            }
            ListEmptyComponent={
              s.clientes.length === 0 ? (
                <CobrancaClientesEmptyState onAdd={s.openAddModal} />
              ) : (
                <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
                  Nenhum cliente neste filtro.
                </ThemedText>
              )
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrap}>
                <CobrancaClienteCard
                  item={item}
                  onMarcarCobrado={() => s.openConfirm(item)}
                  onDesfazer={() => s.desfazerCobrado(item)}
                  onEditar={() => s.openEdit(item)}
                  onVerMesas={() => s.goToMesas(item.cliente.id)}
                />
              </View>
            )}
          />
        )}

        <Pressable style={[styles.fab, cardShadowSoft]} onPress={s.openAddModal} accessibilityLabel="Adicionar cliente">
          <LinearGradient colors={[FlowHubColors.turquoise, '#0FB5B1']} style={styles.fabGradient}>
            <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} size={28} tintColor={FlowHubColors.white} />
          </LinearGradient>
        </Pressable>
      </View>

      <CobrancaConfirmModal
        visible={s.confirmVisible}
        nome={s.confirmItem?.cliente.nome?.trim() || 'Cliente'}
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
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: FlowHubColors.lightGray },
  heroWrap: { marginTop: HomeLayout.heroOverlap, paddingHorizontal: Spacing.four, zIndex: 3 },
  heroSkeleton: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.six,
    alignItems: 'center',
    minHeight: 140,
  },
  body: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.four },
  listContent: { paddingBottom: 100, gap: Spacing.two },
  cardWrap: { paddingHorizontal: Spacing.four },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
  filterEmpty: { textAlign: 'center', padding: Spacing.four, paddingHorizontal: Spacing.four },
  fab: { position: 'absolute', right: Spacing.four, bottom: Spacing.four, borderRadius: 28, overflow: 'hidden' },
  fabGradient: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
