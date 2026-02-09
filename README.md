# viviane-barbin-peintre.fr

Astro site for Viviane Barbin Peintre, deployed on Cloudflare Workers with embedded Sanity Studio.

## Environment Variables & Dataset Configuration

The Sanity **dataset** is configured via environment variables so that local development, production, and preview deployments each target the correct data without code changes.

### How dataset resolution works

| Layer                                                                       | Variable                | Exposed to                                  | Fallback                                       |
| --------------------------------------------------------------------------- | ----------------------- | ------------------------------------------- | ---------------------------------------------- |
| **Astro frontend** (`astro.config.mjs`, `sanityFetch.ts`, `sanityImage.ts`) | `SANITY_DATASET`        | Server / build only                         | `"local_dev"` in dev; **error** in prod builds |
| **Sanity Studio** (`sanity.config.ts`)                                      | `SANITY_STUDIO_DATASET` | Client bundle (Vite replaces at build time) | `"local_dev"`                                  |

> **Production safety:** if `SANITY_DATASET` is not set during a production build (`astro build` with `import.meta.env.PROD === true`), the build will **fail** with a clear error message. This prevents accidentally shipping a build that points at `local_dev`.

> **Public dataset:** This project uses a public Sanity dataset — no API read token is needed for content fetching.

### Per-environment settings

#### Local development

No env vars are required. Both the frontend and Studio default to `local_dev`.

```sh
# .env (optional — values shown are the defaults)
SANITY_DATASET=local_dev
SANITY_STUDIO_DATASET=local_dev
```

Run the dev server:

```sh
pnpm dev          # Astro dev (reads .env via dotenv-cli)
```

Run standalone Studio (separate terminal):

```sh
cd viviane-barbin-peintre-studio && pnpm dev
```

#### Production (Cloudflare Workers)

Set these **build-time** environment variables in your CI/CD pipeline or in the Cloudflare Dashboard under **Workers & Pages → Settings → Environment Variables (Production)**:

| Variable                | Value        | Notes                                         |
| ----------------------- | ------------ | --------------------------------------------- |
| `SANITY_DATASET`        | `production` | Used by Astro (frontend queries + image URLs) |
| `SANITY_STUDIO_DATASET` | `production` | Used by embedded Studio at `/admin`           |

Deploy:

```sh
pnpm deploy       # builds + wrangler deploy
```

#### Preview (Cloudflare)

Preview deploys use the `wrangler.jsonc` → `env.preview` config (`--env preview`). You **must** set env vars explicitly for preview to avoid accidentally targeting production:

| Variable                | Recommended value        | Notes                                             |
| ----------------------- | ------------------------ | ------------------------------------------------- |
| `SANITY_DATASET`        | `local_dev` or `staging` | Choose depending on what data you want to preview |
| `SANITY_STUDIO_DATASET` | _(same as above)_        | Keep in sync with `SANITY_DATASET`                |

Set these in the Cloudflare Dashboard under **Environment Variables (Preview)**, or in CI environment for the preview job.

Deploy preview:

```sh
pnpm deploy:preview   # builds + wrangler deploy --env preview
```

### Where to configure Cloudflare env vars

These are **build-time** variables (they are read when `astro build` runs, not at Worker runtime). Set them in one of:

1. **Cloudflare Dashboard** → Workers & Pages → your project → Settings → Variables and Secrets → select the environment (Production / Preview).
2. **CI/CD secrets** (e.g. GitHub Actions `env:` block) — the build step must have them in the shell environment.
3. **Local `.env.production`** file (gitignored) if you deploy from your machine.

### CORS origins for Sanity Studio

Make sure the following origins are allowed in [Sanity project CORS settings](https://www.sanity.io/manage/project/x31r8s87/api#cors):

| Origin                              | Environment                         |
| ----------------------------------- | ----------------------------------- |
| `http://localhost:4321`             | Local Astro dev (embedded Studio)   |
| `http://localhost:3333`             | Local standalone Studio             |
| `https://viviane-barbin-peintre.fr` | Production                          |
| `https://*.workers.dev`             | Preview (if using workers.dev URLs) |

### File reference

| File                                             | Role                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `astro.config.mjs`                               | Reads `SANITY_DATASET`; configures Sanity integration + embedded Studio                     |
| `sanity.config.ts`                               | Root Studio config (embedded); reads `SANITY_STUDIO_DATASET`                                |
| `viviane-barbin-peintre-studio/sanity.config.ts` | Standalone Studio config; reads `SANITY_STUDIO_DATASET`                                     |
| `src/utils/sanityConfig.ts`                      | Shared public config; exports resolved `SANITY_DATASET` for `sanityFetch` and `sanityImage` |
| `src/lib/sanityFetch.ts`                         | SSR fetch helper; reads `SANITY_DATASET` at runtime (with fallback to `sanityConfig.ts`)    |
| `env.example`                                    | Full annotated example of all env vars                                                      |

## Development

```sh
pnpm install
pnpm dev            # Astro dev server on http://localhost:4321
```

## Build & Deploy

```sh
pnpm build          # production build (requires SANITY_DATASET to be set)
pnpm deploy         # build + deploy to Cloudflare Workers (production)
pnpm deploy:preview # build + deploy to Cloudflare Workers (preview)
```
