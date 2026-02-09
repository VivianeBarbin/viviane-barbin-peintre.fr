// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import icon from "astro-icon";

const isProd = import.meta.env.PROD;

// IMPORTANT: `import.meta.env` is populated by Vite-style `.env` files (KEY=VALUE).
// Your current `.env` uses shell syntax (`export KEY=VALUE`), which won't be picked up reliably.
// Reading from `process.env` makes the token available as long as your dev command loads the env
// (e.g. via your shell, direnv, dotenv-cli, etc).
const sanityReadToken = process.env.SANITY_API_READ_TOKEN ?? import.meta.env.SANITY_API_READ_TOKEN;

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
      dataset: "local_dev",
      useCdn: false,
      // Token for private dataset access
      // Create a Viewer token at https://www.sanity.io/manage/project/x31r8s87/api#tokens
      token: sanityReadToken,
      // Only embed Studio in production to avoid dev memory leak
      // In dev, run standalone studio: cd viviane-barbin-peintre-studio && pnpm dev
      ...(isProd ? { studioBasePath: "/admin" } : {}),
      apiVersion: "2026-01-13",
    }),
    react(),
    icon({
      iconDir: "src/icons",
    }),
  ],
});
