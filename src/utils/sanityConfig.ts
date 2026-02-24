/**
 * Shared (public) Sanity configuration.
 *
 * Keep ONLY non-secret values here (projectId, dataset, apiVersion).
 * Never put tokens or private keys in this file.
 *
 * These values are safe to import from both server and client code.
 *
 * ---------------------------------------------------------------------------
 * Dataset configuration:
 *   Always uses "production" dataset
 * ---------------------------------------------------------------------------
 */

export const SANITY_PROJECT_ID = "x31r8s87";

/**
 * Resolved dataset name.
 *
 * Always uses the production dataset.
 */
export const SANITY_DATASET: string = "production";

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
