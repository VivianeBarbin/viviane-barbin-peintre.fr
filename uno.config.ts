// uno.config.ts
import {
  defineConfig,
  presetWind4,
  presetWebFonts,
  presetAttributify,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: { reset: true },
    }),
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
            italic: true,
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
      inlineImports: false,
      extendTheme: true,
    }),
  ],
  theme: {
    colors: {
      primary: "oklch(var(--color-primary))",
      primaryForeground: "oklch(var(--color-primary-foreground))",
      primaryMuted: "oklch(var(--color-primary-muted))",
      secondary: "oklch(var(--color-secondary))",
      secondaryForeground: "oklch(var(--color-secondary-foreground))",
      secondaryMuted: "oklch(var(--color-secondary-muted))",
      accent: "oklch(var(--color-accent))",
      accentForeground: "oklch(var(--color-accent-foreground))",
      link: "oklch(var(--color-link))",
    

      background: "oklch(var(--color-background))",
      backgroundBright: "oklch(var(--color-background-bright))",
      foreground: "oklch(var(--color-foreground))",
      card: "oklch(var(--color-card))",
      cardForeground: "oklch(var(--color-card-foreground))",
      muted: "oklch(var(--color-muted))",
      mutedForeground: "oklch(var(--color-muted-foreground))",
      border: "oklch(var(--color-border))",
    },
  },
});
