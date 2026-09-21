import { NextResponse, type NextRequest } from "next/server";
import productSlugMap from "@/data/product-slug-map.json";

/**
 * Redirige /producto/<slug-viejo>-MLA... a /producto/<slug-actual>-MLA... con un
 * 308 real, ANTES de que se renderice la página.
 *
 * Por qué no alcanza con el permanentRedirect() que ya tiene
 * src/app/producto/[slug]/page.tsx: en este Next (16), cuando ese redirect corre
 * en contexto de streaming no manda un 308 de verdad — devuelve 200 con la página
 * completa duplicada más un <meta http-equiv="refresh"> que solo funciona en
 * navegadores reales, no para Google/crawlers. Confirmado en vivo: GSC reportaba
 * "Redirect error" en la ficha de la pava Philips HD9396 porque el slug viejo
 * (de antes de una reescritura de título) seguía indexado.
 *
 * Este Proxy corre en el servidor antes del render, así que puede devolver un
 * status code real sin ese problema. Usa un mapa liviano generado en build
 * (product-slug-map.json, ~80KB) en vez del catálogo completo (curated-products.ts,
 * ~7.5MB): ver scripts/generate-product-slug-map.ts.
 */

const slugMap = productSlugMap as Record<string, string>;

// Mismo patrón que parseProductSlug() en src/lib/product-url.ts.
const MLA_ID_RE = /(?:^|-)(MLAU?\d+)$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/producto\/([^/]+)$/);
  if (!match) return NextResponse.next();

  const slug = decodeURIComponent(match[1]);
  const idMatch = slug.match(MLA_ID_RE);
  if (!idMatch) return NextResponse.next();

  const id = idMatch[1].toUpperCase();
  const canonical = slugMap[id];
  if (!canonical || slug === canonical) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/producto/${canonical}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/producto/:slug",
};
