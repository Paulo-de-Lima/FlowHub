import { useCallback } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { FlowHubToast } from '@/components/cobrancas/FlowHubToast';
import { ManutencaoFormModal } from '@/components/manutencao/ManutencaoFormModal';
import { ManutencaoHeader } from '@/components/manutencao/ManutencaoHeader';
import { ManutencaoHeroCard } from '@/components/manutencao/ManutencaoHeroCard';
import { ManutencaoKpiGrid } from '@/components/manutencao/ManutencaoKpiGrid';
import { ManutencaoListCard } from '@/components/manutencao/ManutencaoListCard';
import { ManutencoesEmptyState } from '@/components/manutencao/ManutencoesEmptyState';
import { useManutencaoScreen } from '@/components/manutencao/use-manutencao-screen';
import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FeatureColors, HomeLayout, Spacing } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';

export default function ManutencaoScreen() {
  const { nova } = useLocalSearchParams<{ nova?: string }>();
  const s = useManutencaoScreen();
  const scrollPad = useTabBarScrollPadding();
  const isWeb = Platform.OS === 'web';

  useFocusEffect(
    useCallback(() => {
      s.loadData();
      if (nova === '1') {
        s.openCreate();
      }
    }, [s.loadData, s.openCreate, nova]),
  );

  return (
    <FlowHubScreenBackdrop>
      <View style={styles.screen}>
        <FlowHubToast message={s.successMessage} onDismiss={s.dismissSuccess} />

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: scrollPad }]}
          refreshControl={
            <RefreshControl
              refreshing={s.refreshing}
              onRefresh={() => s.loadData(true)}
              tintColor={FlowHubColors.turquoise}
            />
          }
          showsVerticalScrollIndicator={false}>
          <ManutencaoHeader totalMes={s.stats.totalMes} />
          <View style={styles.heroWrap}>
            <ManutencaoHeroCard
              totalMes={s.stats.totalMes}
              materiaisUsados={s.stats.materiaisUsadosMes}
            />
          </View>
          <View style={styles.body}>
            <ManutencaoKpiGrid stats={s.stats} />
            {isWeb ? (
              <FlowHubAddButton
                variant="bar"
                label="Nova manutenção"
                layout="fill"
                onPress={s.openCreate}
                style={styles.webBar}
              />
            ) : null}
            {s.loading && s.manutencoes.length === 0 ? (
              <ThemedText style={styles.loadingText} themeColor="textSecondary">
                Carregando manutenções...
              </ThemedText>
            ) : s.error ? (
              <ThemedText style={styles.errorText}>{s.error}</ThemedText>
            ) : s.manutencoes.length === 0 ? (
              <ManutencoesEmptyState onAdd={s.openCreate} />
            ) : (
              <View style={styles.list}>
                {s.manutencoes.map((item) => (
                  <ManutencaoListCard key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {!isWeb ? (
          <FlowHubAddButton
            variant="fab"
            onPress={s.openCreate}
            accessibilityLabel="Nova manutenção"
            style={{ position: 'absolute', right: Spacing.four, bottom: scrollPad }}
          />
        ) : null}

        <ManutencaoFormModal
          visible={s.formVisible}
          saving={s.saving}
          error={s.formError}
          clientes={s.clientes}
          materiais={s.materiais}
          onClose={s.closeForm}
          onSave={s.handleSave}
        />
      </View>
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {},
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    zIndex: 3,
    marginBottom: Spacing.four,
  },
  body: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  webBar: { marginHorizontal: 0 },
  list: { gap: Spacing.two },
  loadingText: { textAlign: 'center', paddingVertical: Spacing.four },
  errorText: { color: FeatureColors.expense, textAlign: 'center' },
});
