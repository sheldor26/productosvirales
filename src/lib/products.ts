import "server-only"; // candado: falla el build si un componente cliente importa esto (arrastra el catálogo)
import type { CardProduct, Product } from "./types";
import { curatedProducts } from "@/data/curated-products";
import { normalizeSearch } from "./utils";
import { analyzePriceHistory } from "./price-history";

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

/** Recorta un Product a los campos que usa la tarjeta de grilla. Usar SIEMPRE
 * en páginas server antes de pasar productos a ProductGrid: evita serializar
 * articleBody/faq/reviews de cada producto en el payload RSC del HTML. */
export function toCardProduct(p: Product): CardProduct {
  const priceHistory = analyzePriceHistory(p.id, p.price);
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    category: p.category,
    categorySlug: p.categorySlug,
    affiliateUrl: p.affiliateUrl,
    tiktokViews: p.tiktokViews,
    badge: p.badge,
    pastelColor: p.pastelColor,
    priceStatus: p.priceStatus,
    bestPrice: priceHistory?.verdict.tone === "good",
  };
}

/** DTO de la tarjeta + un haystack normalizado para la búsqueda del feed. Se
 * arma en el SERVIDOR y se pasa a HomeFeed como prop, así el cliente NO importa
 * `curated-products` (evita mandar el catálogo entero, ~4 MB, al bundle). */
export interface FeedCard extends CardProduct {
  search: string;
}

export function toFeedCard(p: Product): FeedCard {
  return {
    ...toCardProduct(p),
    search: normalizeSearch(`${p.title} ${p.category} ${p.description || ""} ${p.h1 || ""}`),
  };
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
 * Rotation seed for the homepage, bucketed by a 15-minute time window instead
 * of Math.random(). This keeps the seed (and therefore the render output)
 * stable within an ISR revalidation window, so the homepage can be cached at
 * the edge and still rotate products over time, instead of forcing a fresh
 * dynamic render on every single request.
 */
export function makeRotationSeed(): number {
  const BUCKET_MS = 15 * 60 * 1000;
  return Math.floor(Date.now() / BUCKET_MS);
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
  // Las fichas deprioritized (ej. listados de reserva sin stock) NO van al sitemap:
  // no deben competir en indexación con la ficha activa del mismo producto.
  return curatedProducts
    .filter((product) => product.visibility !== "deprioritized")
    .map((product) => {
      const priority = product.visibility === "featured" ? 0.9 : 0.7;
      return { product, priority };
    });
}
