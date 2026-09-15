import "server-only"; // candado: resuelve precios vía price-token (catálogo); solo-server
import { injectLivePrices } from "@/lib/price-token";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { curatedProducts } from "@/data/curated-products";
import { productHref } from "@/lib/product-url";
import type React from "react";

/**
 * Índice affiliateUrl → ficha interna, solo para productos SIN STOCK.
 * Se calcula una vez por proceso.
 */
let _sinStockPorAfiliado: Map<string, string> | null = null;
function sinStockPorAfiliado(): Map<string, string> {
  if (_sinStockPorAfiliado) return _sinStockPorAfiliado;
  const map = new Map<string, string>();
  for (const p of curatedProducts) {
    if (p.priceStatus === "out_of_stock" && p.affiliateUrl) {
      map.set(p.affiliateUrl, productHref(p));
    }
  }
  _sinStockPorAfiliado = map;
  return map;
}

/**
 * Redirige a la ficha interna los links de afiliado de productos sin stock.
 *
 * `ProductCard` y `ProductDetail` ya hacían esto, pero solo protegían al botón
 * de la tarjeta: un link markdown escrito a mano en una tabla o en prosa
 * apuntaba igual a `meli.la`, o sea a una publicación que el sitio sabe
 * pausada. Se detectó el 2026-08-10, cuando una corrida de precios marcó sin
 * stock a 2 productos que estaban linkeados en la tabla de `perfumes-arabes-dupes`.
 *
 * Se hace acá y no en `inline-markdown.tsx` porque ese archivo es client-safe y
 * no puede importar el catálogo.
 */
function redirigirSinStock(text: string): string {
  const map = sinStockPorAfiliado();
  if (map.size === 0) return text;
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (todo, anchor, href) => {
    const interno = map.get(href);
    return interno ? `[${anchor}](${interno})` : todo;
  });
}

/**
 * Resuelve tokens de precio en vivo (`{{precio:MLA…}}`) y luego parsea el
 * markdown inline (bold + links). Como importa `price-token` (que necesita el
 * catálogo), **este archivo es solo-SERVER**. Desde componentes CLIENT, resolver
 * los precios en el server y usar `renderInlineMarkdown` (inline-markdown.tsx).
 */
export function parseInlineLinks(text: string): React.ReactNode[] {
  const resolved = redirigirSinStock(injectLivePrices(text));
  return renderInlineMarkdown(resolved);
}

/**
 * Para campos de texto plano (JSON-LD, meta tags) que no pueden llevar
 * markup: resuelve precios y despoja `**bold**` / `[texto](url)` a texto
 * plano, sin generar nodos React.
 */
export function toPlainText(text: string): string {
  const resolved = injectLivePrices(text);
  return resolved
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
