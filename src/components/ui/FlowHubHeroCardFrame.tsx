import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { cardShadow, FlowHubColors, Radius } from '@/constants/theme';

type FlowHubHeroCardFrameProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Moldura branca para cards hero sobre o header — evita vazamento nos cantos arredondados. */
export function FlowHubHeroCardFrame({ children, style }: FlowHubHeroCardFrameProps) {
  return (
    <View style={[styles.frame, cardShadow, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: Radius.xl,
    backgroundColor: FlowHubColors.white,
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: FlowHubColors.white,
  },
});
