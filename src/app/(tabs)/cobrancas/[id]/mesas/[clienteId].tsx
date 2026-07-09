import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { cobrancaClientesPath, parseRouteId } from '@/components/cobrancas/route-utils';
import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { MesaAccordion } from '@/components/cobrancas/MesaAccordion';
import { MesasClienteHeader } from '@/components/cobrancas/MesasClienteHeader';
import { MesasClienteHeroCard } from '@/components/cobrancas/MesasClienteHeroCard';
import { MesasEmptyState } from '@/components/cobrancas/MesasEmptyState';
import { NovaLeituraModal } from '@/components/cobrancas/NovaLeituraModal';
import { NovaMesaModal } from '@/components/cobrancas/NovaMesaModal';
import { RegistroPagamentoModal } from '@/components/cobrancas/RegistroPagamentoModal';
import { useClienteMesasScreen } from '@/components/cobrancas/use-cliente-mesas-screen';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, HomeLayout, Radius, Spacing } from '@/constants/theme';

export default function ClienteMesasScreen() {
  const { id, clienteId } = useLocalSearchParams<{ id: string; clienteId: string }>();
  const cobrancaId = parseRouteId(id);
  const s = useClienteMesasScreen(clienteId);

  useFocusEffect(useCallback(() => { s.loadData(); }, [s.loadData]));

  const listHeader = (
    <>
      <MesasClienteHeader
        nome={s.clienteNome}
        mesasCount={s.stats.mesasCount}
        onBack={() => {
          if (cobrancaId != null) {
            router.navigate(cobrancaClientesPath(cobrancaId));
          } else {
            router.navigate('/cobrancas');
          }
        }}
      />
      <View style={styles.heroWrap}>
        {s.loading && s.mesas.length === 0 ? (
          <View style={[styles.heroSkeleton, cardShadowSoft]}>
            <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
          </View>
        ) : (
          <MesasClienteHeroCard
            totalDeve={s.stats.totalDeve}
            totalPago={s.stats.totalPago}
            mesasCount={s.stats.mesasCount}
            registrosPendentes={s.stats.registrosPendentes}
          />
        )}
      </View>
      {s.actionError ? (
        <Pressable style={styles.errorBanner} onPress={s.dismissActionError}>
          <ThemedText style={styles.errorBannerText}>{s.actionError}</ThemedText>
          <SymbolView
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={14}
            tintColor={FlowHubColors.white}
          />
        </Pressable>
      ) : null}
      {s.mesas.length > 0 ? (
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Mesas</ThemedText>
        </View>
      ) : null}
    </>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        {s.loading && s.mesas.length === 0 ? (
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
            data={s.mesas}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={listHeader}
            refreshControl={
              <RefreshControl
                refreshing={s.refreshing}
                onRefresh={() => s.loadData(true)}
                tintColor={FlowHubColors.turquoise}
              />
            }
            ListEmptyComponent={<MesasEmptyState onAdd={s.openNovaMesa} />}
            renderItem={({ item }) => (
              <View style={styles.cardWrap}>
                <MesaAccordion
                  mesa={item}
                  expanded={s.expandedId === item.id}
                  onToggle={() => s.toggleExpanded(item.id)}
                  onNovaLeitura={() => s.openNovaLeitura(item)}
                  onRegistrarPagamento={s.openPagamentoModal}
                  onDeleteRegistro={s.openDeleteRegistroConfirm}
                  onDeleteMesa={() => s.openDeleteMesaConfirm(item)}
                  onEditNumeracao={() => s.openEditMesa(item)}
                />
              </View>
            )}
          />
        )}

        <Pressable
          style={[styles.fab, cardShadowSoft]}
          onPress={s.openNovaMesa}
          accessibilityLabel="Nova mesa">
          <LinearGradient colors={[FlowHubColors.turquoise, '#0FB5B1']} style={styles.fabGradient}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={28}
              tintColor={FlowHubColors.white}
            />
          </LinearGradient>
        </Pressable>
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
  heroWrap: { marginTop: HomeLayout.heroOverlap, paddingHorizontal: Spacing.four, zIndex: 3 },
  heroSkeleton: { backgroundColor: FlowHubColors.white, borderRadius: Radius.xl, padding: Spacing.six, alignItems: 'center', minHeight: 140 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, marginHorizontal: Spacing.four, marginTop: Spacing.two, backgroundColor: FlowHubColors.petroleum, borderRadius: Radius.md, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  errorBannerText: { flex: 1, color: FlowHubColors.white, fontSize: 13, fontWeight: '600' },
  sectionHeader: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, paddingBottom: Spacing.two },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: FlowHubColors.darkGray, textTransform: 'uppercase', letterSpacing: 0.5 },
  listContent: { paddingBottom: 100, gap: Spacing.two },
  cardWrap: { paddingHorizontal: Spacing.four },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  errorText: { color: FlowHubColors.petroleum, textAlign: 'center', paddingHorizontal: Spacing.four },
  retryBtn: { backgroundColor: FlowHubColors.turquoise, borderRadius: Radius.md, paddingHorizontal: Spacing.four, paddingVertical: Spacing.two },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
  fab: { position: 'absolute', right: Spacing.four, bottom: Spacing.four, borderRadius: 28, overflow: 'hidden' },
  fabGradient: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
