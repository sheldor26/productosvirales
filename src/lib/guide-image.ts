import type { Guide } from "@/lib/types";
import { getProductById } from "@/lib/products";

// Ni next/og (Satori) ni el importador de Pinterest renderizan .webp. ML sirve
// la misma imagen en jpg cambiando la extensión, así que la normalizamos.
function toJpg(url: string): string {
  return url.replace(/\.webp(\?|$)/i, ".jpg$1");
}

/**
 * Imagen del primer producto destacado de la guía (el `quickPick` de arriba de
 * todo). Es la foto que aparece al principio de la guía, sobre fondo blanco de
 * MercadoLibre — ideal para la tarjeta OG y para el Pin de Pinterest.
 */
export function guideProductImage(guide: Guide): string | undefined {
  const mlaId = guide.quickPicks?.[0]?.productMlaId;
  if (!mlaId) return undefined;
  return getProductById(mlaId)?.image;
}

/**
 * OG image efectiva de la guía: la `ogImage` explícita si está, o si no la del
 * primer producto destacado. Normaliza .webp→.jpg para que renderice tanto en
 * la tarjeta OG como en Pinterest. undefined solo si no hay ninguna imagen.
 */
export function guideOgImage(guide: Guide): string | undefined {
  const url = guide.ogImage ?? guideProductImage(guide);
  return url ? toJpg(url) : undefined;
}
