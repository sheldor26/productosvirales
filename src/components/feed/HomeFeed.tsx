"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getVisibleProducts } from "@/lib/products";

export function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("viral");

  const filteredProducts = useMemo(() => {
    const visible = getVisibleProducts();
    if (activeCategory === "viral") {
      return visible.filter((p) => p.badge === "viral");
    }
    return visible.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory]);

  const fallback = useMemo(() => getVisibleProducts().slice(0, 8), []);

  return (
    <>
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <ProductGrid
        products={filteredProducts.length > 0 ? filteredProducts : fallback}
        title={
          activeCategory === "viral"
            ? "Lo más viral esta semana"
            : `Trending en ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
        }
        subtitle="Los productos que están volando en MercadoLibre"
      />
    </>
  );
}
