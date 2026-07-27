import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { getVisibleProducts, toCardProduct } from "@/lib/products";
import { getPriceValidUntil, parseProductSlug, productHref, productSlug } from "@/lib/product-url";
import { analyzePriceHistory } from "@/lib/price-history";
import { injectLivePrices } from "@/lib/price-token";
import { ProductDetail } from "@/components/products/ProductDetail";
import { PriceAlert } from "@/components/widgets/PriceAlert";
import { ProductGrid } from "@/components/products/ProductGrid";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { nextStepLinksForProduct } from "@/lib/related-guides";
import { baseOpenGraph } from "@/lib/site-og";
import { toPlainText } from "@/lib/parse-inline-links";

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
  const description = toPlainText(
    product.metaDescription ||
      product.description ||
      `Comprá ${product.title} al mejor precio en MercadoLibre Argentina.`
  );

  const canonical = `https://productosvirales.com.ar${productHref(product)}`;
  const ogImage = `${canonical}/opengraph-image`;

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [ogImage],
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

  // Resolvemos los tokens de precio {{precio:…}} ACÁ (server) para pasarle a
  // ProductDetail (client) el texto ya resuelto. Así ese componente usa un
  // parser de markdown client-safe y NO arrastra el catálogo (~4 MB) al bundle.
  const detailProduct = {
    ...product,
    articleBody: product.articleBody ? injectLivePrices(product.articleBody) : product.articleBody,
    faq: product.faq?.map((f) => ({ ...f, answer: injectLivePrices(f.answer) })),
    description: product.description ? injectLivePrices(product.description) : product.description,
    verdict: product.verdict ? injectLivePrices(product.verdict) : product.verdict,
    pros: product.pros?.map((p) => injectLivePrices(p)),
    cons: product.cons?.map((c) => injectLivePrices(c)),
  };

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
  // Usamos el faq con tokens ya resueltos (detailProduct) para que el JSON-LD
  // sea consistente con lo visible y no filtre un {{precio}} crudo al structured data.
  const faqLd =
    detailProduct.faq && detailProduct.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: detailProduct.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: toPlainText(item.answer),
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
        product={detailProduct}
        relatedProducts={explicitRelated}
        priceHistory={analyzePriceHistory(product.id, product.price)}
      />

      {product.priceStatus === "out_of_stock" && (
        <PriceAlert
          productId={product.id}
          title="¿Sin stock? Te avisamos cuando vuelva"
          subtitle="Dejanos tu mail y te escribimos si este producto vuelve al stock o baja de precio."
          ctaLabel="Avisame"
          doneLabel="¡Listo! Te avisamos apenas vuelva o baje de precio."
        />
      )}

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
