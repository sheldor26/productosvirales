"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getRotatedVisibleProducts } from "@/lib/products";

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
    belleza: "Belleza",
    gadgets: "Gadgets",
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

  return (
    <>
      {!searchQuery.trim() && (
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      <ProductGrid
        products={filteredProducts}
        title={title}
        subtitle={subtitle}
      />
    </>
  );
}
