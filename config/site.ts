// config/site.ts
import type { ThemeConfig } from "./types";

export const themeConfig: ThemeConfig = {
  site: {
    title: "Viviane Barbin",
    slogan: "Couleurs d'Ailleurs",
    subtitle: "",
    description: "",
    author: "Viviane Barbin",
    url: "",
    base: "",
    startYear: "2026",
    faviconSvg: "",
    faviconPng96: "",
    faviconPng: "",
    faviconIco: "",
    webManifest: "",
    appleTouchIcon: "",
  },
  colors: {
    mode: "auto",
    light: {
      // Brand colors
      primary: "oklch(0.2489 0.0697 36.95)", // #3c1206
      primaryForeground: "oklch(0.9896 0.0186 96.86)", // #fffcee
      primaryMuted: "oklch(0.4249 0.0627 50.47)", // #6a442e
      secondary: "oklch(0.2636 0.0296 308.67)", // #292130
      secondaryForeground: "oklch(0.9896 0.0186 96.86)", // #fffcee
      secondaryMuted: "oklch(0.4571 0.0212 296.12)", // #585562
      accent: "oklch(0.9551 0.0778 96.53)", // #fff1b5
      accentForeground: "oklch(0.2489 0.0697 36.95)", // #3c1206
      link: "oklch(0.3772 0.0479 216.34)", // #204852

      // Content/Surfaces
      background: "oklch(0.9896 0.0186 96.86)", // #fffcee
      backgroundBright: "oklch(0.9309 0.036 51)", // #fde2d3
      foreground: "oklch(0.2489 0.0697 36.95)", // #3c1206
      card: "oklch(0.98 0.01 96.86)", // Light card
      cardForeground: "oklch(0.2489 0.0697 36.95)", // Card text
      muted: "oklch(0.95 0.02 96.86)", // Muted background
      mutedForeground: "oklch(0.45 0.04 36.95)", // Muted text
      border: "oklch(0.88 0.03 96.86)", // Border
    },
    dark: {
      // Brand colors
      primary: "oklch(0.2489 0.0697 36.95)", // Same as light
      primaryForeground: "oklch(0.9896 0.0186 96.86)", // Same as light
      primaryMuted: "oklch(0.35 0.05 40)",
      secondary: "oklch(0.85 0.02 300)",
      secondaryForeground: "oklch(0.15 0.02 300)",
      secondaryMuted: "oklch(0.75 0.01 295)",
      accent: "oklch(0.15 0.08 100)",
      accentForeground: "oklch(0.2489 0.0697 36.95)",
      link: "oklch(0.3772 0.0479 216.34)",

      // Content/Surfaces
      background: "oklch(0.08 0 0)",
      backgroundBright: "oklch(0.20 0 0)",
      foreground: "oklch(0.95 0 0)",
      card: "oklch(0.12 0 0)",
      cardForeground: "oklch(0.95 0 0)",
      muted: "oklch(0.40 0.01 0)",
      mutedForeground: "oklch(0.70 0.01 0)",
      border: "oklch(0.20 0.01 0)",
    },
  },
};

export const base =
  themeConfig.site.base === "/" ? "" : themeConfig.site.base.replace(/\/$/, "");
