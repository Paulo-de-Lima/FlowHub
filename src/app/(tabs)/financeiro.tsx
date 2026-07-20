import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { clienteMesasPath } from '@/components/clientes/route-utils';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { FlowHubSearchField } from '@/components/ui/FlowHubSearchField';
import { FlowHubSectionHeader } from '@/components/ui/FlowHubSectionHeader';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  HomeLayout,
  Radius,
  Spacing,
} from '@/constants/theme';

import { FinanceiroEmptyState } from '@/components/financeiro/FinanceiroEmptyState';
import { FinanceiroFilterChips } from '@/components/financeiro/FinanceiroFilterChips';
import { FinanceiroHeader } from '@/components/financeiro/FinanceiroHeader';
import { FinanceiroHeroCard } from '@/components/financeiro/FinanceiroHeroCard';
import { FinanceiroKpiGrid } from '@/components/financeiro/FinanceiroKpiGrid';
import { FinanceiroTabs } from '@/components/financeiro/FinanceiroTabs';
import { LancamentoFormModal } from '@/components/financeiro/LancamentoFormModal';
import { LancamentoListCard } from '@/components/financeiro/LancamentoListCard';
import { PagamentoPendenteCard } from '@/components/financeiro/PagamentoPendenteCard';
import { RegistroDetailModal } from '@/components/financeiro/RegistroDetailModal';
import { useFinanceiroScreen } from '@/components/financeiro/use-financeiro-screen';
import type { LancamentoFinanceiro, PagamentoPendenteCliente } from '@/services/api';

export default function FinanceiroScreen() {
  const s = useFinanceiroScreen();
  const { novo } = useLocalSearchParams<{ novo?: string }>();
  const scrollPad = useTabBarScrollPadding();
  const isWeb = Platform.OS === 'web';

  useFocusEffect(
    useCallback(() => {
      s.loadData();
    }, [s.loadData]),
  );

  useEffect(() => {
    if (novo === 'receita' || novo === 'despesa') {
      s.openModal(novo);
      router.setParams({ novo: undefined });
    }
  }, [novo, s.openModal]);

  const receitas = s.resumo?.receitas ?? 0;
  const despesas = s.resumo?.despesas ?? 0;
  const saldo = s.resumo?.saldo ?? 0;
  const isHistorico = s.tab === 'historico';

  const listHeader = (
    <>
      <FinanceiroHeader mes={s.mes} />

      <View style={styles.heroWrap}>
        {s.loading && s.lancamentos.length === 0 && s.pendentesFiltrados.length === 0 ? (
          <View style={[styles.heroSkeleton, cardShadowSoft]}>
            <ActivityIndicator size="large" color={FlowHubColors.turquoise} />
          </View>
        ) : (
          <FinanceiroHeroCard mes={s.mes} receitas={receitas} despesas={despesas} saldo={saldo} />
        )}
      </View>

      <View style={styles.body}>
        {s.error ? (
          <View style={styles.inlineError}>
            <ThemedText style={styles.errorText}>{s.error}</ThemedText>
            <Pressable style={styles.retryButton} onPress={() => s.loadData()}>
              <ThemedText style={styles.retryButtonText}>Tentar novamente</ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <FinanceiroKpiGrid mes={s.mes} receitas={receitas} despesas={despesas} saldo={saldo} />

            <FinanceiroTabs
              tab={s.tab}
              historicoCount={s.lancamentos.length}
              pendentesCount={s.pendentesCount}
              onTabChange={s.setTab}
            />

            <FlowHubSearchField
              value={isHistorico ? s.busca : s.buscaPendentes}
              onChangeText={isHistorico ? s.setBusca : s.setBuscaPendentes}
              placeholder={
                isHistorico
                  ? 'Buscar por origem do registro...'
                  : 'Buscar cliente por nome ou telefone...'
              }
            />

            {isHistorico ? (
              <>
                <FinanceiroFilterChips
                  filtro={s.filtro}
                  counts={s.filterCounts}
                  onFiltroChange={s.setFiltro}
                />

                {s.lancamentos.length > 0 ? (
                  <FlowHubSectionHeader title="Histórico" count={s.filtrados.length} />
                ) : null}

                {isWeb ? (
                  <FlowHubAddButton
                    variant="bar"
                    label="Novo registro"
                    onPress={() => s.openModal()}
                    style={styles.webAddBar}
                  />
                ) : null}
              </>
            ) : (
              <>
                {s.pendentesFiltrados.length > 0 ? (
                  <FlowHubSectionHeader
                    title="Pagamentos pendentes"
                    count={s.pendentesFiltrados.length}
                  />
                ) : null}
              </>
            )}
          </>
        )}
      </View>
    </>
  );

  const historicoEmpty =
    !s.error && !s.loading && s.lancamentos.length === 0 ? (
      <FinanceiroEmptyState onAdd={() => s.openModal()} />
    ) : !s.error && !s.loading && s.filtrados.length === 0 && s.lancamentos.length > 0 ? (
      <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
        Nenhum registro encontrado.
      </ThemedText>
    ) : null;

  const pendentesEmpty =
    !s.error && !s.loading && s.pendentesFiltrados.length === 0 ? (
      <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
        {s.pendentesCount === 0
          ? 'Nenhum cliente com pagamento pendente.'
          : 'Nenhum cliente encontrado na busca.'}
      </ThemedText>
    ) : null;

  const listProps = {
    contentContainerStyle: [styles.listContent, { paddingBottom: scrollPad }],
    showsVerticalScrollIndicator: false as const,
    refreshControl: (
      <RefreshControl
        refreshing={s.refreshing}
        onRefresh={() => s.loadData(true)}
        tintColor={FlowHubColors.turquoise}
        colors={[FlowHubColors.turquoise]}
      />
    ),
    ListHeaderComponent: listHeader,
  };

  const showListLoader =
    s.error || (s.loading && (isHistorico ? s.lancamentos.length === 0 : s.pendentesCount === 0));

  const listData: Array<LancamentoFinanceiro | PagamentoPendenteCliente> = showListLoader
    ? []
    : isHistorico
      ? s.filtrados
      : s.pendentesFiltrados;

  return (
    <FlowHubScreenBackdrop>
      <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

      <FlatList<LancamentoFinanceiro | PagamentoPendenteCliente>
        {...listProps}
        data={listData}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={isHistorico ? historicoEmpty : pendentesEmpty}
        renderItem={({ item }) => {
          if (isHistorico) {
            const lancamento = item as LancamentoFinanceiro;
            return (
              <View style={styles.cardWrap}>
                <LancamentoListCard item={lancamento} onPress={() => s.openDetail(lancamento)} />
              </View>
            );
          }

          const pendente = item as PagamentoPendenteCliente;
          return (
            <View style={styles.cardWrap}>
              <PagamentoPendenteCard
                item={pendente}
                onPress={() => router.push(clienteMesasPath(pendente.id))}
              />
            </View>
          );
        }}
      />

      {isHistorico && !isWeb ? (
        <FlowHubAddButton
          variant="fab"
          onPress={() => s.openModal()}
          accessibilityLabel="Novo registro"
          style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
        />
      ) : null}

      <LancamentoFormModal
        visible={s.formVisible}
        mode={s.formMode}
        saving={s.saving}
        error={s.formError}
        initialTipo={s.modalTipo}
        editItem={s.editItem}
        onClose={s.closeModal}
        onSubmit={s.handleSave}
      />

      <RegistroDetailModal
        visible={s.detailVisible}
        item={s.detailItem}
        onClose={s.closeDetail}
        onEdit={s.detailItem && !s.detailItem.automatico ? s.openEditFromDetail : undefined}
        onDelete={s.detailItem && !s.detailItem.automatico ? s.requestDeleteFromDetail : undefined}
      />

      <ConfirmDeleteModal
        visible={s.deleteVisible}
        title="Excluir registro"
        message="Deseja excluir"
        highlight={s.detailItem?.origem ?? 'este registro'}
        hint="Esta ação não pode ser desfeita."
        deleting={s.deleting}
        error={s.deleteError}
        onClose={s.closeDelete}
        onConfirm={s.handleConfirmDelete}
      />
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
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
  webAddBar: { marginHorizontal: 0, marginTop: 0, marginBottom: Spacing.two },
  listContent: { flexGrow: 1 },
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
  filterEmpty: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
});
