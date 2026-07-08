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
 * Para CLAIMS COMPARATIVOS ("es $16.274 más cara que...", "$9.000 menos que...")
 * usar el token de diferencia en vez de tipear el monto:
 *
 *   {{preciodif:MLA18193159:MLA24601443}}  → "$ 16.274"  (valor absoluto de la
 *                                             resta, siempre actualizado)
 *
 * La palabra "más"/"menos"/"más cara"/"más barata" la sigue escribiendo el
 * editor a mano (el token solo resuelve el NÚMERO); si los precios cambian de
 * orden, revisar que el sentido de la frase siga siendo correcto.
 *
 * Si el producto no existe o no tiene precio, deja el token tal cual (visible),
 * para que un enlace roto se note en la revisión en vez de mostrar un precio
 * vacío o equivocado. El script scripts/check-price-tokens.cjs valida todos los
 * tokens antes de publicar.
 */
const PRICE_TOKEN_RE = /\{\{\s*precio:([A-Za-z0-9]+)(?::(k))?\s*\}\}/g;
const PRICE_DIFF_TOKEN_RE = /\{\{\s*preciodif:([A-Za-z0-9]+):([A-Za-z0-9]+)\s*\}\}/g;

export function injectLivePrices(text: string): string {
  // Fast path: la enorme mayoría de los textos no tienen tokens.
  if (!text || !text.includes("{{")) return text;

  let out = text.replace(PRICE_TOKEN_RE, (whole, id: string, rounded?: string) => {
    const product = getProductById(id);
    if (!product || !product.price) return whole;
    const value = rounded
      ? Math.round(product.price / 1000) * 1000
      : product.price;
    return formatPrice(value, product.currency);
  });

  out = out.replace(PRICE_DIFF_TOKEN_RE, (whole, idA: string, idB: string) => {
    const a = getProductById(idA);
    const b = getProductById(idB);
    if (!a?.price || !b?.price) return whole;
    return formatPrice(Math.abs(a.price - b.price), a.currency);
  });

  return out;
}
