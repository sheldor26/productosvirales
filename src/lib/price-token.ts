import "server-only"; // candado: importa el catálogo vía products.ts; solo-server
import { getProductById } from "@/lib/products";
import { analyzePriceHistory, shortDate } from "@/lib/price-history";
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
 * También resuelve la prueba social, que envejece igual de mal que el precio:
 *
 *   {{reviews:MLA18193159}}    → "1.483"   (cantidad de opiniones en ML)
 *   {{rating:MLA18193159}}     → "4.7"     (estrellas, un decimal)
 *
 * La palabra ("opiniones", "calificaciones", "estrellas") la escribe el editor:
 * el token resuelve solo el número, igual que los de precio. El patrón típico es
 * "4.7 estrellas en 1.483 opiniones", así que van casi siempre de a dos.
 *
 * Para afirmar "está en su precio más bajo" o "es más barato que nunca" sin
 * tipear un monto que se desactualiza en cuanto el precio se mueve, usar el
 * mínimo histórico real (sale de `price-history.json`, el mismo dato que
 * alimenta el gráfico de /producto/ y el índice de precios):
 *
 *   {{preciomin:MLA18193159}}      → "$ 139.900"  (precio mínimo registrado)
 *   {{preciominfecha:MLA18193159}} → "6 ago"      (fecha de ese mínimo)
 *
 * Si el producto no tiene al menos 2 chequeos de historial, el token queda
 * visible tal cual (mismo criterio que el resto): no hay suficiente dato para
 * un mínimo honesto con 1 solo punto.
 *
 * OJO con los aproximados: si la frase dice "más de 4.100 opiniones", dejala
 * hardcodeada. Un "más de" con número redondo sigue siendo verdad cuando el
 * conteo sube, que es justo lo que hace un conteo de reseñas; meterle el token
 * exacto ahí no arregla nada y empeora la prosa ("más de 4.137 opiniones").
 * El token es para los números exactos, que quedan viejos apenas ML suma una.
 *
 * Si el producto no existe o no tiene el dato, deja el token tal cual (visible),
 * para que un enlace roto se note en la revisión en vez de mostrar un precio
 * vacío o equivocado. El script scripts/check-price-tokens.cjs valida todos los
 * tokens antes de publicar.
 */
const PRICE_TOKEN_RE = /\{\{\s*precio:([A-Za-z0-9]+)(?::(k))?\s*\}\}/g;
const PRICE_DIFF_TOKEN_RE = /\{\{\s*preciodif:([A-Za-z0-9]+):([A-Za-z0-9]+)\s*\}\}/g;
const REVIEWS_TOKEN_RE = /\{\{\s*reviews:([A-Za-z0-9]+)\s*\}\}/g;
const RATING_TOKEN_RE = /\{\{\s*rating:([A-Za-z0-9]+)\s*\}\}/g;
const PRICE_MIN_TOKEN_RE = /\{\{\s*preciomin:([A-Za-z0-9]+)\s*\}\}/g;
const PRICE_MIN_DATE_TOKEN_RE = /\{\{\s*preciominfecha:([A-Za-z0-9]+)\s*\}\}/g;

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

  out = out.replace(REVIEWS_TOKEN_RE, (whole, id: string) => {
    const product = getProductById(id);
    if (!product?.reviewCount) return whole;
    return product.reviewCount.toLocaleString("es-AR");
  });

  out = out.replace(RATING_TOKEN_RE, (whole, id: string) => {
    const product = getProductById(id);
    if (!product?.rating) return whole;
    // Un decimal con punto: es el formato que ya usan las 630 menciones de
    // "4.7 estrellas" del contenido. No cambiar a coma sin migrar todas.
    return product.rating.toFixed(1);
  });

  out = out.replace(PRICE_MIN_TOKEN_RE, (whole, id: string) => {
    const product = getProductById(id);
    if (!product) return whole;
    const history = analyzePriceHistory(id, product.price);
    if (!history) return whole;
    return formatPrice(history.min, product.currency);
  });

  out = out.replace(PRICE_MIN_DATE_TOKEN_RE, (whole, id: string) => {
    const product = getProductById(id);
    if (!product) return whole;
    const history = analyzePriceHistory(id, product.price);
    if (!history) return whole;
    return shortDate(history.minDate);
  });

  return out;
}
