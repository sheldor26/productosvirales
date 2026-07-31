import type { CardProduct } from "@/lib/types";

export type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "descuento" | "rating" | "vendidos";

export const SORT_LABELS: Record<SortOption, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  descuento: "Mayor descuento",
  rating: "Mejor calificados",
  vendidos: "Más vendidos",
};

function discountPct(p: CardProduct): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return (p.originalPrice - p.price) / p.originalPrice;
}

/** Compartido entre SortableProductGrid (categorías) y HomeFeed (búsqueda
 * interna): mismo criterio de orden en los dos lugares donde el visitante
 * puede elegirlo. */
export function sortProducts(products: CardProduct[], sort: SortOption): CardProduct[] {
  if (sort === "relevancia") return products;
  const sorted = [...products];
  switch (sort) {
    case "precio-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "descuento":
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
      break;
    case "rating":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "vendidos":
      sorted.sort((a, b) => (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0));
      break;
  }
  return sorted;
}
