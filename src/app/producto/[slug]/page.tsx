import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { getVisibleProducts, toCardProduct } from "@/lib/products";
import { getPriceValidUntil, parseProductSlug, productHref, productSlug } from "@/lib/product-url";
import { analyzePriceHistory } from "@/lib/price-history";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { nextStepLinksForProduct } from "@/lib/related-guides";
import { baseOpenGraph } from "@/lib/site-og";

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

  const canonical = `https://productosvirales.com.ar${productHref(product)}`;

  return {
    title: { absolute: title },
    description,
    // Fichas deprioritized (ej. listados de reserva sin stock) no se indexan:
    // evitan competir con la ficha activa del mismo producto. Igual se siguen
    // los links (follow) para no perder el traspaso de autoridad interno.
    ...(product.visibility === "deprioritized"
      ? { robots: { index: false, follow: true } }
      : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      ...baseOpenGraph,
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      url: canonical,
      images: [{ url: product.image, alt: product.title }],
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

  // ── JSON-LD structured data ──────────────────────────────────────────
  // Una sola fuente de verdad: los campos canónicos del producto (los que
  // mantiene actualizados `prices:update`) SIEMPRE ganan. Un bloque
  // `structuredData` manual solo puede AGREGAR extras (model, color,
  // countryOfOrigin, releaseDate…) — nunca contradecir precio, nombre,
  // rating ni disponibilidad de la página visible.
  const custom = (product.structuredData || {}) as Record<string, unknown>;
  const customOffers = (custom.offers as Record<string, unknown>) || {};

  // Reseñas: preferimos las curadas en `customerReviews` (con fecha y texto
  // citables). Fallback: un `review[]` manual ya escrito en structuredData.
  const curatedReviews = (product.customerReviews || [])
    .filter((r) => r.text && r.date)
    .map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.country ? `Comprador en ${r.country}` : "Comprador en Argentina",
      },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
    }));

  // aggregateRating solo con datos reales: rating + reviewCount del producto.
  // Fallback a un aggregateRating manual existente (datos reales legacy)
  // mientras la ficha no tenga `reviewCount` cargado. Nunca se inventa.
  const aggregateRating =
    product.rating && product.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.toFixed(1),
          reviewCount: String(product.reviewCount),
          bestRating: "5",
          worstRating: "1",
        }
      : custom.aggregateRating;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    ...custom, // extras primero; los campos canónicos de abajo siempre ganan
    name: product.canonicalName || (custom.name as string) || product.title,
    description: (custom.description as string) || product.description,
    sku: product.id,
    ...(product.mpn ? { mpn: product.mpn } : {}),
    image: custom.image || product.images || product.image,
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : custom.brand
        ? { brand: custom.brand }
        : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(curatedReviews.length > 0
      ? { review: curatedReviews }
      : custom.review
        ? { review: custom.review }
        : {}),
    ...(product.specs && product.specs.length > 0
      ? {
          additionalProperty: product.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      ...customOffers,
      url: product.affiliateUrl,
      priceCurrency: product.currency,
      price: product.price,
      itemCondition:
        customOffers.itemCondition || "https://schema.org/NewCondition",
      availability:
        product.priceStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      priceValidUntil: getPriceValidUntil(product),
      seller: { "@type": "Organization", name: "MercadoLibre Argentina" },
      shippingDetails: customOffers.shippingDetails || {
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
      hasMerchantReturnPolicy: customOffers.hasMerchantReturnPolicy || {
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
                name: product.canonicalName || product.title,
                item: `https://productosvirales.com.ar${productHref(product)}`,
              },
            ],
          }),
        }}
      />

      <ProductDetail
        product={product}
        relatedProducts={explicitRelated}
        priceHistory={analyzePriceHistory(product.id, product.price)}
      />

      <RelatedGuides
        heading="Seguí con la guía completa"
        subtitle="Comparamos este modelo con las mejores alternativas"
        links={nextStepLinksForProduct(product)}
      />

      {related.length > 0 && (
        <ProductGrid
          products={related.map(toCardProduct)}
          title="Productos similares"
          subtitle={`Más productos de ${product.category}`}
        />
      )}

      {otherCategories.length > 0 && (
        <ProductGrid
          products={otherCategories.map(toCardProduct)}
          title="Popular en otras categorías"
        />
      )}
    </div>
  );
}
