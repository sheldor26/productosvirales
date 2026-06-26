import type { Guide } from "./types";

const SITE = "https://productosvirales.com.ar";

/**
 * Path relativo de una guía. Fuente única de verdad para construir URLs de guías.
 * - Guías en silo (campo `silo`): `/guias/{silo}/{slug}` (ej. /guias/climatizacion/estufas-electricas).
 * - Guías planas (legacy, sin silo): `/guias/{slug}` (mantienen su URL, no se migran).
 */
export function guideHref(g: Pick<Guide, "slug" | "silo">): string {
  return g.silo ? `/guias/${g.silo}/${g.slug}` : `/guias/${g.slug}`;
}

/** URL absoluta de una guía. */
export function guideUrl(g: Pick<Guide, "slug" | "silo">): string {
  return `${SITE}${guideHref(g)}`;
}
