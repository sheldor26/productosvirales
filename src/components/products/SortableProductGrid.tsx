"use client";

import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ComparisonTable } from "./ComparisonTable";
import type { CardProduct } from "@/lib/types";

const COMPARE_MAX = 4;

type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "descuento" | "rating" | "vendidos";

const SORT_LABELS: Record<SortOption, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  descuento: "Mayor descuento",
  rating: "Mejor calificados",
  vendidos: "Más vendidos",
};

function discountPct(p: CardProduct): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return (p.originalPrice - p.price) / p.originalPrice;
}

function sortProducts(products: CardProduct[], sort: SortOption): CardProduct[] {
  if (sort === "relevancia") return products;
  const sorted = [...products];
  switch (sort) {
    case "precio-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "descuento":
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
      break;
    case "rating":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "vendidos":
      sorted.sort((a, b) => (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0));
      break;
  }
  return sorted;
}

interface SortableProductGridProps {
  products: CardProduct[];
  title?: string;
  subtitle?: string;
}

/** Grilla de productos con orden elegible por el visitante (menor precio,
 * más vendidos, mejor calificados, mayor descuento). El orden por defecto
 * ("Relevancia") es el que ya manda el server, sin cambios. Todo el orden
 * pasa en el cliente sobre los CardProduct ya recibidos — no pide nada nuevo
 * al server ni cambia qué productos están en el HTML inicial (SEO intacto). */
export function SortableProductGrid({ products, title, subtitle }: SortableProductGridProps) {
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  const compareSelectedIds = useMemo(() => new Set(compareIds), [compareIds]);
  const compareProducts = useMemo(
    () => compareIds.map((id) => products.find((p) => p.id === id)).filter((p): p is CardProduct => !!p),
    [compareIds, products]
  );

  const handleCompareToggle = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= COMPARE_MAX) return current;
      const next = [...current, id];
      window.gtag?.("event", "compare_select", { item_id: id, selected_count: next.length });
      return next;
    });
  };

  const toggleCompareMode = () => {
    setCompareMode((v) => {
      const next = !v;
      if (!next) setCompareIds([]);
      window.gtag?.("event", "compare_mode_toggle", { active: next });
      return next;
    });
  };

  return (
    <div>
      {(title || products.length > 1) && (
        <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
          <div>
            {title && (
              <h2
                className="text-xl md:text-2xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
          {products.length > 1 && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={toggleCompareMode}
                aria-pressed={compareMode}
                className={`flex items-center gap-1.5 text-sm font-medium rounded-[var(--radius-pill)] border px-3.5 py-1.5 transition-colors cursor-pointer ${
                  compareMode
                    ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <Scale size={14} />
                {compareMode ? "Comparando" : "Comparar"}
              </button>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] shrink-0">
                Ordenar por
                <select
                  value={sort}
                  onChange={(e) => {
                    const next = e.target.value as SortOption;
                    setSort(next);
                    window.gtag?.("event", "sort_products", { sort: next });
                  }}
                  className="rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] px-3 py-1.5 text-sm cursor-pointer"
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      )}

      {compareMode && (
        <p className="mb-3 text-xs text-[var(--text-muted)]">
          Tocá el cuadrado de hasta {COMPARE_MAX} productos para verlos lado a lado.
          {compareIds.length > 0 && ` ${compareIds.length} seleccionado${compareIds.length !== 1 ? "s" : ""}.`}
        </p>
      )}

      <ProductGrid
        products={sorted}
        compareMode={compareMode}
        compareSelectedIds={compareSelectedIds}
        compareLimitReached={compareIds.length >= COMPARE_MAX}
        onCompareToggle={handleCompareToggle}
      />

      {compareMode && (
        <ComparisonTable
          products={compareProducts}
          onRemove={handleCompareToggle}
          onClear={() => setCompareIds([])}
        />
      )}
    </div>
  );
}
