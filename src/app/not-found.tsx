import Link from "next/link";
import type { Metadata } from "next";
import {
  Flame,
  Heart,
  Smartphone,
  Home as HomeIcon,
  ChefHat,
  Gamepad2,
  Headphones,
  Thermometer,
  HeartPulse,
  Shield,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { NotFoundSearchHint } from "@/components/layout/NotFoundSearchHint";
import { getVisibleProducts, toCardProduct } from "@/lib/products";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  viral: Flame,
  hogar: HomeIcon,
  cocina: ChefHat,
  tech: Smartphone,
  gaming: Gamepad2,
  audio: Headphones,
  belleza: Heart,
  climatizacion: Thermometer,
  "salud-bienestar": HeartPulse,
  seguridad: Shield,
  coleccionables: Trophy,
};

export default function NotFound() {
  const popular = getVisibleProducts().slice(0, 8).map(toCardProduct);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="text-center max-w-lg mx-auto">
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          ERROR 404
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
          No encontramos esta página
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          El link puede estar roto o el producto ya no está disponible. Mientras
          tanto, mirá algo de esto:
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}
          >
            Volver al inicio
          </Link>
          <Link
            href="/guias"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
          >
            Ver todas las guías
          </Link>
          <NotFoundSearchHint />
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <p className="text-[11px] font-semibold tracking-[0.14em] mb-4 text-center" style={{ color: "var(--editorial-accent)" }}>
          CATEGORÍAS
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? HomeIcon;
            return (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[var(--radius-pill)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
              >
                <Icon size={14} />
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <ProductGrid
          products={popular}
          title="Lo más buscado"
          subtitle="Por si te sirve mientras encontrás lo que buscabas"
        />
      </div>
    </div>
  );
}
