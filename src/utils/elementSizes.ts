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
