import { createImageUrlBuilder } from "@sanity/image-url";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/utils/sanityConfig";

/**
 * Sanity image URL helper (remote optimization pipeline).
 *
 * This utility generates optimized image URLs using Sanity's image CDN
 * transformations (width/height/quality/format/etc).
 *
 * It is intentionally "public-config only" (projectId/dataset) and does not use
 * any token. Never put secrets in here.
 *
 * Usage:
 *   const url = sanityImageUrl(image).width(400).height(600).format("webp").url()
 *
 * Or use the convenience function:
 *   const url = buildSanityImageUrl({ source: image, width: 400, height: 600 })
 */

export type SanityImageFormat = "webp" | "jpg" | "png";

/**
 * Get a Sanity image URL builder for a given image `source`.
 *
 * `source` can be:
 * - the `image` field object from Sanity (recommended), or
 * - an asset reference, etc.
 *
 * Returns `null` if no `source` is provided.
 */
export function sanityImageUrl(source: unknown) {
  if (!source) return null;

  const builder = createImageUrlBuilder({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  });

  return builder.image(source);
}

/**
 * Convenience function to build a single optimized URL.
 *
 * Notes:
 * - `auto("format")` is enabled by default to let Sanity choose the best format.
 * - If you pass `format`, it will force that output format (useful for
 *   predictable caching, or when you want to generate explicit webp/avif srcsets).
 */
export function buildSanityImageUrl({
  source,
  width,
  height,
  quality = 80,
  format,
  fit = "crop",
  dpr,
}: {
  source: unknown;
  width?: number;
  height?: number;
  quality?: number;
  format?: SanityImageFormat;
  /**
   * Sanity fit mode. Common values include "crop", "clip", "fill", "min", "max", "scale".
   * "crop" is usually a good default for portraits.
   */
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "min" | "scale";
  /**
   * Device pixel ratio. If provided, Sanity will scale the output accordingly.
   * You can use this to produce 1x/2x URLs without changing CSS pixels.
   */
  dpr?: number;
}): string | null {
  const b = sanityImageUrl(source);
  if (!b) return null;

  let url = b.auto("format").quality(quality).fit(fit);

  if (typeof width === "number") url = url.width(width);
  if (typeof height === "number") url = url.height(height);
  if (typeof dpr === "number") url = url.dpr(dpr);
  if (format) url = url.format(format);

  const out = url.url();
  return typeof out === "string" && out.length > 0 ? out : null;
}

/**
 * Build a DPR-based srcset (e.g. 1x, 1.5x, 2x) for a fixed CSS pixel size.
 * This is often a better mental model than varying widths.
 */
export function buildSanityDprSrcSet({
  source,
  width,
  height,
  dprs = [1, 1.5, 2],
  quality = 80,
  format = "webp",
  fit = "crop",
}: {
  source: unknown;
  width: number;
  height: number;
  dprs?: number[];
  quality?: number;
  format?: SanityImageFormat;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "min" | "scale";
}): string | null {
  if (!source) return null;

  const entries = dprs
    .map((dpr) => {
      const url = buildSanityImageUrl({
        source,
        width,
        height,
        dpr,
        quality,
        format,
        fit,
      });
      return url ? `${url} ${dpr}x` : null;
    })
    .filter((x): x is string => typeof x === "string" && x.length > 0);

  return entries.length > 0 ? entries.join(", ") : null;
}
