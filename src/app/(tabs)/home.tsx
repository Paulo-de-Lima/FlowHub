import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { HomeHeader } from '@/components/home/home-header';
import { HomeHeroCard } from '@/components/home/home-hero-card';
import { HomeKpiStrip } from '@/components/home/home-kpi-strip';
import { HOME_MOCK } from '@/components/home/home-mock';
import { HomePendenciasSection } from '@/components/home/home-pendencias-section';
import { HomeQuickActions } from '@/components/home/home-quick-actions';
import { formatCobrancaTitulo, formatIntervaloDias, formatProximaViagem, formatRepeticaoPrevista } from '@/components/cobrancas/cobrancas-utils';
import { getCurrentMonthLabel } from '@/components/home/home-utils';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { HomeLayout, Spacing } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';
import { getCobrancas, type Cobranca } from '@/services/api';

export default function HomeScreen() {
  const { nome } = useLocalSearchParams<{ nome?: string }>();
  const userName = nome?.trim() || 'Usuário';
  const firstName = userName.split(' ')[0];
  const monthLabel = getCurrentMonthLabel();
  const scrollPad = useTabBarScrollPadding();
  const { finance, kpis, pendingMaintenanceCount } = HOME_MOCK;

  const [nextBilling, setNextBilling] = useState<{
    id: number;
    region: string;
    subtitle: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      getCobrancas()
        .then((data) => {
          const proxima: Cobranca | undefined =
            data.proximaId != null
              ? data.cobrancas.find((c) => c.id === data.proximaId)
              : data.cobrancas[0];

          if (proxima) {
            setNextBilling({
              id: proxima.id,
              region: formatCobrancaTitulo(proxima.nome),
              subtitle: `${formatProximaViagem(proxima.proximaViagem, proxima.data_viagem)} · ${formatIntervaloDias(proxima.intervalo_dias)} · retorno ${formatRepeticaoPrevista(proxima.data_viagem, proxima.intervalo_dias)} · ${proxima.totalClientes} clientes`,
            });
          } else {
            setNextBilling(null);
          }
        })
        .catch(() => setNextBilling(null));
    }, []),
  );

  return (
    <FlowHubScreenBackdrop>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPad }]}
        showsVerticalScrollIndicator={false}>
        <HomeHeader
          firstName={firstName}
          monthLabel={monthLabel}
          nextBilling={
            nextBilling
              ? { region: nextBilling.region, subtitle: nextBilling.subtitle }
              : null
          }
          onCobrancaPress={() => {
            if (nextBilling) {
              router.push(`/cobrancas/${nextBilling.id}/clientes`);
            } else {
              router.push('/cobrancas');
            }
          }}
        />

        <View style={styles.heroWrap}>
          <HomeHeroCard
            profit={finance.profit}
            revenue={finance.revenue}
            expenses={finance.expenses}
            monthLabel={monthLabel}
            onPressFinanceiro={() => router.push('/financeiro')}
          />
        </View>

        <View style={styles.body}>
          <HomeKpiStrip
            clients={kpis.clients}
            billings={kpis.billings}
            criticalStock={kpis.criticalStock}
          />

          <HomeQuickActions />

          <HomePendenciasSection
            pendingMaintenanceCount={pendingMaintenanceCount}
            onPressMaintenance={() => {}}
          />
        </View>
      </ScrollView>
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {},
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    zIndex: 3,
    marginBottom: Spacing.four,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
});
