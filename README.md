# viviane-barbin-peintre.fr

# viviane-barbin-peintre.fr

Astro site for Viviane Barbin Peintre, deployed on Cloudflare Workers with embedded Sanity Studio.

## Environment Variables & Dataset Configuration

This project is configured to **always use the `production` dataset** for all environments (local development, production, and preview deployments).

### Dataset configuration

| Layer                                                                       | Variable                | Value        | Notes                            |
| --------------------------------------------------------------------------- | ----------------------- | ------------ | -------------------------------- |
| **Astro frontend** (`astro.config.mjs`, `sanityFetch.ts`, `sanityImage.ts`) | `SANITY_DATASET`        | `production` | Hardcoded in configuration files |
| **Sanity Studio** (`sanity.config.ts`)                                      | `SANITY_STUDIO_DATASET` | `production` | Hardcoded in configuration files |

> **Public dataset:** This project uses a public Sanity dataset — no API read token is needed for content fetching.

### Per-environment settings

#### Local development

No environment variables are required. The dataset is hardcoded to `production` in all configuration files.

```sh
# .env (optional — no dataset configuration needed)
# Dataset is always "production"
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

No dataset environment variables are required. The dataset is hardcoded to `production` in all configuration files.

Deploy:

```sh
pnpm deploy       # builds + wrangler deploy
```

#### Preview (Cloudflare)

Preview deploys use the `wrangler.jsonc` → `env.preview` config (`--env preview`). The dataset is hardcoded to `production` for all environments.

Deploy preview:

```sh
pnpm deploy:preview   # builds + wrangler deploy --env preview
```

### Where to configure Cloudflare env vars (if needed for other purposes)

Other **build-time** variables (not dataset-related) can be set in one of:

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
