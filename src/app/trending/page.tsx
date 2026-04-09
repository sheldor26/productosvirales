import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { TrendingBar } from "@/components/feed/TrendingBar";

export const metadata: Metadata = {
  title: "Trending — Lo más buscado en MercadoLibre",
  description:
    "Descubrí los productos que están en tendencia ahora mismo en MercadoLibre Argentina.",
};

export default function TrendingPage() {
  const trendingProducts = curatedProducts
    .filter((p) => p.badge === "viral" || p.badge === "trending")
    .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-8">
      <div>
        <h1
          className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Trending en MercadoLibre
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Lo que todos están buscando y comprando ahora mismo
        </p>
      </div>

      <TrendingBar />

      <ProductGrid products={trendingProducts} />
    </div>
  );
}
