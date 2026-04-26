import Link from "next/link";
import { ExternalLink, Package, Star } from "lucide-react";
import type { GuideSection, LabelColor } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { productHref } from "@/lib/product-url";

interface ProductCardProps {
  section: GuideSection;
}

function inferLabelColor(label: string | undefined): LabelColor {
  if (!label) return "amber";
  const l = label.toLowerCase();
  if (l.includes("elec") || l.includes("nuestra")) return "green";
  if (l.includes("econ") || l.includes("accesible") || l.includes("barata")) return "blue";
  if (l.includes("premium") || l.includes("exigente") || l.includes("elixir") || l.includes("lujo")) return "amber";
  if (l.includes("empezar") || l.includes("primera") || l.includes("principiante")) return "purple";
  return "amber";
}

const LABEL_STYLES: Record<LabelColor, { bg: string; fg: string }> = {
  green: { bg: "#DCEAD5", fg: "#1E4F1E" },
  blue: { bg: "#D5E4F0", fg: "#123D6E" },
  amber: { bg: "#F0E4CE", fg: "#7A5620" },
  purple: { bg: "#E5D9EC", fg: "#5A2E75" },
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
          name: product.title,
          image: product.image,
          ...(product.rating
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: 1,
                  bestRating: 5,
                },
              }
            : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency || "ARS",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: product.affiliateUrl,
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
          {/* Image */}
          <div
            className="shrink-0 w-[100px] sm:w-[120px] flex items-center justify-center p-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full max-h-[100px] object-contain"
              loading="lazy"
            />
          </div>

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
              {product.title}
            </h4>
            {section.description && (
              <p className="text-[13px] sm:text-sm text-[var(--text-secondary)] leading-snug line-clamp-2">
                {section.description}
              </p>
            )}
            {product.includesCase && (
              <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Package size={10} aria-hidden="true" />
                <span>Incluye estuche</span>
              </p>
            )}
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="self-start inline-flex items-center gap-1 mt-1 px-3 py-1.5 text-xs font-semibold rounded-full text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--editorial-accent)" }}
            >
              Ver en Mercado Libre
              <ExternalLink size={12} />
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
      <div className="flex flex-col md:flex-row">
        <div
          className="shrink-0 md:w-[200px] aspect-square md:aspect-auto md:h-auto flex items-center justify-center p-5"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full max-h-[180px] object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col gap-3">
          {labelText && (
            <span
              className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase"
              style={{ backgroundColor: palette.bg, color: palette.fg }}
            >
              {labelText}
            </span>
          )}

          <h4
            className="text-xl md:text-[22px] font-semibold text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h4>

          {rating && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <Star size={14} className="fill-current" style={{ color: "var(--editorial-accent)" }} />
              <span className="font-medium text-[var(--text-secondary)]">{rating.toFixed(1)}</span>
              {price && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{price}</span>
                </>
              )}
            </div>
          )}

          {section.description && (
            <p className="text-[15px] md:text-base leading-[1.65] text-[var(--text-secondary)]">
              {section.description}
            </p>
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

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--editorial-accent)" }}
            >
              Ver en Mercado Libre
              <ExternalLink size={14} />
            </a>
            <Link
              href={productHref(product)}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-full border text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              Ficha completa
            </Link>
          </div>
        </div>
      </div>
      <SchemaLd product={product} />
    </aside>
  );
}
