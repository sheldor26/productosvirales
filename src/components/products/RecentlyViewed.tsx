"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import type { CardProduct } from "@/lib/types";

interface RecentlyViewedProps {
  /** Ficha actual: se excluye de su propio historial. Opcional — en
   * contextos sin "producto actual" (ej. el vacío de /guardados) se omite. */
  excludeId?: string;
  /** Categoría de la página actual, si la hay (ficha). Si el patrón de
   * navegación detectado coincide con esta categoría, no se muestra el
   * aviso — ya está viendo exactamente eso, sería redundante. */
  currentCategorySlug?: string;
  /** Override de título/subtítulo por contexto (ej. la home usa un copy de
   * "volviste" más explícito sobre el mecanismo — ver page.tsx). Default
   * genérico para el resto de los usos (ficha, /guardados vacío). */
  title?: string;
  subtitle?: string;
}

/** Categoría que se repite en el historial reciente, si hay 2 o más vistos
 * de la misma. Transparente a propósito (dice literalmente "viste X"), sin
 * inferir nada más (precio, intención) que no se pueda mostrar en texto
 * llano — la personalización oculta genera más desconfianza que conversión
 * (evidencia de NN/g). */
function detectCategoryPattern(products: CardProduct[]) {
  const counts = new Map<string, { name: string; count: number }>();
  for (const p of products) {
    const entry = counts.get(p.categorySlug) ?? { name: p.category, count: 0 };
    entry.count += 1;
    counts.set(p.categorySlug, entry);
  }
  let top: { slug: string; name: string; count: number } | null = null;
  for (const [slug, { name, count }] of counts) {
    if (!top || count > top.count) top = { slug, name, count };
  }
  return top && top.count >= 2 ? top : null;
}

/** Fila discreta de las últimas fichas vistas (retención pasiva y honesta,
 * sin cuenta ni push): "cuál era ese producto que había visto". Se esconde
 * sola si no hay historial (visita nueva, localStorage limpio, o el único
 * ítem del historial es la ficha actual). */
export function RecentlyViewed({
  excludeId,
  currentCategorySlug,
  title = "Vistos recientemente",
  subtitle,
}: RecentlyViewedProps) {
  const { ids } = useRecentlyViewed();
  const [products, setProducts] = useState<CardProduct[]>([]);
  const idsKey = ids.filter((id) => id !== excludeId).join(",");

  useEffect(() => {
    if (!idsKey) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/saved-products?ids=${encodeURIComponent(idsKey)}`)
      .then((res) => res.json())
      .then((data: CardProduct[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  if (products.length === 0) return null;

  const pattern = detectCategoryPattern(products);
  const showPattern = pattern && pattern.slug !== currentCategorySlug;

  return (
    <div>
      {showPattern && (
        <Link
          href={`/categoria/${pattern.slug}`}
          className="inline-block mb-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Estuviste mirando {pattern.name} —{" "}
          <span className="font-semibold underline decoration-[var(--border)] underline-offset-2">
            ver todos los modelos
          </span>
        </Link>
      )}
      <ProductGrid products={products} title={title} subtitle={subtitle} priority={false} />
    </div>
  );
}
