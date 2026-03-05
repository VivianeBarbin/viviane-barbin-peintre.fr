// @ts-check

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import UnoCSS from "unocss/astro";

const sanityDataset = "production";

console.info(`[astro.config] Sanity dataset → "${sanityDataset}"`);

export default defineConfig({
  output: "server",

  experimental: { svgo: true },

  devToolbar: { enabled: false },

  integrations: [
    UnoCSS({ injectReset: true, configFile: "uno.config.ts" }),
    sanity({
      projectId: "x31r8s87",
      dataset: sanityDataset,
      useCdn: false,
      ...(import.meta.env.PROD ? { studioBasePath: "/admin" } : {}),
      apiVersion: "2026-01-13",
    }),
    react(),
    icon({ iconDir: "src/icons" }),
  ],

  adapter: cloudflare(),
});
