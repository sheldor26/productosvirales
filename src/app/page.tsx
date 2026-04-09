"use client";

import { useState, useMemo } from "react";
import { HeroBanner } from "@/components/feed/HeroBanner";
import { CategoryTabs } from "@/components/feed/CategoryTabs";
import { TrendingBar } from "@/components/feed/TrendingBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { WhatsAppCTA } from "@/components/widgets/WhatsAppCTA";
import { PriceAlert } from "@/components/widgets/PriceAlert";
import { curatedProducts } from "@/data/curated-products";

const faqItems = [
  {
    q: "¿Qué es ProductosVirales?",
    a: "Somos un sitio que recopila los productos más virales y trending de MercadoLibre Argentina. Te mostramos lo que todos están comprando, con precios actualizados y enlaces directos.",
  },
  {
    q: "¿Los precios son reales?",
    a: "Sí, todos los precios se obtienen directamente de MercadoLibre Argentina y se actualizan periódicamente. El precio final lo ves al hacer clic en el producto.",
  },
  {
    q: "¿Cómo compro un producto?",
    a: "Hacé clic en el botón de flecha o en \"Ver en MercadoLibre\" y te llevamos directo al producto en ML para que compres con todas las garantías de la plataforma.",
  },
  {
    q: "¿Por qué un producto es \"viral\"?",
    a: "Marcamos como viral a los productos que tienen alto volumen de ventas, están en tendencia en redes sociales (especialmente TikTok) o tienen un crecimiento inusual en búsquedas.",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("viral");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "viral") {
      return curatedProducts.filter((p) => p.badge === "viral");
    }
    return curatedProducts.filter(
      (p) => p.categorySlug === activeCategory
    );
  }, [activeCategory]);

  const weeklyPopular = curatedProducts.slice(0, 8);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-8 md:space-y-10">
      <HeroBanner />

      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <TrendingBar />

      <ProductGrid
        products={filteredProducts.length > 0 ? filteredProducts : curatedProducts.slice(0, 8)}
        title={
          activeCategory === "viral"
            ? "Lo más viral esta semana"
            : `Trending en ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
        }
        subtitle="Los productos que están volando en MercadoLibre"
      />

      <WhatsAppCTA />

      <ProductGrid
        products={weeklyPopular}
        title="Lo más buscado esta semana"
        subtitle="Ofertas que no podés dejar pasar"
      />

      <PriceAlert />

      {/* FAQ */}
      <section>
        <h2
          className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.q}
              className="group rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                {item.q}
                <span className="ml-2 text-[var(--text-muted)] group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
