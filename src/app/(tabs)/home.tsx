import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HomeHeader } from '@/components/home/home-header';
import { HomeHeroCard } from '@/components/home/home-hero-card';
import { HomeKpiStrip } from '@/components/home/home-kpi-strip';
import { HOME_MOCK } from '@/components/home/home-mock';
import { HomePendenciasSection } from '@/components/home/home-pendencias-section';
import { HomeQuickActions } from '@/components/home/home-quick-actions';
import { getCurrentMonthLabel } from '@/components/home/home-utils';
import { FlowHubColors, HomeLayout, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { nome } = useLocalSearchParams<{ nome?: string }>();
  const userName = nome?.trim() || 'Usuário';
  const firstName = userName.split(' ')[0];
  const monthLabel = getCurrentMonthLabel();
  const { finance, kpis, nextBilling, pendingMaintenanceCount } = HOME_MOCK;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <HomeHeader
          firstName={firstName}
          monthLabel={monthLabel}
          nextBilling={nextBilling}
          onNotificationPress={() => {}}
          onCobrancaPress={() => router.push('/cobrancas')}
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
            onPressClients={() => router.push('/clientes')}
            onPressBillings={() => router.push('/cobrancas')}
            onPressStock={() => router.push('/estoque')}
          />

          <HomeQuickActions />

          <HomePendenciasSection
            pendingMaintenanceCount={pendingMaintenanceCount}
            onPressMaintenance={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.five,
  },
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    zIndex: 3,
  },
  body: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
});
