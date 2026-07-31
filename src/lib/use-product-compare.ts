"use client";

import { useMemo, useState } from "react";
import type { CardProduct } from "@/lib/types";

const COMPARE_MAX = 4;

/** Estado del modo "comparar" (selección de hasta 4 productos + tabla lado a
 * lado). Compartido entre SortableProductGrid (categorías) y HomeFeed
 * (búsqueda interna) para no duplicar la máquina de estados en los dos
 * lugares donde el visitante puede comparar. */
export function useProductCompare(products: CardProduct[]) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const compareSelectedIds = useMemo(() => new Set(compareIds), [compareIds]);
  const compareProducts = useMemo(
    () => compareIds.map((id) => products.find((p) => p.id === id)).filter((p): p is CardProduct => !!p),
    [compareIds, products]
  );

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= COMPARE_MAX) return current;
      const next = [...current, id];
      window.gtag?.("event", "compare_select", { item_id: id, selected_count: next.length });
      return next;
    });
  };

  const toggleMode = () => {
    setCompareMode((v) => {
      const next = !v;
      if (!next) setCompareIds([]);
      window.gtag?.("event", "compare_mode_toggle", { active: next });
      return next;
    });
  };

  const clear = () => setCompareIds([]);

  return {
    compareMode,
    compareIds,
    compareSelectedIds,
    compareProducts,
    compareLimitReached: compareIds.length >= COMPARE_MAX,
    toggleCompare,
    toggleMode,
    clear,
    COMPARE_MAX,
  };
}
