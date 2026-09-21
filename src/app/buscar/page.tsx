import Link from "next/link";
import type { Metadata } from "next";
import { getVisibleProducts, toFeedCard } from "@/lib/products";
import { filterBySearch } from "@/lib/utils";
import { SortableProductGrid } from "@/components/products/SortableProductGrid";
import { BuscarSearchBox } from "@/components/search/BuscarSearchBox";
import { CATEGORY_NAV } from "@/data/category-nav";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

// Página de resultados: cambia con cada búsqueda, no aporta contenido único
// para indexar (las guías y categorías ya son la superficie indexable del
// sitio). `follow: true` para que Google siga los links a fichas/guías.
export const metadata: Metadata = {
  title: "Buscar productos",
  description: "Buscá entre los productos curados de ProductosVirales, con filtros de precio, envío y calificación.",
  robots: { index: false, follow: true },
};

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "", categoria = "" } = await searchParams;

  let products = getVisibleProducts().map(toFeedCard);
  if (categoria) {
    products = products.filter((p) => p.categorySlug === categoria);
  }
  if (q) {
    products = filterBySearch(products, q);
  }

  const activeCategoryLabel = CATEGORY_NAV.find((c) => c.slug === categoria)?.label;
  const query = new URLSearchParams();
  if (q) query.set("q", q);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-6">
      <div className="space-y-4">
        <h1
          className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {q ? `Resultados para "${q}"` : "Buscar productos"}
        </h1>
        <BuscarSearchBox categoria={categoria || undefined} />
        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/buscar?${query.toString()}` : "/buscar"}
            className={cn(
              "px-3 py-1.5 text-sm rounded-[var(--radius-pill)] border transition-colors",
              !categoria
                ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-transparent"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            )}
          >
            Todas las categorías
          </Link>
          {CATEGORY_NAV.map((c) => {
            const params = new URLSearchParams(query);
            params.set("categoria", c.slug);
            const active = categoria === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/buscar?${params.toString()}`}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-[var(--radius-pill)] border transition-colors",
                  active
                    ? "bg-[var(--cta-bg)] text-[var(--cta-text)] border-transparent"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>

      {products.length > 0 ? (
        <SortableProductGrid
          products={products}
          subtitle={activeCategoryLabel ? `En ${activeCategoryLabel}` : undefined}
        />
      ) : (
        <div className="py-12 text-center space-y-2">
          <p className="text-[var(--text-primary)] font-medium">
            {q ? `No encontramos nada para "${q}".` : "No hay productos en esta categoría todavía."}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Probá con otra palabra, revisá la ortografía, o mirá{" "}
            <Link href="/categoria/hogar" className="underline hover:text-[var(--text-primary)]">
              nuestras categorías
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
