// config/galleryMediums.ts

import { devLog, fetchSanity } from "../src/lib/sanityFetch"
import { GALLERY_SETTINGS_QUERY } from "../src/lib/sanityQueries"

/**
 * Single source of truth for gallery medium values.
 *
 * Imported by:
 * - Sanity Studio  (`../../../config/galleryMediums`)  → `options.list` in `galleriesContent`
 * - Front-end      (`@config/galleryMediums`)          → TypeScript types + label helpers
 *
 * Rule: to add/remove a medium, edit THIS file only.
 */
export const GALLERY_MEDIUMS = [
  { title: "Pastel",          value: "PASTEL"          },
  { title: "Aquarelle",       value: "AQUARELLE"       },
  { title: "Huile sur toile", value: "HUILE_SUR_TOILE" },
  { title: "Huile sur bois",  value: "HUILE_SUR_BOIS"  },
  { title: "Acrylique",       value: "ACRYLIQUE"       },
  { title: "Encre",           value: "ENCRE"           },
  { title: "Fusain",          value: "FUSAIN"          },
  { title: "Crayon",          value: "CRAYON"          },
  { title: "Technique mixte", value: "TECHNIQUE_MIXTE" },
  { title: "Autre",           value: "AUTRE"           },
] as const

// ── Derived types ─────────────────────────────────────────────────────

/** Union of all valid medium values — derived automatically, never hand-written. */
export type GalleryMedium = (typeof GALLERY_MEDIUMS)[number]["value"]

// ── Static fallback labels ────────────────────────────────────────────

/**
 * Hardcoded fallback label map.
 *
 * Used when:
 * - Sanity fetch fails or returns no data
 * - The `gallerySettings` singleton has no `mediumLabels` entries
 * - Components need a synchronous label map without a prior async fetch
 *
 * @example
 *   DEFAULT_MEDIUM_LABELS["PASTEL"]          // → "Pastel"
 *   DEFAULT_MEDIUM_LABELS["TECHNIQUE_MIXTE"] // → "Technique mixte"
 */
export const DEFAULT_MEDIUM_LABELS: Record<GalleryMedium, string> =
  Object.fromEntries(
    GALLERY_MEDIUMS.map((m) => [m.value, m.title])
  ) as Record<GalleryMedium, string>

// ── Dynamic Sanity-backed labels ──────────────────────────────────────

type MediumLabelEntry = { value: string; label: string }

let cachedMediumLabels: Record<GalleryMedium, string> | null = null

/**
 * Async getter (SSR / build time):
 *
 * 1. Fetches the `gallerySettings` singleton from Sanity.
 * 2. Merges its `mediumLabels` array over `DEFAULT_MEDIUM_LABELS`
 *    (only explicitly listed values are overridden; others keep the default).
 * 3. Memoised per process — a single Sanity round-trip per build/render.
 *
 * Fallback: returns `DEFAULT_MEDIUM_LABELS` untouched when the document
 * is absent, empty, or the fetch fails.
 *
 * @example
 *   const labels = await getMediumLabels()
 *   labels["PASTEL"] // "Pastel" (or custom label if set in Studio)
 */
export async function getMediumLabels(): Promise<Record<GalleryMedium, string>> {
  if (cachedMediumLabels) return cachedMediumLabels

  try {
    const data = await fetchSanity<{ mediumLabels: MediumLabelEntry[] }>(
      GALLERY_SETTINGS_QUERY
    )

    if (!data?.mediumLabels?.length) {
      devLog("[galleryMediums] Using fallback labels (no gallerySettings document found).")
      cachedMediumLabels = DEFAULT_MEDIUM_LABELS
      return cachedMediumLabels
    }

    const custom = Object.fromEntries(
      data.mediumLabels
        .filter((m) => m.value?.trim() && m.label?.trim())
        .map((m) => [m.value, m.label])
    )

    cachedMediumLabels = {
      ...DEFAULT_MEDIUM_LABELS,
      ...custom,
    } as Record<GalleryMedium, string>

    return cachedMediumLabels
  } catch (err) {
    devLog("[galleryMediums] Using fallback labels (Sanity fetch failed).", err)
    cachedMediumLabels = DEFAULT_MEDIUM_LABELS
    return cachedMediumLabels
  }
}

// ── Synchronous formatting helper ─────────────────────────────────────

/**
 * Formats an array of medium values into display-ready label objects.
 *
 * Accepts an optional pre-fetched `labelMap` (from `getMediumLabels()`).
 * Defaults to `DEFAULT_MEDIUM_LABELS` so components remain sync-friendly.
 *
 * @example
 *   // sync (fallback labels):
 *   formatMediumLabels(["PASTEL", "ENCRE"])
 *   // → [{ label: "Pastel" }, { label: "Encre" }]
 *
 *   // async (CMS-customised labels):
 *   const labelMap = await getMediumLabels()
 *   formatMediumLabels(["PASTEL"], labelMap)
 */
export function formatMediumLabels(
  mediums: GalleryMedium[] | string[] | undefined | null,
  labelMap: Record<string, string> = DEFAULT_MEDIUM_LABELS
): { label: string }[] {
  if (!mediums?.length) return []

  return mediums
    .map((m) => ({ label: labelMap[m] ?? m }))
    .filter((item) => Boolean(item.label))
}
