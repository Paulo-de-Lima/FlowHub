import { Image, Platform } from 'react-native';

const LOGO_SOURCE = require('@/assets/images/FlowHub/LogoIconBWTrimmed.png');

/** Dimensões reais do ícone recortado (155×158). */
const LOGO_FALLBACK_ASPECT_RATIO = 155 / 158;

function resolveLogoAspectRatio(source: number): number {
  if (Platform.OS === 'web') {
    return LOGO_FALLBACK_ASPECT_RATIO;
  }

  try {
    if (typeof Image.resolveAssetSource === 'function') {
      const asset = Image.resolveAssetSource(source);
      if (asset?.width && asset?.height) {
        return asset.width / asset.height;
      }
    }
  } catch {
    // SSR ou ambiente sem suporte a resolveAssetSource
  }

  return LOGO_FALLBACK_ASPECT_RATIO;
}

export const LOGO_ASPECT_RATIO = resolveLogoAspectRatio(LOGO_SOURCE);

export const HEADER_LOGO_HEIGHT = 40;

export function getLogoDimensions(height = HEADER_LOGO_HEIGHT) {
  return {
    height,
    width: Math.round(height * LOGO_ASPECT_RATIO),
  };
}

export { LOGO_SOURCE };

export function getFormattedDate() {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getCurrentMonthLabel() {
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
