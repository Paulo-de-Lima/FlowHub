import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

type FlowHubCollapsiblePanelProps = {
  expanded: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Corpo expansível com animação de altura/opacidade — padrão FlowHub para accordions e dropdowns. */
export function FlowHubCollapsiblePanel({
  expanded,
  children,
  style,
}: FlowHubCollapsiblePanelProps) {
  if (!expanded) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(260).springify().damping(20).stiffness(180)}
      exiting={FadeOutUp.duration(180)}
      layout={LinearTransition.springify().damping(20)}
      style={style}>
      {children}
    </Animated.View>
  );
}
