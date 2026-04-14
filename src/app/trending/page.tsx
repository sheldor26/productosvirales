import type { Metadata } from "next";
import { getVisibleProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { TrendingBar } from "@/components/feed/TrendingBar";

export const metadata: Metadata = {
  title: "Trending — Lo más buscado en MercadoLibre",
  description:
    "Descubrí los productos que están en tendencia ahora mismo en MercadoLibre Argentina.",
  alternates: {
    canonical: "https://productosvirales.com.ar/trending",
  },
  openGraph: {
    title: "Productos Trending en MercadoLibre Argentina",
    description: "Los productos más buscados y comprados ahora mismo.",
    url: "https://productosvirales.com.ar/trending",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos Trending en MercadoLibre Argentina",
    description: "Los productos más buscados y comprados ahora mismo.",
  },
};

export default function TrendingPage() {
  const trendingProducts = getVisibleProducts()
    .filter((p) => p.badge === "viral" || p.badge === "trending")
    .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: "https://productosvirales.com.ar",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Trending",
                item: "https://productosvirales.com.ar/trending",
              },
            ],
          }),
        }}
      />
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
        <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Actualizamos esta selección todos los días con los productos que más
          se buscan en MercadoLibre Argentina. Usamos datos reales de ventas,
          búsquedas y tendencias de TikTok para mostrarte lo que realmente
          está explotando. Si un producto está acá, es porque miles de personas
          lo están comprando ahora mismo.
        </p>
      </div>

      <TrendingBar />

      <ProductGrid products={trendingProducts} />
    </div>
  );
}
