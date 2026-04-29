import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { getVisibleProducts } from "@/lib/products";
import { getPriceValidUntil, parseProductSlug, productHref, productSlug } from "@/lib/product-url";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return curatedProducts
    .filter((p) => p.visibility !== "deprioritized")
    .map((p) => ({ slug: productSlug(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { id } = parseProductSlug(slug);
  if (!id) return { title: "Producto no encontrado" };
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
    alternates: {
      canonical: `https://productosvirales.com.ar${productHref(product)}`,
    },
    openGraph: {
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [product.image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const { id } = parseProductSlug(slug);
  if (!id) notFound();

  const product = curatedProducts.find((p) => p.id === id);
  if (!product) notFound();

  // 308 to canonical when the slug prefix is missing (legacy /producto/MLA…)
  // or stale (title rewritten after the URL was shared).
  const canonical = productSlug(product);
  if (slug !== canonical) {
    permanentRedirect(`/producto/${canonical}`);
  }

  // Explicit cross-links defined on the product (manual interlinking).
  // We resolve these from the full catalog so curated links still work even
  // if the target is deprioritized — explicit > automatic.
  const explicitRelated = (product.relatedProducts || [])
    .map((relId) => curatedProducts.find((p) => p.id === relId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Automatic feeds (same-category + other-categories) exclude deprioritized
  // products so they don't surface in discovery flows.
  const visibleProducts = getVisibleProducts();

  const related = visibleProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const otherCategories = visibleProducts
    .filter((p) => p.categorySlug !== product.categorySlug)
    .slice(0, 4);

  // Build JSON-LD structured data
  const baseData = product.structuredData || {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.category,
    },
    offers: {
      "@type": "Offer",
      url: product.affiliateUrl,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "MercadoLibre Argentina",
      },
    },
  };

  const baseOffers = (baseData as Record<string, unknown>).offers as Record<string, unknown> || {};

  const baseAggregateRating = (baseData as Record<string, unknown>).aggregateRating;

  const jsonLd = {
    ...baseData,
    // Always ensure image is present — custom structuredData entries often omit it
    image: (baseData as Record<string, unknown>).image || product.images || product.image,
    // Add aggregateRating when product has rating data and custom data doesn't already include it
    ...(baseAggregateRating
      ? { aggregateRating: baseAggregateRating }
      : product.rating && product.soldQuantity
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating.toFixed(1),
              reviewCount: String(product.soldQuantity),
            },
          }
        : {}),
    offers: {
      ...baseOffers,
      priceValidUntil: baseOffers.priceValidUntil || getPriceValidUntil(product),
      shippingDetails: baseOffers.shippingDetails || {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
        ...(product.freeShipping && {
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "ARS",
          },
        }),
      },
      hasMerchantReturnPolicy: baseOffers.hasMerchantReturnPolicy || {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "AR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
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
                name: product.category,
                item: `https://productosvirales.com.ar/categoria/${product.categorySlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: `https://productosvirales.com.ar${productHref(product)}`,
              },
            ],
          }),
        }}
      />

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
