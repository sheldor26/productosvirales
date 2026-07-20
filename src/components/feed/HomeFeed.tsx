"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { normalizeSearch } from "@/lib/utils";
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

  // Volver a la primera página cuando cambia la categoría o la búsqueda,
  // ajustando el estado durante el render en vez de un useEffect aparte.
  const [pageResetKey, setPageResetKey] = useState(`${activeCategory}|${searchQuery}`);
  const currentKey = `${activeCategory}|${searchQuery}`;
  if (currentKey !== pageResetKey) {
    setPageResetKey(currentKey);
    setVisibleCount(PAGE_SIZE);
  }

  const filteredProducts = useMemo(() => {
    // Búsqueda: matchea todas las palabras contra el haystack precomputado.
    if (searchQuery.trim()) {
      const words = normalizeSearch(searchQuery.trim()).split(/\s+/);
      return products.filter((p) => words.every((word) => p.search.includes(word)));
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

  const pagedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <>
      {!searchQuery.trim() && (
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      <ProductGrid
        products={pagedProducts}
        title={title}
        subtitle={subtitle}
      />

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
