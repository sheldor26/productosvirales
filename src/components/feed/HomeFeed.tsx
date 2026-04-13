"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getVisibleProducts } from "@/lib/products";

export function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("todos");

  const allVisible = useMemo(() => getVisibleProducts(), []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "todos") {
      return allVisible;
    }
    if (activeCategory === "viral") {
      return allVisible.filter((p) => p.badge === "viral" || p.badge === "trending");
    }
    return allVisible.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory, allVisible]);

  const titleMap: Record<string, string> = {
    todos: "Todos los productos",
    viral: "Lo más viral y trending",
    hogar: "Hogar",
    cocina: "Cocina",
    tech: "Tech",
    belleza: "Belleza",
    gadgets: "Gadgets",
  };

  return (
    <>
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <ProductGrid
        products={filteredProducts}
        title={titleMap[activeCategory] || activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        subtitle={
          activeCategory === "todos"
            ? "Todo el catálogo de productos virales en MercadoLibre"
            : activeCategory === "viral"
              ? "Los productos que están volando en MercadoLibre"
              : `Los mejores productos de ${titleMap[activeCategory] || activeCategory}`
        }
      />
    </>
  );
}
