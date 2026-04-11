import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = curatedProducts.find((p) => p.id === id);
  if (!product) return { title: "Producto no encontrado" };

  const title = product.seoTitle || product.title;
  const description =
    product.metaDescription ||
    product.description ||
    `Comprá ${product.title} al mejor precio en MercadoLibre Argentina.`;

  return {
    title,
    description,
    openGraph: {
      title: product.ogTitle || title,
      description:
        product.ogDescription || description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = curatedProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Explicit cross-links defined on the product (manual interlinking)
  const explicitRelated = (product.relatedProducts || [])
    .map((id) => curatedProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const related = curatedProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const otherCategories = curatedProducts
    .filter((p) => p.categorySlug !== product.categorySlug)
    .slice(0, 4);

  // Build JSON-LD structured data
  const jsonLd = product.structuredData || {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      url: product.affiliateUrl,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  // FAQ structured data
  const faqLd =
    product.faq && product.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <ProductDetail product={product} relatedProducts={explicitRelated} />

      {related.length > 0 && (
        <ProductGrid
          products={related}
          title="Productos similares"
          subtitle={`Más productos de ${product.category}`}
        />
      )}

      {otherCategories.length > 0 && (
        <ProductGrid
          products={otherCategories}
          title="Popular en otras categorías"
        />
      )}
    </div>
  );
}
