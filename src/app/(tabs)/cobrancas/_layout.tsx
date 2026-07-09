import { Stack } from 'expo-router';

import { FlowHubColors } from '@/constants/theme';

export default function CobrancasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: FlowHubColors.lightGray },
        headerTintColor: FlowHubColors.navy,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: FlowHubColors.lightGray },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Cobranças' }} />
      <Stack.Screen name="[id]/clientes" options={{ headerShown: false }} />
      <Stack.Screen name="[id]/mesas/[clienteId]" options={{ headerShown: false }} />
    </Stack>
  );
}
