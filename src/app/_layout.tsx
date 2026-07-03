import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { FlowHubColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: FlowHubColors.lightGray },
          animation: 'fade',
        }}
      />
    </>
  );
}
