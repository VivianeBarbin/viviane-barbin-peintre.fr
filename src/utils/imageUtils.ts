/**
 * Image utilities for resolving dynamic image paths to ImageMetadata
 */

// Use Vite's import.meta.glob to eagerly load all images
const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,gif,svg}",
  { eager: true }
);

// Cache for resolved images to avoid repeated lookups
const imageCache = new Map<string, ImageMetadata | null>();

/**
 * Normalize an image path from @images alias to absolute path
 * @internal
 */
function normalizePath(imagePath: string): string {
  return imagePath.replace(/^@images\//, "/src/assets/images/");
}

/**
 * Resolve an image path (with @images alias) to ImageMetadata
 *
 * @param imagePath - Path to the image (e.g., "@images/services/categories/electricite-generale/image.jpg")
 * @returns ImageMetadata object or null if not found
 *
 * @example
 * ```ts
 * const image = resolveImage("@images/services/categories/electricite-generale/image.jpg");
 * if (image) {
 *   // Use with Astro's Image component
 *   <Image src={image} alt="Description" />
 * }
 * ```
 */
export function resolveImage(imagePath: string | null | undefined): ImageMetadata | null {
  if (!imagePath) return null;

  // Check cache first
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath)!;
  }

  // Normalize the path
  const normalizedPath = normalizePath(imagePath);

  // Look up the image in our glob map
  const imageModule = images[normalizedPath];

  if (!imageModule?.default) {
    console.warn(
      `[resolveImage] Image not found: "${imagePath}"\n` +
        `  Resolved to: "${normalizedPath}"\n` +
        `  Available paths: ${Object.keys(images).length} images loaded`
    );
    imageCache.set(imagePath, null);
    return null;
  }

  const metadata = imageModule.default;
  imageCache.set(imagePath, metadata);
  return metadata;
}

/**
 * Resolve multiple image paths at once
 *
 * @param imagePaths - Array of image paths
 * @returns Array of ImageMetadata objects (null for not found images)
 *
 * @example
 * ```ts
 * const [hero, thumbnail] = resolveImages([
 *   "@images/hero.jpg",
 *   "@images/thumb.jpg"
 * ]);
 * ```
 */
export function resolveImages(imagePaths: (string | null | undefined)[]): (ImageMetadata | null)[] {
  return imagePaths.map(resolveImage);
}

/**
 * Check if an image path exists
 *
 * @param imagePath - Path to check
 * @returns true if the image exists
 *
 * @example
 * ```ts
 * if (imageExists("@images/optional-banner.jpg")) {
 *   // Show banner
 * }
 * ```
 */
export function imageExists(imagePath: string | null | undefined): boolean {
  return resolveImage(imagePath) !== null;
}

/**
 * Get all available image paths
 * Useful for debugging or generating image listings
 *
 * @returns Array of all loaded image paths with @images alias
 *
 * @example
 * ```ts
 * const allImages = getAllImagePaths();
 * console.log(`Loaded ${allImages.length} images`);
 * ```
 */
export function getAllImagePaths(): string[] {
  return Object.keys(images).map((path) => path.replace(/^\/src\/assets\/images\//, "@images/"));
}

/**
 * Resolve an image with a fallback
 *
 * @param imagePath - Primary image path
 * @param fallbackPath - Fallback image path if primary not found
 * @returns ImageMetadata object or null if neither found
 *
 * @example
 * ```ts
 * const image = resolveImageWithFallback(
 *   dynamicImagePath,
 *   "@images/placeholder.jpg"
 * );
 * ```
 */
export function resolveImageWithFallback(
  imagePath: string | null | undefined,
  fallbackPath: string
): ImageMetadata | null {
  return resolveImage(imagePath) ?? resolveImage(fallbackPath);
}

/**
 * Clear the image resolution cache
 * Useful in development if you're adding images dynamically
 */
export function clearImageCache(): void {
  imageCache.clear();
}
