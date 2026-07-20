import '@/global.css';

import { Platform } from 'react-native';

export const FlowHubColors = {
  navy: '#0B1F3A',
  turquoise: '#14C8C4',
  petroleum: '#1F4E6D',
  white: '#ffffff',
  lightGray: '#F4F7FA',
  darkGray: '#394A5A',
} as const;

/** Derivados harmoniosos da paleta FlowHub — usar com parcimônia. */
export const FlowHubPalette = {
  surfaceElevated: FlowHubColors.white,
  surfaceSunken: '#EEF2F6',
  borderSubtle: 'rgba(57, 74, 90, 0.12)',
  gradientHeader: [FlowHubColors.navy, FlowHubColors.petroleum] as const,
  expenseBg: '#FEF2F2',
  incomeBg: '#E8FAFA',
  whiteMuted: 'rgba(255, 255, 255, 0.75)',
  whiteSubtle: 'rgba(255, 255, 255, 0.12)',
  chartTurquoise: FlowHubColors.turquoise,
  chartPetroleum: FlowHubColors.petroleum,
  chartExpense: '#EF4444',
  surfaceTint: 'rgba(20, 200, 196, 0.08)',
  surfaceMuted: '#EEF2F6',
  actionPrimary: FlowHubColors.navy,
  actionPrimaryPressed: '#091528',
  kpiIconBg: 'rgba(20, 200, 196, 0.12)',
  kpiIconBgAlt: 'rgba(31, 78, 109, 0.12)',
  sectionDivider: 'rgba(57, 74, 90, 0.12)',
} as const;

export const ClientesTypography = {
  heroValue: { fontSize: 36, fontWeight: '800' as const, lineHeight: 42, letterSpacing: -0.5 },
  kpiValue: { fontSize: 22, fontWeight: '800' as const, lineHeight: 26 },
  kpiLabel: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
} as const;

export const QuickActionColors = {
  icon: FlowHubColors.petroleum,
  background: '#E0F9F8',
} as const;

export const FeatureColors = {
  client: '#3B82F6',
  clientBg: '#EFF6FF',
  income: '#0D9488',
  incomeBg: '#E8FAFA',
  expense: '#EF4444',
  expenseBg: '#FEF2F2',
  material: '#F59E0B',
  materialBg: '#FFFBEB',
  record: '#6366F1',
  recordBg: '#EEF2FF',
} as const;

export const cardShadow = Platform.select({
  web: {
    boxShadow: '0 4px 14px rgba(11, 31, 58, 0.1)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});

export const quickActionShadow = Platform.select({
  web: {
    boxShadow: '0 3px 10px rgba(11, 31, 58, 0.14)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
  },
});

export const cardShadowSoft = Platform.select({
  web: {
    boxShadow: '0 2px 8px rgba(11, 31, 58, 0.08)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});

export const fabShadow = Platform.select({
  web: {
    boxShadow: '0 6px 20px rgba(11, 31, 58, 0.22)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
});

export const Colors = {
  light: {
    text: FlowHubColors.navy,
    background: FlowHubColors.white,
    backgroundElement: FlowHubColors.lightGray,
    backgroundSelected: FlowHubColors.petroleum,
    textSecondary: FlowHubColors.darkGray,
    primary: FlowHubColors.navy,
    accent: FlowHubColors.turquoise,
    secondary: FlowHubColors.petroleum,
  },
  dark: {
    text: FlowHubColors.white,
    background: FlowHubColors.navy,
    backgroundElement: FlowHubColors.petroleum,
    backgroundSelected: '#2A6289',
    textSecondary: '#A8B4C0',
    primary: FlowHubColors.navy,
    accent: FlowHubColors.turquoise,
    secondary: FlowHubColors.petroleum,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const HomeLayout = {
  headerBottomRadius: 22,
  heroOverlap: -32,
} as const;

/** Tipografia e dimensões dos screen headers (gradiente). */
export const HeaderTypography = {
  rootTitle: { fontSize: 24, fontWeight: '800' as const, lineHeight: 30 },
  homeTitle: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  detailTitle: { fontSize: 21, fontWeight: '700' as const, lineHeight: 27 },
  subtitle: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  footer: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  breadcrumb: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
} as const;

export const HeaderTokens = {
  topRowMinHeight: 44,
  actionButtonSize: 44,
  contentMaxWidth: 800,
  bottomHairline: 'rgba(255, 255, 255, 0.08)',
} as const;

export const headerBottomShadow = Platform.select({
  web: {
    boxShadow: '0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(11, 31, 58, 0.06)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});

export const Typography = {
  heroValue: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 42,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
} as const;

export const SemanticColors = {
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#86EFAC',
  danger: '#DC2626',
  dangerBg: FeatureColors.expenseBg,
  borderSubtle: '#E8EDF2',
  surfaceCobrado: '#F0FDF4',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
} as const;

export const CobrancaTypography = {
  screenTitle: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  subtitle: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  kpi: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28 },
  eyebrow: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5 },
} as const;

/** Tab bar flutuante (pill glass) — tokens visuais e dimensões. */
export const TabBarTokens = {
  pillHeight: 60,
  floatingMargin: 12,
  maxWidth: 360,
  widthRatio: 0.82,
  activeCircleSize: 44,
  iconSize: 22,
  pillBg: 'rgba(11, 31, 58, 0.75)',
  pillBorder: 'rgba(255,255,255,0.1)',
  iconInactive: 'rgba(255,255,255,0.55)',
  iconActive: FlowHubColors.turquoise,
  activeCircle: FlowHubColors.petroleum,
} as const;

export const TAB_BAR_PILL_HEIGHT = TabBarTokens.pillHeight;
export const TAB_BAR_FLOATING_MARGIN = TabBarTokens.floatingMargin;
export const TabBarHeight = TAB_BAR_PILL_HEIGHT + TAB_BAR_FLOATING_MARGIN;

/** Margem inferior extra (legado). Prefira `getTabBarBottomOffset`. */
export const BottomTabInset = TAB_BAR_FLOATING_MARGIN;

/** Pill + margem flutuante + safe area — base para paddingBottom de listas e FABs. */
export function getTabBarBottomOffset(insetsBottom = 0): number {
  return TabBarHeight + Math.max(insetsBottom, 8);
}

export const tabBarFloatingShadow = Platform.select({
  web: {
    boxShadow: '0 8px 32px rgba(11, 31, 58, 0.35)',
  },
  default: {
    shadowColor: FlowHubColors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
});

export const MaxContentWidth = 800;

export const modalWebCard = Platform.select({
  web: {
    maxWidth: 480,
    width: '100%' as const,
    alignSelf: 'center' as const,
  },
  default: {},
});
