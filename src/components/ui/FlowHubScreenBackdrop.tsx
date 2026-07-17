import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlowHubColors } from '@/constants/theme';

type FlowHubScreenBackdropProps = {
  children: ReactNode;
};

/** Fundo flat padrão FlowHub — sem gradiente nem mesh. */
export function FlowHubScreenBackdrop({ children }: FlowHubScreenBackdropProps) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FlowHubColors.lightGray },
});
