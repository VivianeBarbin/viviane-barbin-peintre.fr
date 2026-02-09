/**
 * TypeScript types for gallery data fetched from Sanity.
 *
 * These types mirror the GROQ query projections, NOT the full Sanity schema.
 * Keep them aligned with the queries in `src/lib/sanityQueries.ts`.
 */

// ── Shared sub-types ─────────────────────────────────────────────────

/** Sanity image asset reference (after dereferencing with `asset->`) */
export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
}

/** Sanity image field with dereferenced asset + alt text */
export interface SanityImageWithAlt {
  asset: SanityImageAsset;
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/** Allowed medium/technique values (matches Sanity schema enum) */
export type GalleryMedium =
  | "PASTEL"
  | "AQUARELLE"
  | "HUILE_SUR_TOILE"
  | "HUILE_SUR_BOIS"
  | "ACRYLIQUE"
  | "ENCRE"
  | "FUSAIN"
  | "CRAYON"
  | "TECHNIQUE_MIXTE"
  | "AUTRE";

/** Human-readable labels for each medium value */
export const MEDIUM_LABELS: Record<GalleryMedium, string> = {
  PASTEL: "Pastel",
  AQUARELLE: "Aquarelle",
  HUILE_SUR_TOILE: "Huile sur toile",
  HUILE_SUR_BOIS: "Huile sur bois",
  ACRYLIQUE: "Acrylique",
  ENCRE: "Encre",
  FUSAIN: "Fusain",
  CRAYON: "Crayon",
  TECHNIQUE_MIXTE: "Technique mixte",
  AUTRE: "Autre",
};

// ── Index page (list) ────────────────────────────────────────────────

/**
 * Shape returned by `GALLERIES_LIST_QUERY`.
 * Used on the `/galeries` index page.
 */
export interface GalleryListItem {
  _id: string;
  title: string;
  slug: string; // `slug.current` projected as `slug`
  date: string; // ISO date string (YYYY-MM-DD)
  medium: GalleryMedium[];
  coverImage: SanityImageWithAlt | null;
}

// ── Detail page ──────────────────────────────────────────────────────

/** A single image inside a gallery */
export interface GalleryImageItem {
  _key: string;
  image: SanityImageWithAlt | null;
  alt: string;
  caption?: string;
  order?: number;
}

/** Portable Text block (loose type — exact shape depends on content) */
export type PortableTextBlock = Record<string, unknown>;

/**
 * Shape returned by `GALLERY_DETAIL_QUERY`.
 * Used on the `/galeries/:slug` detail page.
 */
export interface GalleryDetail {
  _id: string;
  title: string;
  slug: string; // `slug.current` projected as `slug`
  date: string; // ISO date string (YYYY-MM-DD)
  medium: GalleryMedium[];
  coverImage: SanityImageWithAlt | null;
  images: GalleryImageItem[];
  body?: PortableTextBlock[];
}

// ── Slug params (for getStaticPaths) ─────────────────────────────────

/** Shape returned by `GALLERY_SLUGS_QUERY` */
export interface GallerySlug {
  slug: string;
}

// ── Date formatting helpers (pure types) ─────────────────────────────

/**
 * Format a date string as MM/YY (French locale).
 *
 * @example formatGalleryDate("2024-09-15") → "09/24"
 */
export function formatGalleryDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * Extract the two-digit year from a date string.
 *
 * @example formatGalleryYear("2024-09-15") → "24"
 */
export function formatGalleryYear(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return String(date.getFullYear()).slice(-2);
  } catch {
    return "";
  }
}

/**
 * Convert an array of medium values to their human-readable labels,
 * joined with a separator.
 *
 * @example formatMediumLabels(["PASTEL", "AQUARELLE"]) → "Pastel · Aquarelle"
 * @example formatMediumLabels(["HUILE_SUR_TOILE"])     → "Huile sur toile"
 * @example formatMediumLabels([])                       → ""
 */
export function formatMediumLabels(
  mediums: GalleryMedium[] | undefined | null,
  separator = " · "
): string {
  if (!mediums || mediums.length === 0) return "";
  return mediums.map((m) => MEDIUM_LABELS[m] ?? m).join(separator);
}
