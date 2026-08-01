import type { CardProduct } from "@/lib/types";

export type SignalFilter = "freeShipping" | "bestPrice" | "discount" | "topRated" | "bestSeller";

export const SIGNAL_LABELS: Record<SignalFilter, string> = {
  freeShipping: "Envío gratis",
  bestPrice: "Mínimo histórico",
  discount: "Con descuento",
  topRated: "4.8 o más",
  bestSeller: "Más vendidos",
};

const SIGNAL_ORDER: SignalFilter[] = ["freeShipping", "bestPrice", "discount", "topRated", "bestSeller"];

const SIGNAL_PREDICATES: Record<SignalFilter, (p: CardProduct) => boolean> = {
  freeShipping: (p) => p.freeShipping,
  bestPrice: (p) => !!p.bestPrice,
  discount: (p) => !!p.originalPrice && p.originalPrice > p.price,
  topRated: (p) => (p.rating ?? 0) >= 4.8,
  bestSeller: (p) => (p.soldQuantity ?? 0) >= 1000,
};

/** Solo devuelve señales con al menos un producto que la cumpla en el
 * listado actual — mismo criterio que los buckets de precio, nunca mostrar
 * un filtro que no tiene ningún resultado posible. */
export function buildAvailableSignals(products: CardProduct[]): SignalFilter[] {
  return SIGNAL_ORDER.filter((signal) => products.some(SIGNAL_PREDICATES[signal]));
}

export function matchesSignals(product: CardProduct, active: SignalFilter[]): boolean {
  return active.every((signal) => SIGNAL_PREDICATES[signal](product));
}
