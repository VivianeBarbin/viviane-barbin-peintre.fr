import { createClient } from "@sanity/client";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "../utils/sanityConfig";

/**
 * Minimal fetch helper for Sanity (SSR/build friendly).
 *
 * - Uses constants from `src/utils/sanityConfig.ts`.
 * - Memoizes the client + dedupes identical in-flight queries during a single SSR/build run.
 *
 * Notes:
 * - We intentionally set `useCdn: false` for SSR/build so published drafts / fresh content
 *   doesn't get stuck behind caching. (You can flip to true if you want faster + cached.)
 * - The dataset is public, so no token is needed for read access.
 */

type FetchParams = Record<string, unknown> | undefined;

const inFlight = new Map<string, Promise<unknown>>();

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (cachedClient) return cachedClient;

  cachedClient = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
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
