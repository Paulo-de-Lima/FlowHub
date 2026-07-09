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
import { CobrancaBreadcrumb } from '@/components/cobrancas/CobrancaBreadcrumb';
import { CobrancaConfirmModal } from '@/components/cobrancas/CobrancaConfirmModal';
import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { MesaAccordion } from '@/components/cobrancas/MesaAccordion';
import { MesaAccordionSkeleton } from '@/components/cobrancas/MesaAccordionSkeleton';
import { MesasClienteHeader } from '@/components/cobrancas/MesasClienteHeader';
import { MesasClienteHeroCard } from '@/components/cobrancas/MesasClienteHeroCard';
import { MesasEmptyState } from '@/components/cobrancas/MesasEmptyState';
import { NovaLeituraModal } from '@/components/cobrancas/NovaLeituraModal';
import { NovaMesaModal } from '@/components/cobrancas/NovaMesaModal';
import { RegistroPagamentoModal } from '@/components/cobrancas/RegistroPagamentoModal';
import { COBRANCAS_LIST_PATH, parseRouteId } from '@/components/cobrancas/route-utils';
import { useClienteMesasScreen } from '@/components/cobrancas/use-cliente-mesas-screen';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, HomeLayout, Radius, Spacing } from '@/constants/theme';

export default function ClienteMesasScreen() {
  const { id, clienteId } = useLocalSearchParams<{ id: string; clienteId: string }>();
  const cobrancaId = parseRouteId(id);
  const s = useClienteMesasScreen(clienteId, id);

  useFocusEffect(useCallback(() => { s.loadData(); }, [s.loadData]));

  const listHeader = (
    <>
      <MesasClienteHeader
        cobrancaNome={s.cobrancaNome}
        nome={s.clienteNome}
        mesasCount={s.stats.mesasCount}
        onBack={() => {
          if (cobrancaId != null) {
            router.navigate(`/cobrancas/${cobrancaId}/clientes`);
          } else {
            router.navigate('/cobrancas');
          }
        }}
      />
      <CobrancaBreadcrumb
        segments={[
          { label: 'Cobranças', onPress: () => router.navigate(COBRANCAS_LIST_PATH) },
          {
            label: s.cobrancaNome || 'Viagem',
            onPress: cobrancaId != null ? () => router.navigate(`/cobrancas/${cobrancaId}/clientes`) : undefined,
          },
          { label: s.clienteNome || 'Cliente' },
        ]}
      />
      <View style={styles.heroWrap}>
        {s.loading && s.mesas.length === 0 ? (
          <View style={[styles.heroSkeleton, cardShadowSoft]} />
        ) : (
          <MesasClienteHeroCard
            totalDeve={s.stats.totalDeve}
            totalPago={s.stats.totalPago}
            mesasCount={s.stats.mesasCount}
            registrosPendentes={s.stats.registrosPendentes}
            cobrado={s.clienteCobrado}
            marcandoCobrado={s.marcandoCobrado}
            onMarcarCobrado={cobrancaId != null && !s.clienteCobrado ? s.openMarcarCobrado : undefined}
          />
        )}
      </View>
      <CobrancaAddBar label="Adicionar mesa" onPress={s.openNovaMesa} />
      {s.actionError ? (
        <Pressable style={styles.errorBanner} onPress={s.dismissActionError}>
          <ThemedText style={styles.errorBannerText}>{s.actionError}</ThemedText>
          <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} size={14} tintColor={FlowHubColors.white} />
        </Pressable>
      ) : null}
      {s.mesas.length > 0 ? (
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Mesas</ThemedText>
        </View>
      ) : null}
    </>
  );

  const listEmpty = s.loading && s.mesas.length === 0 ? (
    <View style={styles.skeletonList}>
      <MesaAccordionSkeleton />
      <MesaAccordionSkeleton />
    </View>
  ) : s.error ? (
    <View style={styles.centerState}>
      <ThemedText style={styles.errorText}>{s.error}</ThemedText>
      <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
        <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
      </Pressable>
    </View>
  ) : (
    <MesasEmptyState onAdd={s.openNovaMesa} />
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

        <FlatList
          data={s.error || (s.loading && s.mesas.length === 0) ? [] : s.mesas}
          keyExtractor={(item) => String(item.id)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
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
              <MesaAccordion
                mesa={item}
                expanded={s.expandedId === item.id}
                onToggle={() => s.toggleExpanded(item.id)}
                onNovaLeitura={() => s.openNovaLeitura(item)}
                onEditRegistro={(reg) => s.openEditLeitura(item, reg)}
                onRegistrarPagamento={s.openPagamentoModal}
                onDeleteRegistro={s.openDeleteRegistroConfirm}
                onDeleteMesa={() => s.openDeleteMesaConfirm(item)}
                onEditNumeracao={() => s.openEditMesa(item)}
              />
            </View>
          )}
        />

      </View>

      <NovaMesaModal
        visible={s.mesaModalVisible}
        saving={s.saving}
        error={s.formError}
        initialNumeracao={s.mesaEditNumeracao}
        initialValorFicha={s.mesaEditValorFicha}
        title={s.mesaEditMode ? 'Editar mesa' : 'Nova mesa'}
        onClose={s.closeMesaModal}
        onSave={s.handleSaveMesa}
      />

      <NovaLeituraModal
        visible={s.leituraModalVisible}
        saving={s.saving}
        error={s.formError}
        mesa={s.mesaAtiva}
        mode={s.leituraMode}
        registroEdit={s.registroEdit}
        onClose={s.closeLeituraModal}
        onSave={s.handleSaveLeitura}
      />

      <RegistroPagamentoModal
        visible={s.pagamentoModalVisible}
        saving={s.saving}
        error={s.formError}
        registro={s.pagamentoRegistro}
        onClose={s.closePagamentoModal}
        onSave={s.handleSavePagamento}
      />

      <CobrancaConfirmModal
        visible={s.confirmCobradoVisible}
        nome={s.clienteNome}
        totalDeve={s.stats.totalDeve}
        confirming={s.marcandoCobrado}
        error={s.confirmCobradoError}
        onClose={s.closeMarcarCobrado}
        onConfirm={s.handleMarcarCobrado}
      />

      <ConfirmDeleteModal
        visible={s.deleteVisible}
        title={s.deleteModalMeta?.title ?? 'Excluir'}
        message={s.deleteModalMeta?.message ?? 'Deseja excluir'}
        highlight={s.deleteModalMeta?.highlight}
        hint={s.deleteModalMeta?.hint}
        confirmDisabled={s.deleteModalMeta?.confirmDisabled}
        deleting={s.deleting}
        error={s.deleteError}
        onClose={s.closeDeleteConfirm}
        onConfirm={s.handleConfirmDelete}
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
  sectionHeader: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, paddingBottom: Spacing.two },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: FlowHubColors.darkGray, letterSpacing: 0.3 },
  listContent: {
    flexGrow: 1,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  skeletonList: { paddingHorizontal: Spacing.four, gap: Spacing.two, paddingTop: Spacing.two },
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
});
