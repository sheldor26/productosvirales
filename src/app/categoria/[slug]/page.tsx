import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getVisibleProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.filter((c) => !c.isSpecial).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Categoría no encontrada" };

  const title = category.h1 || category.name;
  const description =
    category.description ||
    `Los mejores productos de ${category.name} en MercadoLibre Argentina.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://productosvirales.com.ar/categoria/${slug}`,
    },
    openGraph: {
      title: `${title} | ProductosVirales`,
      description,
      url: `https://productosvirales.com.ar/categoria/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ProductosVirales`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const visibleProducts = getVisibleProducts();
  const products = visibleProducts.filter((p) => p.categorySlug === slug);

  const relatedCategories = categories.filter(
    (c) => c.slug !== slug && !c.isSpecial
  );

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
                name: category.name,
                item: `https://productosvirales.com.ar/categoria/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* Category hero */}
      <div
        className="rounded-[var(--radius-card)] p-6 md:p-10"
        style={{
          background: category.isSpecial
            ? "linear-gradient(135deg, #fce7f3, #fee2e2)"
            : category.pastel,
        }}
      >
        <h1
          className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {category.h1 || category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-sm md:text-base text-[#111]/60">
            {category.description}
          </p>
        )}
      </div>

      {category.buyersGuide && (
        <section className="max-w-none text-sm text-[var(--text-secondary)] leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-5 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1.5 [&_strong]:text-[var(--text-primary)] [&_strong]:font-semibold">
          <div dangerouslySetInnerHTML={{ __html: category.buyersGuide }} />
        </section>
      )}

      <ProductGrid
        products={products.length > 0 ? products : visibleProducts.slice(0, 8)}
        title={products.length > 0 ? undefined : "Productos destacados"}
        subtitle={products.length === 0 ? "Todavía no hay productos en esta categoría. Mirá estos:" : undefined}
      />

      {/* Related categories */}
      <section>
        <h2
          className="text-lg font-bold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Otras categorías
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="px-4 py-2 text-sm rounded-[var(--radius-pill)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
