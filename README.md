# viviane-barbin-peintre.fr

**Custom [Astro](https://astro.build/) site for [Viviane Barbin](https://viviane-barbin-peintre.fr), painter — deployed on Cloudflare Workers with an embedded Sanity Studio.**

The source code of this site is purpose-built (not a theme fork) and includes a headless CMS integration, a server-side contact form pipeline, PDF page generation, and a full custom component library.

---

### Visit the site

- [viviane-barbin-peintre.fr](https://viviane-barbin-peintre.fr)

---

### Features

- Full SSR via `@astrojs/cloudflare` (Cloudflare Workers)
- Content management via [Sanity](https://www.sanity.io/) (headless CMS) — embedded Studio at `/admin` in production
- [UnoCSS](https://unocss.dev/) utility-first styling with custom design tokens, typography shortcuts, and dark-mode support
- Fonts served via [Bunny Fonts](https://fonts.bunny.net/) (no Google Fonts, privacy-respecting)
- Contact form with [Formspark](https://formspark.io/) submission and [Botpoison](https://botpoison.com/) anti-spam verification
- PDF page pre-rendering via Puppeteer (book preview feature)
- Image gallery with [Splide](https://splidejs.com/) slider
- Accessible custom component library (Button, Nav, Footer, Gallery, Workshop, Book, Contact, 404…)
- Legal pages: Mentions légales, Politique de confidentialité
- Custom 404 page with viewport-fit layout
- Responsive layout, auto dark mode

---

### What have been done

- Custom Astro project configured for SSR (`output: "server"`) with the `@astrojs/cloudflare` adapter
- Wrangler configuration (`wrangler.jsonc`) for production and preview Cloudflare Worker deployments
- Sanity CMS integration (`@sanity/astro`) with embedded Studio mounted at `/admin` (production only); standalone Studio lives under `viviane-barbin-peintre-studio/`
- UnoCSS setup with `presetWind4`, `presetAttributify`, `presetWebFonts`, and a custom dark-mode theme preset
- Pre-build scripts (`tsx`): CSS variable generation and PDF page rendering via Puppeteer
- Custom config layer (`config/`) for site settings, contact data, navigation, and legals — all with Sanity CMS fallback/merge
- Shared spacing token exports in `src/utils/elementSizes.ts` consumed by components
- Full component library built from scratch under `src/components/`
- Contact form API endpoint (`src/pages/api/contact.ts`, Cloudflare Workers–compatible):
  - Botpoison server-side verification
  - Formspark JSON submission
  - RGPD-compliant explicit consent gate
- Legal pages: `/mentions-legales`, `/politique-confidentialite` — backed by `config/legals.ts`
- Navigation system with per-item `showInDesktopNav` flag (Accueil visible in footer and mobile nav only)
- Astro asset pipeline for all images (`src/assets/`) with `<Image>` component and srcset generation
- Favicon set: SVG, PNG 96×96, ICO, Apple Touch Icon, Web App Manifest

---

### Performance

Performance report: à préciser

---

### Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd viviane-barbin-peintre.fr
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables (copy and fill in values):

   ```bash
   cp .env.example .env
   ```

   | Variable                      | Scope               | Description          |
   | ----------------------------- | ------------------- | -------------------- |
   | `PUBLIC_BOTPOISON_PUBLIC_KEY` | Build-time + client | Botpoison public key |
   | `BOTPOISON_SECRET_KEY`        | Runtime server      | Botpoison secret key |
   | `PUBLIC_FORMSPARK_FORM_ID`    | Build-time + client | Formspark form ID    |

4. Start the development server:

   ```bash
   pnpm dev          # Astro dev server → http://localhost:4321
   ```

   To run the standalone Sanity Studio (separate terminal):

   ```bash
   cd viviane-barbin-peintre-studio && pnpm dev
   ```

5. Build and preview:

   ```bash
   pnpm build        # Production build (runs pre-build scripts first)
   pnpm preview      # Local preview of the built output
   ```

6. Lint and format:

   ```bash
   pnpm lint         # ESLint
   pnpm lint:fix     # ESLint with auto-fix
   pnpm format       # Prettier
   pnpm format:check # Prettier check (CI)
   ```

7. Deploy to Cloudflare Workers:

   ```bash
   pnpm deploy           # Build + deploy to production
   pnpm deploy:preview   # Build + deploy to preview environment
   ```

---

### Credits

#### Services

- **Sanity** — ©[Sanity.io](https://www.sanity.io/) — headless CMS
- **Formspark** — ©2018 [Formspark](https://formspark.io/) — form backend
- **Botpoison** — ©2021 [Botpoison](https://botpoison.com/) — anti-spam / bot protection
- **Cloudflare Workers** — ©[Cloudflare, Inc.](https://www.cloudflare.com/) — hosting and edge runtime
- **Bunny Fonts** — ©[BunnyCDN](https://fonts.bunny.net/) — privacy-respecting font delivery

#### Fonts

- **Yeseva One** — [Google Fonts / Bunny Fonts](https://fonts.bunny.net/family/yeseva-one) — SIL Open Font License
- **Nunito Sans** — ©[The Nunito Sans Project Authors](https://github.com/googlefonts/NunitoSans) — SIL Open Font License
- **JetBrains Mono** — ©[JetBrains](https://github.com/JetBrains/JetBrainsMono) — SIL Open Font License
- **Merriweather** — ©[The Merriweather Project Authors](https://github.com/SorkinType/Merriweather) — SIL Open Font License

#### Icons

- **Tabler Icons** — ©[Tabler](https://tabler.io/icons) — MIT License

---

**_Last update: 4th March 2026_**
