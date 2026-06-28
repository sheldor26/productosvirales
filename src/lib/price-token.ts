import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

/**
 * Reemplaza tokens de precio en vivo dentro de cualquier texto de contenido.
 * El precio sale del producto en `curated-products.ts` (única fuente de verdad),
 * así que cuando cambia el precio en /producto/ se actualiza acá también.
 *
 *   {{precio:MLA18193159}}     → "$ 149.132"  (precio exacto, ideal para tablas)
 *   {{precio:MLA18193159:k}}   → "$ 149.000"  (redondeado al mil, para prosa
 *                                              tipo "alrededor de $149.000")
 *
 * Si el producto no existe o no tiene precio, deja el token tal cual (visible),
 * para que un enlace roto se note en la revisión en vez de mostrar un precio
 * vacío o equivocado. El script scripts/check-price-tokens.cjs valida todos los
 * tokens antes de publicar.
 */
const PRICE_TOKEN_RE = /\{\{\s*precio:([A-Za-z0-9]+)(?::(k))?\s*\}\}/g;

export function injectLivePrices(text: string): string {
  // Fast path: la enorme mayoría de los textos no tienen tokens.
  if (!text || !text.includes("{{")) return text;

  return text.replace(PRICE_TOKEN_RE, (whole, id: string, rounded?: string) => {
    const product = getProductById(id);
    if (!product || !product.price) return whole;
    const value = rounded
      ? Math.round(product.price / 1000) * 1000
      : product.price;
    return formatPrice(value, product.currency);
  });
}
