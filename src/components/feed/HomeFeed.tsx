"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { curatedProducts } from "@/data/curated-products";

export function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("viral");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "viral") {
      return curatedProducts.filter((p) => p.badge === "viral");
    }
    return curatedProducts.filter(
      (p) => p.categorySlug === activeCategory
    );
  }, [activeCategory]);

  return (
    <>
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <ProductGrid
        products={filteredProducts.length > 0 ? filteredProducts : curatedProducts.slice(0, 8)}
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
