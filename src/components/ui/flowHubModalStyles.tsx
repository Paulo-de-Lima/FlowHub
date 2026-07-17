import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  modalWebCard,
  Radius,
} from '@/constants/theme';

/** Estilos compartilhados para modais bottom-sheet FlowHub. */
export const flowHubModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 46, 0.45)',
    justifyContent: 'flex-end',
  },
  overlayPress: { flex: 1, justifyContent: 'flex-end' },
  card: {
    backgroundColor: FlowHubPalette.surfaceElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '92%',
    overflow: 'hidden',
    ...modalWebCard,
    ...cardShadowSoft,
  },
  headerStrip: { height: 4 },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: FlowHubColors.navy,
    marginTop: 12,
  },
  inputFocused: {
    borderColor: FlowHubColors.turquoise,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#D8E0E8',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});

export function FlowHubModalHeaderStrip() {
  return (
    <LinearGradient colors={[...FlowHubPalette.gradientHeader]} style={flowHubModalStyles.headerStrip} />
  );
}
