import { Tabs } from 'expo-router';

import { BottomNavBar, type BottomNavBarProps } from '@/components/bottom-nav-bar';
import { FlowHubColors } from '@/constants/theme';

/** Telas com scroll dentro das tabs: use `useTabBarScrollPadding()` no paddingBottom. */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavBar {...(props as unknown as BottomNavBarProps)} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: FlowHubColors.lightGray },
      }}>
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="cobrancas" options={{ title: 'Cobranças' }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
      <Tabs.Screen name="financeiro" options={{ title: 'Financeiro' }} />
      <Tabs.Screen name="estoque" options={{ title: 'Estoque' }} />
      <Tabs.Screen name="manutencao" options={{ title: 'Manutenção' }} />
    </Tabs>
  );
}
