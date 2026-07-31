"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import type { CardProduct } from "@/lib/types";

interface RecentlyViewedProps {
  /** Ficha actual: se excluye de su propio historial. */
  excludeId: string;
}

/** Fila discreta de las últimas fichas vistas (retención pasiva y honesta,
 * sin cuenta ni push): "cuál era ese producto que había visto". Se esconde
 * sola si no hay historial (visita nueva, localStorage limpio, o el único
 * ítem del historial es la ficha actual). */
export function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
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

  return <ProductGrid products={products} title="Vistos recientemente" />;
}
