import { Stack } from 'expo-router';

import { FlowHubColors } from '@/constants/theme';

export default function ClientesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: FlowHubColors.lightGray },
      }}
    />
  );
}
