// config/site.ts
import { devLog, fetchSanity } from "../src/lib/sanityFetch";
import { SITE_SETTINGS_QUERY } from "../src/lib/sanityQueries";
import type { ThemeConfig } from "./types";

export const themeConfig: ThemeConfig = {
  site: {
    title: "Viviane Barbin",
    slogan: "Couleurs d'ailleurs",
    subtitle: "Peinture &\nPartage d'atelier",
    description: "",
    author: "Viviane Barbin",
    url: "https://viviane-barbin-peintre.fr",
    base: "/",
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
      backgroundAccent: "oklch(0.4426 0.0788 126.34)",
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
      backgroundAccent: "oklch(0.20 0 0)",
      foreground: "oklch(0.95 0 0)",
      card: "oklch(0.12 0 0)",
      cardForeground: "oklch(0.95 0 0)",
      muted: "oklch(0.40 0.01 0)",
      mutedForeground: "oklch(0.70 0.01 0)",
      border: "oklch(0.20 0.01 0)",
    },
  },
};

type SiteSettingsProps = ThemeConfig["site"];
type SiteSettingsCms = Partial<SiteSettingsProps> | null;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeEscapedNewlines(value: string): string {
  // Converts literal "\n" into an actual newline.
  // Also supports Windows-style escaped newlines if they ever appear.
  return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
}

function resolveTextWithFallback(fallback: string, cmsValue: unknown): string {
  if (!isNonEmptyString(cmsValue)) return fallback;
  return normalizeEscapedNewlines(cmsValue.trim());
}

function normalizeBase(baseValue: string): string {
  // Preserve existing behavior:
  // - treat "/" as empty
  // - strip trailing slash
  return baseValue === "/" ? "" : baseValue.replace(/\/$/, "");
}

function mergeSiteSettingsFallback(
  fallback: SiteSettingsProps,
  cms: SiteSettingsCms
): SiteSettingsProps {
  if (!cms) return fallback;

  return {
    title: resolveTextWithFallback(fallback.title, cms.title),
    slogan: resolveTextWithFallback(fallback.slogan, cms.slogan),
    subtitle: resolveTextWithFallback(fallback.subtitle, cms.subtitle),
    description: resolveTextWithFallback(fallback.description, cms.description),
    author: resolveTextWithFallback(fallback.author, cms.author),
    url: resolveTextWithFallback(fallback.url, cms.url),
    base: resolveTextWithFallback(fallback.base, cms.base),
    startYear: resolveTextWithFallback(fallback.startYear, cms.startYear),

    faviconSvg: resolveTextWithFallback(fallback.faviconSvg, cms.faviconSvg),
    faviconPng96: resolveTextWithFallback(fallback.faviconPng96, cms.faviconPng96),
    faviconPng: resolveTextWithFallback(fallback.faviconPng, cms.faviconPng),
    faviconIco: resolveTextWithFallback(fallback.faviconIco, cms.faviconIco),
    webManifest: resolveTextWithFallback(fallback.webManifest, cms.webManifest),
    appleTouchIcon: resolveTextWithFallback(fallback.appleTouchIcon, cms.appleTouchIcon),
  };
}

let siteSettingsCache: SiteSettingsProps | null = null;

export async function getSiteSettings(): Promise<SiteSettingsProps> {
  if (siteSettingsCache) return siteSettingsCache;

  try {
    const cms = await fetchSanity<SiteSettingsCms>(SITE_SETTINGS_QUERY);

    const merged = mergeSiteSettingsFallback(themeConfig.site, cms);

    siteSettingsCache = {
      ...merged,
      base: normalizeBase(merged.base),
    };

    if (!cms) devLog("[siteSettings] Using TS fallback (document missing or empty).");

    return siteSettingsCache;
  } catch (err) {
    devLog("[siteSettings] Using TS fallback (Sanity fetch failed).", err);
    siteSettingsCache = {
      ...themeConfig.site,
      base: normalizeBase(themeConfig.site.base),
    };
    return siteSettingsCache;
  }
}

/**
 * Compatibility export:
 * - keeps existing import sites working (`import { base } from "@config/site"`)
 * - stays synchronous (based on TS fallback only)
 *
 * For SSR/build pages/components, prefer `await getSiteSettings()` and compute base from that.
 */
export const base = normalizeBase(themeConfig.site.base);
