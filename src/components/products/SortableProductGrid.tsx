"use client";

import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ComparisonTable } from "./ComparisonTable";
import { useProductCompare } from "@/lib/use-product-compare";
import { sortProducts, SORT_LABELS, type SortOption } from "@/lib/product-sort";
import { buildPriceBuckets, priceInBucket, type PriceBucket } from "@/lib/price-buckets";
import { buildAvailableSignals, matchesSignals, SIGNAL_LABELS, type SignalFilter } from "@/lib/product-signals";
import { buildAvailableBrands } from "@/lib/product-brands";
import type { CardProduct } from "@/lib/types";

interface SortableProductGridProps {
  products: CardProduct[];
  title?: string;
  subtitle?: string;
  /** Ver ProductGrid.tsx: false en cualquier instancia que no sea la grilla
   * principal de la página (ej. "Productos similares" de una ficha, cuyo
   * candidato real a LCP es la foto del producto, no esta grilla). */
  priority?: boolean;
}

/** Grilla de productos con orden elegible por el visitante (menor precio,
 * más vendidos, mejor calificados, mayor descuento). El orden por defecto
 * ("Relevancia") es el que ya manda el server, sin cambios. Todo el orden
 * pasa en el cliente sobre los CardProduct ya recibidos — no pide nada nuevo
 * al server ni cambia qué productos están en el HTML inicial (SEO intacto). */
export function SortableProductGrid({ products, title, subtitle, priority = true }: SortableProductGridProps) {
  const [sort, setSort] = useState<SortOption>("relevancia");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  const [priceBucket, setPriceBucket] = useState<PriceBucket | null>(null);
  const priceBuckets = useMemo(
    () => buildPriceBuckets(products.map((p) => p.price)),
    [products]
  );
  const [activeSignals, setActiveSignals] = useState<SignalFilter[]>([]);
  const availableSignals = useMemo(() => buildAvailableSignals(products), [products]);
  const toggleSignal = (signal: SignalFilter) => {
    setActiveSignals((prev) =>
      prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal]
    );
    window.gtag?.("event", "signal_filter_toggle", { signal });
  };

  const [brand, setBrand] = useState<string | null>(null);
  const availableBrands = useMemo(() => buildAvailableBrands(products), [products]);

  const visible = sorted
    .filter((p) => !priceBucket || priceInBucket(p.price, priceBucket))
    .filter((p) => matchesSignals(p, activeSignals))
    .filter((p) => !brand || p.brand === brand);

  const {
    compareMode,
    compareIds,
    compareSelectedIds,
    compareProducts,
    compareLimitReached,
    toggleCompare,
    toggleMode,
    clear,
    COMPARE_MAX,
  } = useProductCompare(products);

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
                onClick={toggleMode}
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

      {priceBuckets.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setPriceBucket(null)}
            className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
              !priceBucket
                ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Todos los precios
          </button>
          {priceBuckets.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => {
                setPriceBucket(b);
                window.gtag?.("event", "price_filter", { range: b.label });
              }}
              className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer whitespace-nowrap ${
                priceBucket?.label === b.label
                  ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      {availableSignals.length > 0 && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {availableSignals.map((signal) => {
            const active = activeSignals.includes(signal);
            return (
              <button
                key={signal}
                type="button"
                onClick={() => toggleSignal(signal)}
                aria-pressed={active}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
                  active
                    ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {SIGNAL_LABELS[signal]}
              </button>
            );
          })}
        </div>
      )}

      {availableBrands.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setBrand(null)}
            className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
              !brand
                ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Todas las marcas
          </button>
          {availableBrands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBrand(b);
                window.gtag?.("event", "brand_filter", { brand: b });
              }}
              className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer whitespace-nowrap ${
                brand === b
                  ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-[var(--cta-bg)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {compareMode && (
        <p className="mb-3 text-xs text-[var(--text-muted)]">
          Tocá el cuadrado de hasta {COMPARE_MAX} productos para verlos lado a lado.
          {compareIds.length > 0 && ` ${compareIds.length} seleccionado${compareIds.length !== 1 ? "s" : ""}.`}
        </p>
      )}

      {(priceBucket || activeSignals.length > 0 || brand) && visible.length === 0 && (
        <p className="mb-3 text-sm text-[var(--text-muted)]">
          Ningún producto cumple con esos filtros. Probá sacando alguno.
        </p>
      )}

      <ProductGrid
        products={visible}
        priority={priority}
        compareMode={compareMode}
        compareSelectedIds={compareSelectedIds}
        compareLimitReached={compareLimitReached}
        onCompareToggle={toggleCompare}
      />

      {compareMode && (
        <ComparisonTable products={compareProducts} onRemove={toggleCompare} onClear={clear} />
      )}
    </div>
  );
}
