import "server-only";
import type { Guide } from "@/lib/types";
import { getProductById } from "@/lib/products";

/**
 * Señales reales para los chips de las cards del listado de guías.
 * Todo sale de los productos referenciados por la guía (quickPicks + product-card).
 * Si un dato falta, el campo queda `undefined` y la página omite el chip.
 */
export interface GuideCardSignals {
  /** Nº de productos únicos referenciados (quickPicks + secciones product-card). */
  productCount: number;
  /** Nombre corto del producto destacado (quickPicks[0]). */
  topPick?: string;
  /** Precio mínimo entre los productos referenciados, formateado sin símbolo (ej. "58.000"). */
  fromPrice?: string;
  /** Rating del topPick. */
  topRating?: number;
  /** Suma de reviewCount de los productos referenciados, redondeada hacia abajo a miles (ej. 15000). */
  totalReviews?: number;
}

/** Recorta un nombre de producto para que entre cómodo en un chip. */
function shortName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length <= 28) return trimmed;
  return trimmed.slice(0, 27).trimEnd() + "…";
}

/** Junta los MLA ids únicos de una guía: quickPicks primero, después product-cards. */
function referencedProductIds(guide: Guide): string[] {
  const ids: string[] = [];
  for (const pick of guide.quickPicks || []) {
    if (pick.productMlaId) ids.push(pick.productMlaId);
  }
  for (const section of guide.sections) {
    if (section.type === "product-card" && section.productMlaId) {
      ids.push(section.productMlaId);
    }
  }
  return Array.from(new Set(ids));
}

export function getGuideCardSignals(guide: Guide): GuideCardSignals {
  const ids = referencedProductIds(guide);
  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Precio mínimo entre los productos con precio > 0.
  const prices = products
    .map((p) => p.price)
    .filter((price): price is number => typeof price === "number" && price > 0);
  const fromPrice =
    prices.length > 0
      ? Math.min(...prices).toLocaleString("es-AR")
      : undefined;

  // Suma de opiniones, redondeada hacia abajo a miles.
  const reviewSum = products.reduce(
    (sum, p) => sum + (typeof p.reviewCount === "number" ? p.reviewCount : 0),
    0
  );
  const totalReviews =
    reviewSum >= 1000 ? Math.floor(reviewSum / 1000) * 1000 : undefined;

  // Producto destacado (quickPicks[0]).
  const topPickId = guide.quickPicks?.[0]?.productMlaId;
  const topPickProduct = topPickId ? getProductById(topPickId) : undefined;
  const topPickName = topPickProduct
    ? topPickProduct.canonicalName || topPickProduct.title
    : undefined;
  const topPick = topPickName ? shortName(topPickName) : undefined;
  const topRating =
    typeof topPickProduct?.rating === "number" ? topPickProduct.rating : undefined;

  return {
    productCount: products.length,
    topPick,
    fromPrice,
    topRating,
    totalReviews,
  };
}
