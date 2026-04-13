"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getVisibleProducts } from "@/lib/products";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function HomeFeed() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState("todos");

  const allVisible = useMemo(() => getVisibleProducts(), []);

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
