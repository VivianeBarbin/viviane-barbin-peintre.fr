// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// ---------------------------------------------------------------------------
// Dataset configuration
// ---------------------------------------------------------------------------
// Always use the production dataset
const sanityDataset = "production";

// Log which dataset the build is targeting.
// eslint-disable-next-line no-console
console.info(`[astro.config] Sanity dataset → "${sanityDataset}"`);

// ---------------------------------------------------------------------------
// Astro config
// ---------------------------------------------------------------------------
export default defineConfig({
  output: "server", // SSR mode: render pages on-demand, no static prerendering

  experimental: {
    svgo: true,
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [
    UnoCSS({
      injectReset: true,
      configFile: "uno.config.ts",
    }),
    sanity({
      projectId: "x31r8s87",
      dataset: sanityDataset,
      useCdn: false,
      // Only embed Studio in production to avoid dev memory leak.
      // In dev, run standalone studio: cd viviane-barbin-peintre-studio && pnpm dev
      ...(import.meta.env.PROD ? { studioBasePath: "/admin" } : {}),
      apiVersion: "2026-01-13",
    }),
    react(),
    icon({
      iconDir: "src/icons",
    }),
  ],

  adapter: cloudflare(),
});
