import { NextResponse, type NextRequest } from "next/server";
import productSlugMap from "@/data/product-slug-map.json";

/**
 * Dos arreglos para /producto/:slug, ambos por el mismo motivo: en este Next
 * (16), las funciones de src/app/producto/[slug]/page.tsx que deberían cambiar
 * el status code (permanentRedirect, notFound) no lo hacen cuando corren en
 * contexto de streaming — la respuesta ya salió como 200 antes de que esas
 * funciones se ejecuten, así que Next compensa con un mecanismo del lado del
 * cliente (meta refresh / meta noindex) en vez de un status code real. Un
 * crawler no ejecuta eso.
 *
 * 1. Slug viejo de una ficha renombrada → 308 real en vez del 200 + meta
 *    refresh que confirmaba GSC como "Redirect error" en la ficha de la pava
 *    Philips HD9396.
 * 2. Slug de un producto que no existe (o nunca existió) → 404 real. La
 *    página ya insertaba <meta name="robots" content="noindex">, que evita
 *    que Google lo indexe, pero solo después de rastrearla — un 404 real
 *    resuelto en el router (sin pasar por notFound() en pleno stream) es
 *    gratis en cuanto a crawl budget y es la señal SEO más limpia.
 *
 * Este Proxy corre en el servidor antes del render. Usa un mapa liviano
 * generado en build (product-slug-map.json, ~80KB) en vez del catálogo
 * completo (curated-products.ts, ~7.5MB): ver
 * scripts/generate-product-slug-map.ts.
 */

const slugMap = productSlugMap as Record<string, string>;

// Mismo patrón que parseProductSlug() en src/lib/product-url.ts.
const MLA_ID_RE = /(?:^|-)(MLAU?\d+)$/i;

// Ruta que no matchea ningún route del sitio (no hay catch-all en la raíz):
// al reescribir acá, Next resuelve un 404 real por su cuenta, el mismo que
// da cualquier URL inexistente del sitio — sin pasar por notFound().
const NOT_FOUND_REWRITE_PATH = "/__producto-no-encontrado__";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/producto\/([^/]+)$/);
  if (!match) return NextResponse.next();

  const slug = decodeURIComponent(match[1]);
  const idMatch = slug.match(MLA_ID_RE);
  const id = idMatch ? idMatch[1].toUpperCase() : null;
  const canonical = id ? slugMap[id] : undefined;

  if (!canonical) {
    const url = request.nextUrl.clone();
    url.pathname = NOT_FOUND_REWRITE_PATH;
    return NextResponse.rewrite(url, { status: 404 });
  }

  if (slug !== canonical) {
    const url = request.nextUrl.clone();
    url.pathname = `/producto/${canonical}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/producto/:slug",
};
