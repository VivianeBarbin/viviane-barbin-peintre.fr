/* config/types/theme.d.ts */
export interface ThemeConfig {
  site: {
    title: string;
    slogan: string;
    subtitle: string;
    description: string;
    author: string;
    url: string;
    base: string;
    startYear: string;
    faviconSvg: string;
    faviconPng96: string;
    faviconPng: string;
    faviconIco: string;
    webManifest: string;
    appleTouchIcon: string;
  };
  colors: {
    mode: "light" | "dark" | "auto";
    light: {
      primary: string;
      primaryForeground: string;
      primaryMuted: string;
      secondary: string;
      secondaryForeground: string;
      secondaryMuted: string;
      accent: string;
      accentForeground: string;
      link: string;
      background: string;
      backgroundAccent: string;
      foreground: string;
      card: string;
      cardForeground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      info: string;
      success: string;
      warning: string;
      danger: string;
    };
    dark: {
      primary: string;
      primaryForeground: string;
      primaryMuted: string;
      secondary: string;
      secondaryForeground: string;
      secondaryMuted: string;
      accent: string;
      accentForeground: string;
      link: string;
      background: string;
      backgroundAccent: string;
      foreground: string;
      card: string;
      cardForeground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      info: string;
      success: string;
      warning: string;
      danger: string;
    };
  };
}
