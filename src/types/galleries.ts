/**
 * TypeScript types for gallery data fetched from Sanity.
 *
 * These types mirror the GROQ query projections, NOT the full Sanity schema.
 * Keep them aligned with the queries in `src/lib/sanityQueries.ts`.
 *
 * GalleryMedium, DEFAULT_MEDIUM_LABELS, getMediumLabels (async) and
 * formatMediumLabels live in `@config/galleryMediums` — single source of truth.
 * Re-exported here for backward-compat with existing imports.
 */

// Import into scope so the interfaces below can reference GalleryMedium directly.
import type { GalleryMedium } from "@config/galleryMediums";

export {
  DEFAULT_MEDIUM_LABELS,
  formatMediumLabels,
  GALLERY_MEDIUMS,
  getMediumLabels,
  DEFAULT_MEDIUM_LABELS as MEDIUM_LABELS,
} from "@config/galleryMediums";
export type { GalleryMedium };

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
      month: "long",
      year: "numeric",
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
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", {
        year: "2-digit",
      }).format(date);
}
