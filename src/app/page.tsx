import { HeroBanner } from "@/components/feed/HeroBanner";
import { TrendingBar } from "@/components/feed/TrendingBar";
import { HomeFeed } from "@/components/feed/HomeFeed";
import { ProductGrid } from "@/components/products/ProductGrid";
import { WhatsAppCTA } from "@/components/widgets/WhatsAppCTA";
import { PriceAlert } from "@/components/widgets/PriceAlert";
import { HomeFAQ } from "@/components/feed/HomeFAQ";
import { getVisibleProducts } from "@/lib/products";

export default async function Home() {
  const weeklyPopular = getVisibleProducts().slice(0, 8);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8">
      <HeroBanner />

      <div className="mt-6 md:mt-8">
        <HomeFeed />
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
