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
