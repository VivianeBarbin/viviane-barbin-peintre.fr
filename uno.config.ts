// uno.config.ts
import type { Preset } from "unocss";
import {
  defineConfig,
  presetAttributify,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import presetTheme from "unocss-preset-theme";
import { themeConfig } from "./config/site.ts";

const { light, dark } = themeConfig.colors;

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}", "src/**/*.css"],
  },
  // Ensure presetWebFonts always emits --font-* CSS variable declarations
  // and the Bunny font import, even if no template directly uses these classes.
  // NavLink variant classes (used in JS object values, not scanned by UnoCSS analyzer)
  safelist: [
    "font-sans",
    "font-display",
    "font-serif",
    "font-mono",
    // NavLink header variant
    "px-3",
    "lg:px-4",
    "py-2",
    // NavLink footer variant
    "pr-4",
    "py-[0.25rem]",
    "lg:py-2",
    "lg:px-3",
    "text-sm",
    "underline",
    "underline-offset-4",
    // Shared underline classes
    "after:left-3.6",
    "after:bottom-1",
    "after:bg-primaryMuted/80",
  ],
  shortcuts: {
    // Typography shortcuts
    "heading-1":
      "text-[clamp(2.25rem,1.8793rem+1.6477vw,3.1563rem)] font-sans font-semibold leading-[1.17] text-foreground max-w-full",
    "heading-2":
      "text-[clamp(1.875rem,1.6534rem+0.9848vw,2.4414rem)] font-sans font-semibold leading-[1.25] text-foreground max-w-full",
    "heading-3":
      "text-[clamp(1.5625rem,1.3996rem+0.7235vw,1.9531rem)] font-sans font-semibold leading-[1.33] text-foreground max-w-full",
    "heading-home":
      "text-[clamp(1.5rem,3.5vw+0.5rem,3rem)] lg:text-[clamp(1.375rem,0.875rem+1.3vw,1.675rem)] font-display leading-[1.4] text-foreground",
  },
  presets: [
    presetWind4(),
    presetAttributify(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        display: {
          name: "Yeseva One",
          weights: [400],
        },
        sans: [
          {
            name: "Nunito Sans",
            weights: [400, 600, 700],
          },
          "sans-serif",
        ],
        mono: [
          {
            name: "JetBrains Mono",
            weights: [400, 700],
          },
          "monospace",
        ],
        serif: {
          name: "Merriweather",
          weights: [400, 700],
        },
      },
      inlineImports: true,
    }),
    presetTheme({
      theme: {
        dark: {
          colors: {
            ...dark,
          },
        },
      },
    }) as Preset<object>,
  ],
  theme: {
    colors: {
      ...light,
    },
  },
  transformers: [
    transformerVariantGroup(),
    transformerDirectives({
      applyVariable: ["--at-apply", "--uno-apply", "--un"],
    }),
  ],
});
