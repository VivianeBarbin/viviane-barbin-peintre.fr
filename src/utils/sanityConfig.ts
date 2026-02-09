/**
 * Shared (public) Sanity configuration.
 *
 * Keep ONLY non-secret values here (projectId, dataset, apiVersion).
 * Never put tokens or private keys in this file.
 *
 * These values are safe to import from both server and client code.
 *
 * ---------------------------------------------------------------------------
 * Dataset resolution (priority order):
 *   1. process.env.SANITY_DATASET        (build-time / SSR — set by dotenv-cli, CI, or shell)
 *   2. import.meta.env.SANITY_DATASET    (Vite .env files — only if process.env is unavailable)
 *   3. "local_dev"                        (safe default for local development)
 *
 * In production builds the env var MUST be set explicitly (see astro.config.mjs
 * for the build-time guard that prevents silent fallback to "local_dev").
 * ---------------------------------------------------------------------------
 */

function readEnv(key: string): string | undefined {
  // Prefer process.env (always available during SSR / build in Node).
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  // Fallback: Vite-style import.meta.env (populated from .env files with KEY=VALUE syntax).
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[key] || undefined;
}

export const SANITY_PROJECT_ID = "x31r8s87";

/**
 * Resolved dataset name.
 *
 * Reads from the environment so that production, preview, and local builds can
 * each target the correct Sanity dataset without code changes.
 *
 * Defaults to "local_dev" when no env var is provided (i.e. local `pnpm dev`).
 */
export const SANITY_DATASET: string = readEnv("SANITY_DATASET") ?? "local_dev";

/**
 * API version used for data queries (GROQ).
 * Keep this aligned with your `astro.config.mjs` sanity integration.
 */
export const SANITY_API_VERSION = "2026-01-13";

/**
 * Sanity CDN base for assets.
 * Useful if you need to build URLs or validate that an image URL is a Sanity asset.
 */
export const SANITY_ASSET_CDN_HOST = "cdn.sanity.io";

/**
 * Convenience object for libraries that accept a config object.
 */
export const SANITY_PUBLIC_CONFIG = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
} as const;
