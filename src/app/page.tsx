import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/feed/HeroBanner";
import { TrendingBar } from "@/components/feed/TrendingBar";
import { HomeFeed } from "@/components/feed/HomeFeed";
import { ProductGrid } from "@/components/products/ProductGrid";
import { WhatsAppCTA } from "@/components/widgets/WhatsAppCTA";
import { PriceAlert } from "@/components/widgets/PriceAlert";
import { HomeFAQ } from "@/components/feed/HomeFAQ";
import { getVisibleProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Productos Virales de MercadoLibre Argentina — Lo más trending",
  description:
    "Descubrí los productos más virales y trending de MercadoLibre Argentina. Ofertas, tendencias TikTok y lo que todos están comprando hoy.",
  alternates: {
    canonical: "https://productosvirales.com.ar",
  },
  openGraph: {
    title: "ProductosVirales — Lo más trending de MercadoLibre",
    description: "Los productos que explotan en Internet, actualizados todos los días.",
    url: "https://productosvirales.com.ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductosVirales — Lo más trending de MercadoLibre",
    description: "Los productos que explotan en Internet, actualizados todos los días.",
  },
};

export default async function Home() {
  const weeklyPopular = getVisibleProducts().slice(0, 8);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ProductosVirales",
            url: "https://productosvirales.com.ar",
            logo: "https://productosvirales.com.ar/opengraph-image.png",
            description: "Curador de productos virales y trending de MercadoLibre Argentina",
            sameAs: [],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ProductosVirales",
            url: "https://productosvirales.com.ar",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://productosvirales.com.ar/?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <HeroBanner />

      <div className="mt-6 md:mt-8">
        <Suspense>
          <HomeFeed />
        </Suspense>
      </div>

      <div className="mt-6 md:mt-8">
        <TrendingBar />
      </div>

      <div className="mt-12 md:mt-16">
        <WhatsAppCTA />
      </div>

      <div className="mt-8 md:mt-10">
        <ProductGrid
          products={weeklyPopular}
          title="Lo más buscado esta semana"
          subtitle="Ofertas que no podés dejar pasar"
        />
      </div>

      <div className="mt-12 md:mt-16">
        <PriceAlert />
      </div>

      <div className="mt-10 md:mt-12">
        <HomeFAQ />
      </div>
    </div>
  );
}
