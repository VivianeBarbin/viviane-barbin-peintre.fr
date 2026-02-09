import { createClient } from "@sanity/client";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "../utils/sanityConfig";

/**
 * Minimal fetch helper for Sanity (SSR/build friendly).
 *
 * - Uses env vars when available (no hardcode of projectId/dataset).
 * - Falls back to `src/utils/sanityConfig.ts` (keeps the app working if env is missing).
 * - Memoizes the client + dedupes identical in-flight queries during a single SSR/build run.
 *
 * Notes:
 * - We intentionally set `useCdn: false` for SSR/build so published drafts / fresh content
 *   doesn't get stuck behind caching. (You can flip to true if you want faster + cached.)
 * - Token is optional: with a public dataset, no token is needed.
 *   With a private dataset, define SANITY_API_READ_TOKEN.
 */

type FetchParams = Record<string, unknown> | undefined;

const inFlight = new Map<string, Promise<unknown>>();

function readEnv(key: string): string | undefined {
  // In Astro SSR/build, `process.env` is available.
  // `import.meta.env` is also available but depends on Vite env parsing (KEY=VALUE).
  // We keep it defensive and do not assume a particular format.
  const fromProcess = typeof process !== "undefined" ? process.env?.[key] : undefined;
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const fromImportMeta = metaEnv?.[key];
  return fromProcess ?? fromImportMeta;
}

function resolveSanityConfig() {
  const projectId = readEnv("SANITY_PROJECT_ID") ?? SANITY_PROJECT_ID;
  const dataset = readEnv("SANITY_DATASET") ?? SANITY_DATASET;
  const apiVersion = readEnv("SANITY_API_VERSION") ?? SANITY_API_VERSION;

  // Optional: used for private datasets. Do not require it.
  const token = readEnv("SANITY_API_READ_TOKEN");

  return { projectId, dataset, apiVersion, token };
}

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (cachedClient) return cachedClient;

  const { projectId, dataset, apiVersion, token } = resolveSanityConfig();

  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token || undefined,
    // perspective is available in newer clients; leaving it undefined keeps compatibility
  });

  return cachedClient;
}

function stableStringify(value: unknown): string {
  if (!value || typeof value !== "object") return JSON.stringify(value);

  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

function buildCacheKey(query: string, params?: FetchParams) {
  return `${query}::${params ? stableStringify(params) : ""}`;
}

/**
 * Fetch helper with:
 * - Optional params
 * - In-flight dedupe by query+params
 * - Safe generic typing
 */
export async function fetchSanity<T>(query: string, params?: FetchParams): Promise<T | null> {
  const key = buildCacheKey(query, params);

  if (inFlight.has(key)) {
    return (await inFlight.get(key)!) as T | null;
  }

  const p = (async () => {
    const client = getSanityClient();

    // Satisfy @sanity/client overloads:
    // - If params are provided => call fetch(query, params)
    // - Else => call fetch(query)
    const result =
      params && Object.keys(params).length > 0
        ? await client.fetch<T>(query, params)
        : await client.fetch<T>(query);

    // Sanity fetch returns null sometimes; keep it as-is.
    return (result ?? null) as T | null;
  })();

  inFlight.set(key, p);

  try {
    return (await p) as T | null;
  } finally {
    // remove after resolution to avoid unbounded growth across long-lived processes
    inFlight.delete(key);
  }
}

/**
 * Dev-only logger helper: keep noise out of prod builds.
 */
export function devLog(...args: unknown[]) {
  const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env;
  const isProd = typeof metaEnv?.PROD === "boolean" ? metaEnv.PROD : false;

  if (!isProd) {
    console.info(...args);
  }
}
