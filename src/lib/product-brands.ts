import type { CardProduct } from "@/lib/types";

/** Marcas reales presentes en el listado actual, ordenadas de más a menos
 * frecuente. El campo `brand` no está cargado parejo en todo el catálogo
 * (fuerte en belleza/perfumes, casi ausente en varias categorías) — por
 * eso se arma siempre desde los productos que se están mostrando, nunca
 * de una lista fija, y si hay menos de 2 marcas reales no tiene sentido
 * mostrar el filtro (misma regla que ya usan price-buckets y señales). */
export function buildAvailableBrands(products: CardProduct[]): string[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    if (!p.brand) continue;
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  const brands = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([brand]) => brand);
  return brands.length > 1 ? brands : [];
}
