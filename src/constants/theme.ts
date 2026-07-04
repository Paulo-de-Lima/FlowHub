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
  maintenance: '#F97316',
  maintenanceBg: '#FFF7ED',
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

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
