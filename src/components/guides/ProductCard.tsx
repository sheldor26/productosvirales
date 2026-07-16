import Link from "next/link";
import { Package } from "lucide-react";
import type { GuideSection, LabelColor } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { CouponBadge } from "@/components/products/CouponBadge";
import { injectLivePrices } from "@/lib/price-token";
import { getPriceValidUntil, productHref } from "@/lib/product-url";
import { Stars } from "./Stars";

interface ProductCardProps {
  section: GuideSection;
}

function inferLabelColor(label: string | undefined): LabelColor {
  if (!label) return "slate";
  const l = label.toLowerCase();
  if (l.includes("elec") || l.includes("nuestra")) return "green";
  if (l.includes("econ") || l.includes("accesible") || l.includes("barata")) return "blue";
  if (l.includes("premium") || l.includes("exigente") || l.includes("elixir") || l.includes("lujo")) return "purple";
  if (l.includes("empezar") || l.includes("primera") || l.includes("principiante")) return "purple";
  return "slate";
}

// Pasteles desaturados / gris. NINGUNO en amarillo/ámbar (el amarillo = solo el botón).
const LABEL_STYLES: Record<LabelColor, { bg: string; fg: string }> = {
  green: { bg: "#DCEAD5", fg: "#1E4F1E" },
  blue: { bg: "#D5E4F0", fg: "#123D6E" },
  amber: { bg: "#EEF1F5", fg: "#4A5568" },
  purple: { bg: "#E5D9EC", fg: "#5A2E75" },
  slate: { bg: "#EEF1F5", fg: "#4A5568" },
};

function SchemaLd({ product }: { product: ReturnType<typeof getProductById> }) {
  if (!product) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.canonicalName || product.title,
          image: product.image,
          ...(product.description ? { description: product.description } : {}),
          ...(product.brand
            ? { brand: { "@type": "Brand", name: product.brand } }
            : {}),
          // aggregateRating SOLO con datos reales (rating + reviewCount del
          // producto). Antes se emitía `reviewCount: 1` fijo: Google renderizaba
          // el snippet como "() reviews" y mataba el CTR. Nunca placeholder.
          ...(product.rating && product.reviewCount
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating.toFixed(1),
                  reviewCount: String(product.reviewCount),
                  bestRating: "5",
                  worstRating: "1",
                },
              }
            : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency || "ARS",
            price: product.price,
            itemCondition: "https://schema.org/NewCondition",
            availability:
              product.priceStatus === "out_of_stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            priceValidUntil: getPriceValidUntil(product),
            url: product.affiliateUrl,
            seller: {
              "@type": "Organization",
              name: "MercadoLibre Argentina",
            },
            shippingDetails: {
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
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "AR",
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 30,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            },
          },
        }),
      }}
    />
  );
}

export function ProductCard({ section }: ProductCardProps) {
  if (!section.productMlaId) return null;
  const product = getProductById(section.productMlaId);
  if (!product) return null;

  const color = section.labelColor || inferLabelColor(section.label);
  const palette = LABEL_STYLES[color];
  const labelText = section.label || (section.ranking ? `#${section.ranking}` : null);
  const variant = section.variant || "default";

  if (variant === "compact") {
    return (
      <aside
        className="not-prose my-4 overflow-hidden rounded-[6px] border bg-[var(--bg-primary)]"
        style={{ borderColor: "var(--border)" }}
        aria-label={product.title}
      >
        <div className="flex items-stretch">
          {/* Imagen → ficha propia (autoridad interna + intención de research).
              El botón amarillo sigue siendo el único CTA de afiliado. */}
          <Link
            href={productHref(product)}
            aria-label={`Ver ficha de ${product.title}`}
            className="shrink-0 w-[100px] sm:w-[120px] flex items-center justify-center p-2"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col gap-1.5 justify-center">
            {labelText && (
              <span
                className="self-start inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-semibold tracking-wider uppercase"
                style={{ backgroundColor: palette.bg, color: palette.fg }}
              >
                {labelText}
              </span>
            )}
            <h4
              className="text-[15px] sm:text-base font-semibold text-[var(--text-primary)] leading-tight truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Link
                href={productHref(product)}
                className="hover:underline underline-offset-2"
              >
                {product.title}
              </Link>
            </h4>
            {section.description && (
              <Link href={productHref(product)} className="block">
                <p className="text-[13px] sm:text-sm text-[var(--text-secondary)] leading-snug line-clamp-2">
                  {injectLivePrices(section.description)}
                </p>
              </Link>
            )}
            {product.includesCase && (
              <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Package size={10} aria-hidden="true" />
                <span>Incluye estuche</span>
              </p>
            )}
            <CouponBadge price={product.price} className="self-start" />
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-cta-location="card"
              className="self-start inline-flex items-center gap-1 mt-1 px-3 py-1.5 text-xs font-extrabold rounded-[var(--radius-button)] transition-transform hover:-translate-y-px"
              style={{
                backgroundColor: "var(--cta-action)",
                color: "var(--cta-action-text)",
                border: "1px solid rgba(0,0,0,.18)",
                boxShadow: "0 3px 10px rgba(180,150,0,.30)",
              }}
            >
              Comprar en MercadoLibre
              <span aria-hidden="true" className="font-extrabold">→</span>
            </a>
          </div>
        </div>
        <SchemaLd product={product} />
      </aside>
    );
  }

  // Default variant
  const price = product.price ? formatPrice(product.price, product.currency) : null;
  const rating = product.rating;

  return (
    <aside
      className="not-prose my-8 overflow-hidden rounded-[6px] border bg-[var(--bg-primary)]"
      style={{ borderColor: "var(--border)" }}
      aria-label={product.title}
    >
      {/* Cinta de premio (award ribbon) — full width, color por labelColor */}
      {(section.label || section.ranking) && (
        <div
          className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold tracking-[0.06em] uppercase"
          style={{ backgroundColor: palette.bg, color: palette.fg, fontFamily: "var(--font-display)" }}
        >
          {section.ranking && (
            <span style={{ opacity: 0.55 }}>N.º {section.ranking}</span>
          )}
          {section.label && <span>{section.label}</span>}
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        {/* Imagen → ficha propia (autoridad interna + intención de research).
            El botón amarillo sigue siendo el único CTA de afiliado. */}
        <Link
          href={productHref(product)}
          aria-label={`Ver ficha de ${product.title}`}
          className="shrink-0 md:w-[200px] aspect-square md:aspect-auto md:h-auto flex items-center justify-center p-3 md:p-5"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain md:max-h-[180px]"
            loading="lazy"
          />
        </Link>

        <div className="flex-1 p-5 md:p-6 flex flex-col gap-3">
          <h4
            className="text-xl md:text-[22px] font-semibold text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Link
              href={productHref(product)}
              className="hover:underline underline-offset-2"
            >
              {product.title}
            </Link>
          </h4>

          {rating && (
            <Link
              href={productHref(product)}
              className="flex w-fit flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-muted)]"
            >
              <Stars rating={rating} />
              <span className="font-medium text-[var(--text-secondary)]">{rating.toFixed(1)}</span>
              {product.reviewCount ? (
                <span>· {product.reviewCount.toLocaleString("es-AR")} calificaciones</span>
              ) : null}
            </Link>
          )}

          {section.description && (
            <Link href={productHref(product)} className="block">
              <p className="text-[15px] md:text-base leading-[1.65] text-[var(--text-secondary)]">
                {injectLivePrices(section.description)}
              </p>
            </Link>
          )}

          {(section.notes?.length || section.longevity || section.projection) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {section.notes?.map((n) => (
                <span
                  key={n}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{ backgroundColor: "var(--editorial-accent-soft)", color: "var(--text-secondary)" }}
                >
                  {n}
                </span>
              ))}
              {section.longevity && (
                <span className="text-xs text-[var(--text-muted)]">
                  Duración: <span className="text-[var(--text-secondary)] font-medium">{section.longevity}</span>
                </span>
              )}
              {section.projection && (
                <span className="text-xs text-[var(--text-muted)]">
                  · Proyección: <span className="text-[var(--text-secondary)] font-medium">{section.projection}</span>
                </span>
              )}
            </div>
          )}

          {product.includesCase && (
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Package size={12} aria-hidden="true" />
              <span>Incluye estuche</span>
            </p>
          )}

          {/* Unidad precio → botón aislada: solo precio + botón, con aire. */}
          <div
            className="mt-2 flex flex-wrap items-center gap-4 rounded-[12px] p-3 md:p-3.5"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {price && (
              <div className="leading-tight">
                <span
                  className="block text-[22px] font-extrabold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {price}
                </span>
                <span className="text-[10.5px] text-[var(--text-muted)]">
                  Precio verificado contra MercadoLibre
                </span>
              </div>
            )}
            <CouponBadge price={product.price} />
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-cta-location="card"
              className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-extrabold rounded-[var(--radius-button)] transition-transform hover:-translate-y-px"
              style={{
                backgroundColor: "var(--cta-action)",
                color: "var(--cta-action-text)",
                border: "1px solid rgba(0,0,0,.18)",
                boxShadow: "0 3px 10px rgba(180,150,0,.30)",
              }}
            >
              Comprar en MercadoLibre
              <span aria-hidden="true" className="font-extrabold">→</span>
            </a>
          </div>
          {/* "Ver ficha" degradado a link gris debajo (no compite con el CTA). */}
          <p className="mt-2 text-[13px]">
            <Link
              href={productHref(product)}
              className="text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              Ver ficha y opiniones
            </Link>
          </p>
        </div>
      </div>
      <SchemaLd product={product} />
    </aside>
  );
}
