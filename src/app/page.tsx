import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/feed/HeroBanner";
import { TrendingBar } from "@/components/feed/TrendingBar";
import { HomeFeed } from "@/components/feed/HomeFeed";
import { ProductGrid } from "@/components/products/ProductGrid";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { PriceAlert } from "@/components/widgets/PriceAlert";
import { HomeFAQ } from "@/components/feed/HomeFAQ";
import { getRotatedVisibleProducts, makeRotationSeed, toFeedCard, toCardProduct } from "@/lib/products";

// Metadata estática (sin depender de `searchParams`): así la home entera
// puede cachearse/prerenderizarse (ISR) en vez de renderizarse de cero en
// cada visita. Las URLs de búsqueda (?q=...) usan la misma metadata; como el
// canonical siempre apunta a la home sin query, Google no las trata como
// contenido nuevo a indexar.
export const metadata: Metadata = {
  // `absolute`: con el sufijo del layout raíz este título llegaba a 79
  // caracteres y la SERP lo cortaba a la mitad de la frase.
  title: { absolute: "Productos Virales de MercadoLibre Argentina" },
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

// ISR: la home se regenera cada 10 minutos en vez de en cada visita, y se
// sirve cacheada desde el edge de Vercel entre medio (ver makeRotationSeed).
export const revalidate = 600;

export default function Home() {
  // Semilla por bucket de tiempo (no Math.random): mismo valor durante toda
  // la ventana de revalidación, para que la página sea cacheable.
  const rotationSeed = makeRotationSeed();
  const rotated = getRotatedVisibleProducts(rotationSeed);
  // DTOs chicos: el catálogo se resuelve acá (server) y baja como prop, así
  // HomeFeed (client) no importa `curated-products` ni serializa productos enteros.
  const feedCards = rotated.map(toFeedCard);
  // Saltea los primeros 12 (la primera página del feed de arriba): antes esta
  // sección repetía exactamente los mismos 8 productos que ya se veían al
  // entrar, desperdiciando una segunda oportunidad de descubrimiento.
  const weeklyPopular = rotated.slice(12, 20).map(toCardProduct);

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
            logo: "https://productosvirales.com.ar/icon.png",
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
        {/* Se esconde sola en la primera visita (sin historial todavía) — no
            hay salto de layout que evitar, a diferencia del feed de abajo. */}
        <RecentlyViewed
          title="Volviste — esto viste en este navegador"
          subtitle="No en otros dispositivos ni cuentas: es solo lo que abriste acá."
        />
      </div>

      <div className="mt-6 md:mt-8">
        {/* Fallback con la misma forma que el feed real (grilla de skeletons,
            no un contenedor vacío): evita el salto de layout mientras
            HomeFeed (que lee useSearchParams) hidrata en el cliente. */}
        <Suspense fallback={<ProductGrid products={[]} loading title="Todos los productos" />}>
          <HomeFeed products={feedCards} />
        </Suspense>
      </div>

      <div className="mt-6 md:mt-8">
        <TrendingBar />
      </div>

      <div className="mt-8 md:mt-10">
        <ProductGrid
          products={weeklyPopular}
          title="Lo más buscado esta semana"
          subtitle="Ofertas que no podés dejar pasar"
          priority={false}
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
