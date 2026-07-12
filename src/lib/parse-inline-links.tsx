import "server-only"; // candado: resuelve precios vía price-token (catálogo); solo-server
import { injectLivePrices } from "@/lib/price-token";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import type React from "react";

/**
 * Resuelve tokens de precio en vivo (`{{precio:MLA…}}`) y luego parsea el
 * markdown inline (bold + links). Como importa `price-token` (que necesita el
 * catálogo), **este archivo es solo-SERVER**. Desde componentes CLIENT, resolver
 * los precios en el server y usar `renderInlineMarkdown` (inline-markdown.tsx).
 */
export function parseInlineLinks(text: string): React.ReactNode[] {
  const resolved = injectLivePrices(text);
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
