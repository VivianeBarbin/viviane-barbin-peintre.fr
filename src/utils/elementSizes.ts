/**
 * High-performance element size observer utility
 * Provides reactive element size tracking with CSS variable integration
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ElementSize {
  width: number;
  height: number;
}

export type SizeCallback = (size: ElementSize) => void;

interface ElementConfig {
  callback: SizeCallback;
  lastWidth: number;
  lastHeight: number;
}

// ============================================================================
// ELEMENT SIZER CLASS
// ============================================================================

export class ElementSizer {
  private ro: ResizeObserver | null = null;
  private elements = new Map<Element, ElementConfig>();

  constructor() {
    // Only create ResizeObserver in browser environment
    if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const config = this.elements.get(entry.target);
          if (!config) continue;

          // Safely access contentBoxSize with fallback
          const boxSize = entry.contentBoxSize?.[0];
          const width = boxSize?.inlineSize ?? entry.contentRect.width;
          const height = boxSize?.blockSize ?? entry.contentRect.height;

          // Skip if unchanged (performance optimization)
          if (config.lastWidth === width && config.lastHeight === height) continue;

          config.lastWidth = width;
          config.lastHeight = height;
          config.callback({ width, height });
        }
      });
    }
  }

  /**
   * Watch element size changes
   * @param el - Element to observe
   * @param callback - Called when size changes
   * @returns Cleanup function to stop watching
   */
  watch(el: Element | null, callback: SizeCallback): () => void {
    if (!el || !this.ro) {
      return () => {}; // No-op cleanup for SSR or null element
    }

    this.elements.set(el, {
      callback,
      lastWidth: -1,
      lastHeight: -1,
    });

    this.ro.observe(el, { box: "content-box" });

    // Return cleanup function
    return () => this.unwatch(el);
  }

  /**
   * Stop watching an element
   */
  unwatch(el: Element): void {
    if (this.elements.has(el)) {
      this.ro?.unobserve(el);
      this.elements.delete(el);
    }
  }

  /**
   * Cleanup all observations
   */
  destroy(): void {
    this.ro?.disconnect();
    this.elements.clear();
  }

  /**
   * Get current size of an element (one-time read)
   */
  getSize(el: Element | null): ElementSize | null {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
}

// ============================================================================
// CSS VARIABLE HELPERS
// ============================================================================

/**
 * Set a CSS custom property on the document root
 */
export function setCSSVariable(name: string, value: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(name, value);
  }
}

/**
 * Remove a CSS custom property from the document root
 */
export function removeCSSVariable(name: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty(name);
  }
}

/**
 * Watch an element and sync its height to a CSS variable
 * @param selector - CSS selector for the element
 * @param variableName - CSS variable name (e.g., "--navbar-height")
 * @param sizer - ElementSizer instance (optional, creates new one if not provided)
 * @returns Cleanup function
 *
 * @example
 * ```ts
 * // In a client-side script
 * const cleanup = watchElementHeight("#nav__container", "--navbar-height");
 *
 * // Use in CSS: height: calc(100dvh - var(--navbar-height, 90px));
 * ```
 */
export function watchElementHeight(
  selector: string,
  variableName: string,
  sizer?: ElementSizer
): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`[watchElementHeight] Element not found: "${selector}"`);
    return () => {};
  }

  const sizerInstance = sizer ?? new ElementSizer();
  const isOwnSizer = !sizer;

  // Set initial value
  const initialSize = sizerInstance.getSize(element);
  if (initialSize) {
    setCSSVariable(variableName, `${initialSize.height}px`);
  }

  // Watch for changes
  const unwatchElement = sizerInstance.watch(element, ({ height }) => {
    setCSSVariable(variableName, `${height}px`);
  });

  // Return cleanup function
  return () => {
    unwatchElement();
    removeCSSVariable(variableName);
    if (isOwnSizer) {
      sizerInstance.destroy();
    }
  };
}

/**
 * Watch an element and sync its width to a CSS variable
 * @param selector - CSS selector for the element
 * @param variableName - CSS variable name (e.g., "--sidebar-width")
 * @param sizer - ElementSizer instance (optional)
 * @returns Cleanup function
 */
export function watchElementWidth(
  selector: string,
  variableName: string,
  sizer?: ElementSizer
): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`[watchElementWidth] Element not found: "${selector}"`);
    return () => {};
  }

  const sizerInstance = sizer ?? new ElementSizer();
  const isOwnSizer = !sizer;

  // Set initial value
  const initialSize = sizerInstance.getSize(element);
  if (initialSize) {
    setCSSVariable(variableName, `${initialSize.width}px`);
  }

  // Watch for changes
  const unwatchElement = sizerInstance.watch(element, ({ width }) => {
    setCSSVariable(variableName, `${width}px`);
  });

  // Return cleanup function
  return () => {
    unwatchElement();
    removeCSSVariable(variableName);
    if (isOwnSizer) {
      sizerInstance.destroy();
    }
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/** Shared ElementSizer instance for common use cases */
export const elementSizer = new ElementSizer();

// ============================================================================
// SPACING TOKENS (UnoCSS-compatible class strings)
// ============================================================================

/**
 * Section header wrapper spacing tokens
 * Used consistently across Workshop, Book, Contact, Galleries, and 404 components
 *
 * Values:
 * - my-10: 2.5rem vertical margin (UnoCSS default scale)
 * - gap-y-[1.875rem]: 30px (1.875rem) vertical gap between header elements
 */
export const sectionHeaderSpacing = {
  /** Vertical margin for section header wrapper */
  my: "my-10" as const,
  /** Vertical gap between header elements (h1, h2, etc.) */
  gapY: "gap-y-[1.875rem]" as const,
  /** Combined classes for section header wrapper */
  wrapper: "my-10 flex flex-col gap-y-[1.875rem]" as const,
} as const;

/**
 * Content grid spacing tokens
 * Used for 2-column layouts (image + text) in Workshop, 404, and similar components
 *
 * Values:
 * - gap-16: 4rem gap between grid columns
 * - lg:grid-cols-2: 2 columns on desktop
 * - md:py-10: 2.5rem vertical padding on medium+ screens
 * - mb-8: 2rem bottom margin (mobile)
 * - md:mb-16: 4rem bottom margin (desktop)
 */
export const contentGridSpacing = {
  /** Gap between grid columns */
  gap: "gap-16" as const,
  /** 2-column layout on desktop */
  cols: "lg:grid-cols-2" as const,
  /** Vertical padding on medium+ screens */
  py: "md:py-10" as const,
  /** Bottom margin (mobile) */
  mb: "mb-8" as const,
  /** Bottom margin (desktop) */
  mbMd: "md:mb-16" as const,
  /** Combined classes for content grid */
  wrapper: "grid gap-16 lg:grid-cols-2 md:py-10 mb-8 md:mb-16" as const,
} as const;
