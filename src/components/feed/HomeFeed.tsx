"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchX, Scale } from "lucide-react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ComparisonTable } from "@/components/products/ComparisonTable";
import { normalizeSearch, fuzzyWordMatch } from "@/lib/utils";
import { sortProducts, SORT_LABELS, type SortOption } from "@/lib/product-sort";
import { useProductCompare } from "@/lib/use-product-compare";
import { categories } from "@/data/categories";
import type { CardProduct } from "@/lib/types";

const PAGE_SIZE = 12;

/** Igual que el `FeedCard` de products.ts (CardProduct + haystack). Se define
 * acá para NO importar nada de `@/lib/products` desde el cliente (ese módulo
 * importa el catálogo entero). `@/lib/types` es solo tipos, no pesa. */
interface FeedCard extends CardProduct {
  search: string;
}

interface HomeFeedProps {
  /** Catálogo ya rotado y recortado a DTOs por el servidor (ver page.tsx). Llega
   * como prop para que el feed se renderice completo en el SSR (sin salto de
   * layout / CLS) y, sobre todo, para que el cliente NO importe `curated-products`
   * (evita mandar el catálogo entero, ~4 MB, al bundle del navegador). */
  products: FeedCard[];
}

export function HomeFeed({ products }: HomeFeedProps) {
  // Leído acá (client, dentro del <Suspense> de page.tsx) en vez de vía prop
  // del servidor: así page.tsx no depende de `searchParams` y la home entera
  // puede cachearse/prerenderizarse en vez de renderizarse de cero en cada visita.
  // Al buscar, el Header hace router.push("/?q=...") y esto reacciona solo.
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() || "";

  const [activeCategory, setActiveCategory] = useState("todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [pageResetKey, setPageResetKey] = useState(`${activeCategory}|${searchQuery}`);

  const filteredProducts = useMemo(() => {
    // Búsqueda: matchea todas las palabras contra el haystack precomputado.
    if (searchQuery.trim()) {
      const words = normalizeSearch(searchQuery.trim()).split(/\s+/);
      const exact = products.filter((p) => words.every((word) => p.search.includes(word)));
      if (exact.length > 0) return exact;
      // Sin resultados exactos: reintentar tolerando errores de tipeo chicos
      // (ej. "microondaz") en vez de mostrar la búsqueda vacía directo.
      return products.filter((p) => {
        const haystackWords = p.search.split(/\s+/);
        return words.every((word) => fuzzyWordMatch(word, haystackWords));
      });
    }

    if (activeCategory === "todos") {
      return products;
    }
    if (activeCategory === "viral") {
      return products.filter((p) => p.badge === "viral" || p.badge === "trending");
    }
    return products.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory, products, searchQuery]);

  const titleMap: Record<string, string> = {
    todos: "Todos los productos",
    viral: "Lo más viral y trending",
    hogar: "Hogar",
    cocina: "Cocina",
    tech: "Tech",
    gaming: "Gaming",
    audio: "Audio y Auriculares",
    belleza: "Belleza",
  };

  const title = searchQuery.trim()
    ? `Resultados para "${searchQuery}"`
    : titleMap[activeCategory] || activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  const subtitle = searchQuery.trim()
    ? `${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""} encontrado${filteredProducts.length !== 1 ? "s" : ""}`
    : activeCategory === "todos"
      ? "Todo el catálogo de productos virales en MercadoLibre"
      : activeCategory === "viral"
        ? "Los productos que están volando en MercadoLibre"
        : `Los mejores productos de ${titleMap[activeCategory] || activeCategory}`;

  // Orden solo tiene UI en modo búsqueda (ver más abajo); en modo categoría
  // "relevancia" es un no-op de sortProducts, así que esto no cambia nada
  // fuera de la búsqueda.
  const sortedProducts = useMemo(() => sortProducts(filteredProducts, sort), [filteredProducts, sort]);
  const pagedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;
  const noSearchResults = searchQuery.trim().length > 0 && filteredProducts.length === 0;
  const isSearching = searchQuery.trim().length > 0;
  // El toolbar de ordenar/comparar (con su propio título) solo tiene sentido
  // con 2+ resultados; con 0 o 1 no hay nada que ordenar ni comparar, así que
  // ProductGrid vuelve a mostrar su título por defecto.
  const showSearchToolbar = isSearching && filteredProducts.length > 1;

  const {
    compareMode,
    compareIds,
    compareSelectedIds,
    compareProducts,
    compareLimitReached,
    toggleCompare,
    toggleMode: toggleCompareMode,
    clear: clearCompare,
    COMPARE_MAX,
  } = useProductCompare(sortedProducts);

  // Volver a la primera página, resetear orden y limpiar la comparación
  // cuando cambia la categoría o la búsqueda — sin esto, una selección de
  // "comparar" de una búsqueda vieja quedaría con ids fantasma en la nueva.
  // Ajustado durante el render en vez de un useEffect aparte.
  const currentKey = `${activeCategory}|${searchQuery}`;
  if (currentKey !== pageResetKey) {
    setPageResetKey(currentKey);
    setVisibleCount(PAGE_SIZE);
    setSort("relevancia");
    clearCompare();
  }

  useEffect(() => {
    if (noSearchResults) {
      // Truncado: solo lo necesario para agrupar términos, no texto libre largo.
      window.gtag?.("event", "search_no_results", {
        query: searchQuery.trim().slice(0, 60),
      });
    }
  }, [noSearchResults, searchQuery]);

  return (
    <>
      {!searchQuery.trim() && (
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {noSearchResults ? (
        <div className="py-12 text-center">
          <SearchX size={28} className="mx-auto text-[var(--text-muted)]" />
          <h2
            className="mt-3 text-lg font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No encontramos nada para &quot;{searchQuery}&quot;
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Probá con otra palabra, o mirá alguna de estas categorías.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {categories
              .filter((c) => !c.isSpecial)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/categoria/${c.slug}`}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-pill)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
          <Link
            href="/"
            className="inline-block mt-5 text-sm font-semibold underline decoration-[var(--border)] underline-offset-2"
          >
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <>
          {showSearchToolbar && (
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
                {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
              </div>
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
                      setVisibleCount(PAGE_SIZE);
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
            </div>
          )}

          {showSearchToolbar && compareMode && (
            <p className="mb-3 text-xs text-[var(--text-muted)]">
              Tocá el cuadrado de hasta {COMPARE_MAX} productos para verlos lado a lado.
              {compareIds.length > 0 && ` ${compareIds.length} seleccionado${compareIds.length !== 1 ? "s" : ""}.`}
            </p>
          )}

          <ProductGrid
            products={pagedProducts}
            title={showSearchToolbar ? undefined : title}
            subtitle={showSearchToolbar ? undefined : subtitle}
            compareMode={showSearchToolbar && compareMode}
            compareSelectedIds={compareSelectedIds}
            compareLimitReached={compareLimitReached}
            onCompareToggle={toggleCompare}
          />

          {showSearchToolbar && compareMode && (
            <ComparisonTable products={compareProducts} onRemove={toggleCompare} onClear={clearCompare} />
          )}
        </>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 text-sm font-medium rounded-[var(--radius-pill)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors cursor-pointer"
          >
            Cargar más productos
          </button>
        </div>
      )}
    </>
  );
}
