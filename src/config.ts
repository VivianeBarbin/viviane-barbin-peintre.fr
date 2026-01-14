import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
  site: {
    title: 'Viviane Barbin Peintre',
    subtitle: '',
    description: '',
    author: '',
    url: '',
    base: '',
    faviconSvg: '',
    faviconPng96: '',
    faviconPng: '',
    faviconIco: '',
    webManifest: '',
    appleTouchIcon: '',
  },
  colors: {
    mode: 'auto',
    light: {
      // Brand colors
      primary: '0.2489 0.0697 36.95', // #3c1206
      primaryForeground: '0.9896 0.0186 96.86', // #fffcee
      primaryMuted: '0.4249 0.0627 50.47', // #6a442e
      secondary: '0.2636 0.0296 308.67', // #292130
      secondaryForeground: '0.9896 0.0186 96.86', // #fffcee
      secondaryMuted: '0.4571 0.0212 296.12', // #585562
      accent: '0.9551 0.0778 96.53', // #fff1b5
      accentForeground: '0.2489 0.0697 36.95', // #3c1206
      link: '0.3772 0.0479 216.34', // #204852
      
      // Content/Surfaces
      background: '0.9896 0.0186 96.86', // #fffcee
      backgroundBright: '0.9309 0.036 51', // #fde2d3
      foreground: '0.2489 0.0697 36.95', // #3c1206
      card: '',
      cardForeground: '',
      muted: '',
      mutedForeground: '',
      border: '',
    },
    dark: {
      // Brand colors
      primary: '',
      primaryForeground: '',
      primaryMuted: '',
      secondary: '',
      secondaryForeground: '',
      secondaryMuted: '',
      accent: '',
      accentForeground: '',
      link: '', // #204852
      // Content/Surfaces
      background: '',
      backgroundBright: '',
      foreground: '',
      card: '',
      cardForeground: '',
      muted: '',
      mutedForeground: '',
      border: '',
    }
  }
}

export const base = themeConfig.site.base === '/' ? '' : themeConfig.site.base.replace(/\/$/, '')
