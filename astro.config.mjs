// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// ---------------------------------------------------------------------------
// Environment detection
// ---------------------------------------------------------------------------
// `import.meta.env.PROD` is true when running `astro build` (regardless of
// where the build happens). It is false during `astro dev`.
const isProd = import.meta.env.PROD;

// ---------------------------------------------------------------------------
// Dataset resolution (build-time)
// ---------------------------------------------------------------------------
// Priority:
//   1. Explicit env var  → process.env.SANITY_DATASET
//   2. Vite .env file    → import.meta.env.SANITY_DATASET  (only if defined)
//   3. Local-dev default → "local_dev"  (ONLY when isProd is false)
//
// In production builds (isProd === true) the env var MUST be set explicitly.
// This prevents accidentally shipping a build that points at the wrong dataset.
// ---------------------------------------------------------------------------
const explicitDataset =
  process.env.SANITY_DATASET ||
  /** @type {string | undefined} */ (import.meta.env.SANITY_DATASET) ||
  undefined;

/** @type {string} */
let sanityDataset;

if (explicitDataset) {
  // An explicit env var was provided – use it in every environment.
  sanityDataset = explicitDataset;
} else if (isProd) {
  // Production build WITHOUT an explicit dataset → hard error.
  throw new Error(
    [
      "[astro.config] SANITY_DATASET is not set but this is a production build.",
      "Set SANITY_DATASET=production (or your prod dataset name) in your build",
      "environment / CI secrets / .env.production to avoid accidentally using",
      "the local_dev dataset in production.",
    ].join("\n")
  );
} else {
  // Local development – safe to default to the dev dataset.
  sanityDataset = "local_dev";
}

// Log which dataset the build is targeting.
// eslint-disable-next-line no-console
console.info(`[astro.config] Sanity dataset → "${sanityDataset}" (isProd=${isProd})`);

// ---------------------------------------------------------------------------
// Astro config
// ---------------------------------------------------------------------------
export default defineConfig({
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
      ...(isProd ? { studioBasePath: "/admin" } : {}),
      apiVersion: "2026-01-13",
    }),
    react(),
    icon({
      iconDir: "src/icons",
    }),
  ],

  adapter: cloudflare(),
});
