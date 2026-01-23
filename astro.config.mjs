// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import icon from "astro-icon";

export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
      configFile: "uno.config.ts",
    }),
    sanity({
      projectId: "x31r8s87",
      dataset: "local_dev",
      useCdn: false,
      studioBasePath: "/admin",
      apiVersion: "2026-01-13",
    }),
    react(),
    icon({
      iconDir: "src/icons"
    }),
  ],
});
