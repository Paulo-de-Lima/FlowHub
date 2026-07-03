import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlowHubColors } from '@/constants/theme';

const SPLASH_DURATION_MS = 2500;

export default function SplashScreenRoute() {
  useEffect(() => {
    let isMounted = true;

    async function navigateToLogin() {
      await SplashScreen.hideAsync();
      await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION_MS));

      if (isMounted) {
        router.replace('/login');
      }
    }

    navigateToLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/FlowHub/LogoMarcaFBremovebg.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlowHubColors.lightGray,
    paddingHorizontal: 32,
  },
  logo: {
    width: 280,
    height: 120,
  },
});
