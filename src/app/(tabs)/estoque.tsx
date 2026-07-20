import { useCallback } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { ConfirmDeleteModal } from '@/components/cobrancas/ConfirmDeleteModal';
import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { EstoqueEmptyState } from '@/components/estoque/EstoqueEmptyState';
import { EstoqueHeader } from '@/components/estoque/EstoqueHeader';
import { EstoqueHeroCard } from '@/components/estoque/EstoqueHeroCard';
import { MaterialFormModal } from '@/components/estoque/MaterialFormModal';
import { MaterialListCard } from '@/components/estoque/MaterialListCard';
import { useEstoqueScreen } from '@/components/estoque/use-estoque-screen';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { ThemedText } from '@/components/themed-text';
import { FeatureColors, FlowHubColors, HomeLayout, Spacing } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';

export default function EstoqueScreen() {
  const { novo, compra } = useLocalSearchParams<{ novo?: string; compra?: string }>();
  const s = useEstoqueScreen();
  const scrollPad = useTabBarScrollPadding();
  const isWeb = Platform.OS === 'web';

  useFocusEffect(
    useCallback(() => {
      s.loadData();
      if (novo === '1' || novo === 'material' || compra === '1') {
        s.openCreate();
      }
    }, [s.loadData, s.openCreate, novo, compra]),
  );

  const listHeader = (
    <>
      <EstoqueHeader totalMateriais={s.stats.total} criticos={s.stats.criticos} />
      <View style={styles.heroWrap}>
        {s.loading && s.materiais.length === 0 ? (
          <View style={styles.heroSkeleton} />
        ) : (
          <EstoqueHeroCard
            total={s.stats.total}
            criticos={s.stats.criticos}
            baixos={s.stats.baixos}
            vazios={s.stats.vazios}
          />
        )}
      </View>
      {isWeb ? (
        <FlowHubAddButton
          variant="bar"
          label="Registrar material"
          layout="fill"
          onPress={s.openCreate}
          accessibilityLabel="Registrar material"
          style={styles.webBar}
        />
      ) : null}
    </>
  );

  const listEmpty =
    s.loading && s.materiais.length === 0 ? (
      <ThemedText style={styles.loadingText} themeColor="textSecondary">
        Carregando materiais...
      </ThemedText>
    ) : s.error ? (
      <View style={styles.centerState}>
        <ThemedText style={styles.errorText}>{s.error}</ThemedText>
        <Pressable style={styles.retryBtn} onPress={() => s.loadData()}>
          <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
        </Pressable>
      </View>
    ) : s.materiais.length === 0 ? (
      <EstoqueEmptyState onRegistrar={s.openCreate} />
    ) : null;

  return (
    <FlowHubScreenBackdrop>
      <View style={styles.screen}>
        <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

        <FlatList
          data={s.error || (s.loading && s.materiais.length === 0) ? [] : s.materiais}
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
              <MaterialListCard item={item} onPress={() => s.openEdit(item)} />
            </View>
          )}
        />

        {!isWeb ? (
          <FlowHubAddButton
            variant="fab"
            onPress={s.openCreate}
            accessibilityLabel="Registrar material"
            style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
          />
        ) : null}

        <MaterialFormModal
          visible={s.formVisible}
          mode={s.formMode}
          saving={s.saving}
          deleting={s.deleting}
          error={s.formError}
          materiais={s.materiais}
          initial={s.editItem}
          onClose={s.closeForm}
          onSave={s.handleSave}
          onDelete={s.formMode === 'edit' ? s.requestDelete : undefined}
        />

        <ConfirmDeleteModal
          visible={s.deleteVisible}
          title="Excluir material"
          message="Deseja excluir"
          highlight={s.editItem?.nome?.trim() || 'este material'}
          hint="Materiais com registros vinculados não podem ser excluídos."
          deleting={s.deleting}
          error={s.deleteError}
          onClose={s.closeDelete}
          onConfirm={s.handleConfirmDelete}
        />
      </View>
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  list: { flex: 1 },
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    zIndex: 3,
    marginBottom: Spacing.four,
  },
  heroSkeleton: {
    backgroundColor: FlowHubColors.white,
    borderRadius: 16,
    minHeight: 140,
  },
  webBar: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  listContent: {
    flexGrow: 1,
    gap: Spacing.two,
  },
  cardWrap: { paddingHorizontal: Spacing.four },
  loadingText: { textAlign: 'center', paddingVertical: Spacing.four },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  errorText: {
    color: FeatureColors.expense,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
  retryBtn: {
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: { color: FlowHubColors.navy, fontWeight: '700' },
});
