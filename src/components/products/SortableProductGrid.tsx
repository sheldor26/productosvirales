"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Scale, ArrowDown } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { ComparisonTable } from "./ComparisonTable";
import { useProductCompare } from "@/lib/use-product-compare";
import { sortProducts, SORT_LABELS, type SortOption } from "@/lib/product-sort";
import { buildPriceBuckets, priceInBucket, type PriceBucket } from "@/lib/price-buckets";
import { buildAvailableSignals, matchesSignals, SIGNAL_LABELS, type SignalFilter } from "@/lib/product-signals";
import { buildAvailableBrands } from "@/lib/product-brands";
import type { CardProduct } from "@/lib/types";

// Categorías grandes (cocina 138, belleza 97, hogar 89) montaban una
// ProductCard por producto de una sola vez — cientos de links/botones/
// observers hidratando de golpe en mobile. Mismo patrón y tamaño de página
// que ya usa HomeFeed.tsx para el feed de la home.
const PAGE_SIZE = 24;

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
  // Ordenar/filtrar categorías grandes (cocina 138, hogar 89) re-filtra y
  // re-ordena el listado entero en la misma tarea del click — en gama media
  // Android (el parque real de esta audiencia) eso es tarea larga que
  // bloquea el hilo principal y empeora INP (caso real: QuintoAndar redujo
  // su INP 80% con el mismo mecanismo, +36% conversión, web.dev/quintoandar-inp).
  // `startTransition` no cambia el resultado, solo le dice a React que el
  // re-render es de baja prioridad: el click en sí sigue respondiendo al
  // toque, y `isPending` se usa abajo para atenuar la grilla mientras recalcula.
  const [isPending, startTransition] = useTransition();

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
    startTransition(() => {
      setActiveSignals((prev) =>
        prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal]
      );
    });
    window.gtag?.("event", "signal_filter_toggle", { signal });
  };

  const [brand, setBrand] = useState<string | null>(null);
  const availableBrands = useMemo(() => buildAvailableBrands(products), [products]);

  const hasActiveFilters = !!priceBucket || activeSignals.length > 0 || !!brand;
  // "Limpiar filtros" desmonta su propia fila al clickearse (hasActiveFilters
  // pasa a false) — sin esto, un lector de pantalla o navegación por teclado
  // pierde el foco al <body> y hay que tabular desde cero para volver a la
  // grilla. Se lo devolvemos al contenedor de resultados, que siempre sigue
  // montado (a diferencia del botón que disparó la acción).
  const resultsRef = useRef<HTMLDivElement>(null);
  function clearFilters() {
    startTransition(() => {
      setPriceBucket(null);
      setActiveSignals([]);
      setBrand(null);
    });
    resultsRef.current?.focus();
    window.gtag?.("event", "clear_filters");
  }

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

  // Volver a la primera página cuando cambia el orden o algún filtro — sin
  // esto, filtrar a pocos resultados con visibleCount alto en 0 productos
  // nuevos que "cargar más". Ajustado durante el render (mismo patrón que
  // HomeFeed.tsx), no un useEffect aparte.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const currentPageKey = `${sort}|${priceBucket?.label ?? ""}|${activeSignals.join(",")}|${brand ?? ""}`;
  const [pageResetKey, setPageResetKey] = useState(currentPageKey);
  if (currentPageKey !== pageResetKey) {
    setPageResetKey(currentPageKey);
    setVisibleCount(PAGE_SIZE);
  }

  // Limpiar la comparación cuando cambia un FILTRO (no el orden: reordenar no
  // saca productos de la vista, así que no debería vaciar la selección).
  // Mismo criterio que ya usa HomeFeed.tsx al cambiar categoría/búsqueda: sin
  // esto, comparás 2 productos, filtrás por precio y la tabla sigue mostrando
  // uno que ya no aparece en la grilla — un "id fantasma".
  const currentFilterKey = `${priceBucket?.label ?? ""}|${activeSignals.join(",")}|${brand ?? ""}`;
  const [compareResetKey, setCompareResetKey] = useState(currentFilterKey);
  if (currentFilterKey !== compareResetKey) {
    setCompareResetKey(currentFilterKey);
    if (compareIds.length > 0) clear();
  }

  const pagedVisible = visible.slice(0, visibleCount);
  const hasMore = visibleCount < visible.length;

  // En categorías largas, la tabla comparativa queda al fondo de la grilla:
  // seleccionar productos arriba solo da como feedback un texto chico, sin
  // forma rápida de llegar a la tabla sin scrollear a ciegas por decenas de
  // productos no seleccionados. El botón flotante se esconde solo si la
  // tabla ya está a la vista (no tiene sentido pedirle que baje a algo que
  // ya está mirando).
  const [comparadorVisible, setComparadorVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById("comparador");
    if (!el) return; // sin tabla montada (menos de 2 seleccionados): nada que observar
    const obs = new IntersectionObserver(([entry]) => setComparadorVisible(entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [compareProducts.length]);

  const showJumpToCompare = compareMode && compareIds.length >= 2 && !comparadorVisible;

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
                    startTransition(() => setSort(next));
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
        <div
          role="group"
          aria-label="Filtrar por precio"
          className="mb-4 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1"
        >
          <button
            type="button"
            onClick={() => startTransition(() => setPriceBucket(null))}
            aria-pressed={!priceBucket}
            className={`snap-start shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
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
                startTransition(() => setPriceBucket(b));
                window.gtag?.("event", "price_filter", { range: b.label });
              }}
              aria-pressed={priceBucket?.label === b.label}
              className={`snap-start shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer whitespace-nowrap ${
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
        <div role="group" aria-label="Filtrar por atributo" className="mb-4 flex items-center gap-2 flex-wrap">
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
        <div
          role="group"
          aria-label="Filtrar por marca"
          className="mb-4 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1"
        >
          <button
            type="button"
            onClick={() => startTransition(() => setBrand(null))}
            aria-pressed={!brand}
            className={`snap-start shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
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
                startTransition(() => setBrand(b));
                window.gtag?.("event", "brand_filter", { brand: b });
              }}
              aria-pressed={brand === b}
              className={`snap-start shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-[var(--radius-pill)] border transition-colors cursor-pointer whitespace-nowrap ${
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

      {hasActiveFilters && (
        <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
          {/* aria-live: combinar precio+señal+marca puede dejar la grilla en
              0 resultados sin ningún aviso más que el vacío visual — esto le
              confirma a quien usa lector de pantalla qué pasó al filtrar. */}
          <p aria-live="polite" className="text-sm text-[var(--text-muted)]">
            {visible.length === 0
              ? "Ningún producto cumple con esos filtros. Probá sacando alguno."
              : `${visible.length} producto${visible.length !== 1 ? "s" : ""} con estos filtros.`}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 text-sm font-medium text-[var(--text-primary)] hover:underline underline-offset-2 cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div
        ref={resultsRef}
        tabIndex={-1}
        className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}
      >
        <ProductGrid
          products={pagedVisible}
          priority={priority}
          compareMode={compareMode}
          compareSelectedIds={compareSelectedIds}
          compareLimitReached={compareLimitReached}
          onCompareToggle={toggleCompare}
        />
      </div>

      {pagedVisible.length > 0 && (
        // aria-live: quien usa lector de pantalla no tiene cómo notar que
        // "Cargar más" trajo resultados nuevos sin este anuncio — y en
        // categorías grandes, nadie sabía si ya había visto todo el catálogo
        // o quedaba la mitad atrás de un botón sin ningún número.
        <p aria-live="polite" className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Mostrando {pagedVisible.length} de {visible.length} productos
        </p>
      )}

      {hasMore && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 text-sm font-medium rounded-[var(--radius-pill)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors cursor-pointer"
          >
            Cargar más productos · quedan {visible.length - pagedVisible.length}
          </button>
        </div>
      )}

      {compareMode && (
        <ComparisonTable products={compareProducts} onRemove={toggleCompare} onClear={clear} />
      )}

      <div
        className={`fixed inset-x-0 bottom-4 z-40 print:hidden flex justify-center px-4 transition-all duration-200 ${
          showJumpToCompare ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showJumpToCompare}
        // Mismo motivo que StickyMobileCta.tsx/StickyBuyBar.tsx: sin inert,
        // el link "Ver comparativa" seguía en el orden de Tab aunque
        // estuviera con opacity-0/pointer-events-none.
        inert={!showJumpToCompare}
      >
        <a
          href="#comparador"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] shadow-lg hover:bg-[var(--cta-hover)] motion-safe:active:scale-95 transition-[background-color,transform]"
        >
          Ver comparativa ({compareIds.length})
          <ArrowDown size={14} />
        </a>
      </div>
    </div>
  );
}
