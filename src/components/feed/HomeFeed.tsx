"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getRotatedVisibleProducts } from "@/lib/products";

const PAGE_SIZE = 12;

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface HomeFeedProps {
  /** Server-generated seed so the feed order varies across loads but stays
   * identical between SSR and client hydration. */
  seed: number;
  /** Query de búsqueda leída en el servidor (desde ?q=). Llega como prop para
   * que el feed se renderice completo en el SSR y no haya salto de layout.
   * Al buscar, el Header hace router.push("/?q=...") y el servidor re-renderiza
   * la página pasando el nuevo valor. */
  initialQuery?: string;
}

export function HomeFeed({ seed, initialQuery = "" }: HomeFeedProps) {
  const searchQuery = initialQuery;

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

  const allVisible = useMemo(() => getRotatedVisibleProducts(seed), [seed]);

  const filteredProducts = useMemo(() => {
    // If there's a search query, filter by it regardless of category
    if (searchQuery.trim()) {
      const q = normalize(searchQuery.trim());
      return allVisible.filter((p) => {
        const haystack = normalize(
          `${p.title} ${p.category} ${p.description || ""} ${p.h1 || ""}`
        );
        // Match all words in the query
        return q.split(/\s+/).every((word) => haystack.includes(word));
      });
    }

    if (activeCategory === "todos") {
      return allVisible;
    }
    if (activeCategory === "viral") {
      return allVisible.filter((p) => p.badge === "viral" || p.badge === "trending");
    }
    return allVisible.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory, allVisible, searchQuery]);

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
