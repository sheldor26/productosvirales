import type { Product } from "./types";
import { curatedProducts } from "@/data/curated-products";

/**
 * Visibility helpers for product filtering across feeds, grids and related blocks.
 *
 * - "featured": boosted surface area (future use for homepage hero/editorial slots)
 * - "normal": default — shown in every feed unless explicitly filtered
 * - "deprioritized": soft-hide from feeds/grids/related/sitemap but keeps the URL
 *   accessible for direct links and long-tail SEO
 *
 * When `visibility` is undefined, we treat it as "normal".
 */

export function isVisible(product: Product): boolean {
  return product.visibility !== "deprioritized";
}

export function isFeatured(product: Product): boolean {
  return product.visibility === "featured";
}

/** All products that should appear in feeds, grids and relateds. */
export function getVisibleProducts(): Product[] {
  return curatedProducts.filter(isVisible);
}

/**
 * Deterministic Fisher-Yates shuffle driven by a numeric seed.
 * Same seed → same order, so server render and client hydration agree
 * (no hydration mismatch) while still varying across page loads.
 */
function seededShuffle<T>(input: T[], seed: number): T[] {
  const arr = [...input];
  let s = (seed >>> 0) || 1;
  const next = () => {
    // mulberry32-style LCG, good enough for shuffling a product feed.
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Visible products in a rotated order for the homepage, so it doesn't always
 * surface the same items. Pass a seed (generated once on the server per request,
 * or a daily seed) so the order is stable within a render but varies over time.
 */
export function getRotatedVisibleProducts(seed: number): Product[] {
  return seededShuffle(getVisibleProducts(), seed);
}

/**
 * A fresh rotation seed for the homepage. Impurity (randomness) is kept inside
 * this helper so server components that call it stay "pure" in render.
 * Generate it once per request on the server and pass it down as a prop.
 */
export function makeRotationSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

/** Lookup a product by its MLA/MLAU id. Returns undefined if not found. */
export function getProductById(id: string): Product | undefined {
  return curatedProducts.find((p) => p.id === id);
}

/** Only featured products (for editorial slots). Falls back to visible set if none. */
export function getFeaturedProducts(): Product[] {
  const featured = curatedProducts.filter(isFeatured);
  return featured.length > 0 ? featured : getVisibleProducts();
}

/** Products for the sitemap with a priority derived from visibility. */
export function getSitemapProducts(): Array<{ product: Product; priority: number }> {
  return curatedProducts.map((product) => {
    let priority = 0.7;
    if (product.visibility === "featured") priority = 0.9;
    else if (product.visibility === "deprioritized") priority = 0.3;
    return { product, priority };
  });
}
