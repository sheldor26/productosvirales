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

/**
 * Imagen para el Pin de Pinterest de una guía. Igual que `guideOgImage`, pero
 * cuando cae en la foto del primer producto elige una DISTINTA a la principal
 * (la última del carrusel). Así el Pin de la guía no colisiona con el Pin de la
 * ficha de ese producto —que usa la principal— y Pinterest no lo fusiona por
 * imagen duplicada. Si la guía tiene `ogImage` propio o el producto tiene una
 * sola foto, usa esa.
 */
export function guideFeedImage(guide: Guide): string | undefined {
  if (guide.ogImage) return toJpg(guide.ogImage);
  const picks = guide.quickPicks ?? [];
  // Buscamos una foto SECUNDARIA (la 2da del carrusel) entre los productos
  // destacados de la guía. La principal (imgs[0]) ya es el Pin de la ficha, así
  // que una secundaria evita que Pinterest fusione el Pin de la guía por imagen
  // repetida, y la 2da foto suele ser una toma buena (no la placa de specs).
  for (const qp of picks) {
    const p = qp.productMlaId ? getProductById(qp.productMlaId) : undefined;
    if (p?.images && p.images.length >= 2) return toJpg(p.images[1]);
  }
  // Ningún destacado tiene 2da foto: usamos la principal del primero (va a
  // colisionar, pero es mejor tener el Pin que no tenerlo).
  const first = picks[0]?.productMlaId ? getProductById(picks[0].productMlaId) : undefined;
  return first?.image ? toJpg(first.image) : undefined;
}
