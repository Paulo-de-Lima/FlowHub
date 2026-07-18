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

import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
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
import { LancamentoFormModal } from '@/components/financeiro/LancamentoFormModal';
import { LancamentoListCard } from '@/components/financeiro/LancamentoListCard';
import { useFinanceiroScreen } from '@/components/financeiro/use-financeiro-screen';

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

  const listHeader = (
    <>
      <FinanceiroHeader mes={s.mes} />

      <View style={styles.heroWrap}>
        {s.loading && s.lancamentos.length === 0 ? (
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

            <FinanceiroFilterChips
              filtro={s.filtro}
              counts={s.filterCounts}
              onFiltroChange={s.setFiltro}
            />

            {s.lancamentos.length > 0 ? (
              <FlowHubSectionHeader title="Lançamentos" count={s.filtrados.length} />
            ) : null}

            {isWeb ? (
              <FlowHubAddButton
                variant="bar"
                label="Novo lançamento"
                onPress={() => s.openModal()}
                style={styles.webAddBar}
              />
            ) : null}
          </>
        )}
      </View>
    </>
  );

  const listEmpty =
    !s.error && !s.loading && s.lancamentos.length === 0 ? (
      <FinanceiroEmptyState onAdd={() => s.openModal()} />
    ) : !s.error && !s.loading && s.filtrados.length === 0 && s.lancamentos.length > 0 ? (
      <ThemedText style={styles.filterEmpty} themeColor="textSecondary">
        Nenhum lançamento neste filtro.
      </ThemedText>
    ) : null;

  return (
    <FlowHubScreenBackdrop>
      <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

      <FlatList
        data={s.error || (s.loading && s.lancamentos.length === 0) ? [] : s.filtrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: scrollPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={s.refreshing}
            onRefresh={() => s.loadData(true)}
            tintColor={FlowHubColors.turquoise}
            colors={[FlowHubColors.turquoise]}
          />
        }
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <LancamentoListCard item={item} />
          </View>
        )}
      />

      {!isWeb ? (
        <FlowHubAddButton
          variant="fab"
          onPress={() => s.openModal()}
          accessibilityLabel="Novo lançamento"
          style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
        />
      ) : null}

      <LancamentoFormModal
        visible={s.modalVisible}
        saving={s.saving}
        error={s.formError}
        initialTipo={s.modalTipo}
        onClose={s.closeModal}
        onSubmit={s.handleSave}
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
