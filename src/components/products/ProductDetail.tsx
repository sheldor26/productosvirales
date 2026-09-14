"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Estrellas + puntaje + conteo. Si la ficha tiene reseñas curadas, todo eso
 * lleva a la sección de opiniones: es el gesto por defecto en cualquier ficha
 * de producto y acá no hacía nada. Sin reseñas curadas queda como estaba. */
function RatingLink({ enlazar, children }: { enlazar: boolean; children: ReactNode }) {
  if (!enlazar) return <>{children}</>;
  return (
    <a
      href="#ficha-opiniones"
      className="inline-flex flex-wrap items-center gap-2 hover:underline underline-offset-2"
    >
      {children}
    </a>
  );
}
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Truck,
  Shield,
  Check,
  X,
  Star,
  AlertTriangle,
  Heart,
  TrendingDown,
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "./ProductGallery";
import { StickyMobileCta } from "./StickyMobileCta";
import { RecentlyViewed } from "./RecentlyViewed";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSavedProducts } from "@/lib/use-saved-products";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { productHref } from "@/lib/product-url";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { CouponBadge } from "./CouponBadge";
import { ShareButtons } from "@/components/widgets/ShareButtons";
import type { Product } from "@/lib/types";
import type { PriceChartData } from "@/lib/price-history";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
  priceHistory?: PriceChartData | null;
  /** Si hay 2+ alternativas disponibles promovidas más abajo en la página
   * (ver page.tsx). Decide a dónde apunta el CTA interno cuando no hay
   * stock: a las alternativas si existen, si no directo al "avisame". */
  hasAlternatives?: boolean;
}

/** "79.59%" → 79.59, "70%+" → 70, "~15%" → 15. Ante cualquier formato raro,
 * 0 en vez de romper el render — la barra simplemente no se ve, no rompe. */
function parseRatingPercent(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

const RATING_BREAKDOWN_ROWS = [
  { key: "five", stars: 5 },
  { key: "four", stars: 4 },
  { key: "three", stars: 3 },
  { key: "two", stars: 2 },
  { key: "one", stars: 1 },
] as const;

/** Distribución real de estrellas (% por MercadoLibre), a escala absoluta
 * 0-100 — nunca normalizada al valor más alto, que distorsiona la lectura
 * de las demás barras (evidencia citada: Mousavi et al., Journal of
 * Consumer Research). Colapsada por default (<details>): la evidencia dice
 * que sumar señales de confianza nuevas arriba de las 5 que ya existen
 * (rating, reviews, ventas, mínimo histórico, descuento) puede EMPEORAR la
 * conversión por saturación — así que esto se integra al bloque de rating
 * existente en vez de agregar una sección nueva siempre visible. */
function RatingBreakdown({ breakdown }: { breakdown: NonNullable<Product["ratingBreakdown"]> }) {
  const rows = RATING_BREAKDOWN_ROWS.map((r) => ({ ...r, value: breakdown[r.key] })).filter(
    (r) => r.value
  );
  if (rows.length === 0) return null;
  return (
    <details className="mt-1.5">
      <summary className="cursor-pointer text-xs text-[var(--text-secondary)] underline decoration-[var(--border)] underline-offset-2 w-fit">
        Ver distribución de calificaciones
      </summary>
      <div className="mt-2 space-y-1 max-w-[240px]">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-2 text-[11px]">
            <span className="w-5 text-[var(--text-muted)]">{r.stars}★</span>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#f59e0b]"
                style={{ width: `${parseRatingPercent(r.value!)}%` }}
              />
            </div>
            <span className="w-12 text-right text-[var(--text-muted)]">{r.value}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

/** Estrellas de calificación (ámbar). Rellenas según round(rating). */
function RatingStars({ rating, size = 15 }: { rating: number; size?: number }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className="text-[#f59e0b]"
          fill={i < filled ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/** Atajos a la evidencia que ya está más abajo en la ficha (pros/contras,
 * comparativa, opiniones, specs, FAQ), debajo del CTA — nunca arriba/al
 * lado, para no competir con la acción principal (mitigación de riesgo,
 * ronda 42). Cada link solo aparece si esa sección realmente existe para
 * este producto, mismo criterio que ya usa cada SectionCard para
 * mostrarse u ocultarse. */
function DecisionNav({ product, hasRelated }: { product: Product; hasRelated: boolean }) {
  const items = [
    (product.pros || product.cons) && { href: "#ficha-pros-contras", label: "A favor y en contra" },
    hasRelated && { href: "#ficha-comparar", label: "Comparar" },
    product.customerReviews && product.customerReviews.length > 0 && {
      href: "#ficha-opiniones",
      label: "Opiniones",
    },
    product.specs && product.specs.length > 0 && { href: "#ficha-specs", label: "Ficha técnica" },
    product.faq && product.faq.length > 0 && { href: "#ficha-faq", label: "Preguntas frecuentes" },
  ].filter((x): x is { href: string; label: string } => !!x);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Ir directo a" className="mt-3 flex flex-wrap justify-center gap-1.5">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="px-2.5 py-1 text-[11px] font-medium rounded-[var(--radius-pill)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/** Tarjeta de sección con etiqueta (kicker) y título, estilo embudo. */
function SectionCard({
  kicker,
  title,
  className = "",
  id,
  children,
}: {
  kicker?: string;
  title?: string;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mt-8 max-w-3xl mx-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] p-5 md:p-6 scroll-mt-20 ${className}`}
      style={{ opacity: 0 }}
    >
      {kicker && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#3483fa] mb-1">
          {kicker}
        </p>
      )}
      {title && (
        <h2
          className="text-lg font-bold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function updatedLabel(product: Product): string | null {
  const raw =
    product.priceUpdated || product.priceLastChecked || product.reviewsSampledAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Especificaciones cortas y "titulares" para mostrar como mosaicos. */
function pickTileSpecs(product: Product) {
  const preferred = [
    "potencia",
    "capacidad",
    "velocidad",
    "voltaje",
    "peso",
    "bar",
    "frecuencia",
    "resolución",
    "pantalla",
    "litro",
  ];
  const rank = (label: string) => {
    const l = label.toLowerCase();
    const i = preferred.findIndex((p) => l.includes(p));
    return i === -1 ? 99 : i;
  };
  return [...(product.specs || [])]
    .filter((s) => {
      const v = s.value.trim();
      return v.length >= 2 && v.length <= 14 && !/^(s[ií]|no)$/i.test(v);
    })
    .sort((a, b) => rank(a.label) - rank(b.label))
    .slice(0, 4);
}

/**
 * Separa del articleBody la sección "¿Para quién es…?" para mostrarla como
 * dos tarjetas (sí / no). Si no encuentra los marcadores, deja el bloque en
 * el artículo (fallback seguro).
 */
function parseArticle(articleBody?: string): {
  blocks: string[];
  paraYes?: string;
  paraNo?: string;
} {
  if (!articleBody) return { blocks: [] };
  const raw = articleBody.split("\n\n");
  const blocks: string[] = [];
  let paraYes: string | undefined;
  let paraNo: string | undefined;

  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    if (b.startsWith("## ") && /para qui[eé]n/i.test(b) && !paraYes && !paraNo) {
      const seg: string[] = [];
      let j = i + 1;
      while (j < raw.length && !raw[j].startsWith("## ")) {
        seg.push(raw[j]);
        j++;
      }
      const segText = seg.join(" ");
      if (/no es para (vos|ti)/i.test(segText)) {
        const parts = segText.split(/no es para (?:vos|ti) si:?/i);
        const yesPart = parts[0].replace(/.*es para (?:vos|ti) si:?/i, "").trim();
        paraYes = yesPart || undefined;
        paraNo = parts[1] ? parts[1].trim() : undefined;
        i = j - 1;
        continue;
      }
    }
    blocks.push(b);
  }
  return { blocks, paraYes, paraNo };
}

export function ProductDetail({
  product,
  relatedProducts = [],
  priceHistory,
  hasAlternatives = false,
}: ProductDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : null;

  const updated = updatedLabel(product);
  const fewReviews =
    typeof product.reviewCount === "number" && product.reviewCount < 50;
  const tileSpecs = pickTileSpecs(product);
  const { blocks: articleBlocks, paraYes, paraNo } = parseArticle(product.articleBody);

  const { record } = useRecentlyViewed();
  useEffect(() => {
    record(product.id);
  }, [product.id, record]);

  const { isSaved, toggle } = useSavedProducts();
  const saved = isSaved(product.id);

  useGSAP(() => {
    // .detail-image y .detail-info (galería + buy box) quedan afuera: son el
    // contenido LCP de la página y se pintan de una en el SSR. Ocultarlos
    // hasta que GSAP hidrate y corra retrasaba el LCP real (imagen/H1 recién
    // visibles después de descargar+ejecutar la librería).
    const selector =
      ".detail-proscons, .detail-pricehistory, .detail-related, .detail-parawhom, .detail-article, .detail-reviews, .detail-specs, .detail-faq, .detail-cta-band";

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // El SSR pinta estos bloques con opacity:0 (espacio reservado, sin CLS).
      gsap.set(selector, { opacity: 1 });
      const tl = gsap.timeline({ defaults: { opacity: 0, y: 20, duration: 0.4, ease: "power2.out" } });
      tl.from(".detail-pricehistory", {}, 0)
        .from(".detail-proscons", {}, "-=0.05")
        .from(".detail-related", {}, "-=0.05")
        .from(".detail-parawhom", {}, "-=0.05")
        .from(".detail-article", {}, "-=0.05")
        .from(".detail-reviews", {}, "-=0.05")
        .from(".detail-specs", {}, "-=0.05")
        .from(".detail-faq", {}, "-=0.05")
        .from(".detail-cta-band", {}, "-=0.05");
      tl.set(selector, { clearProps: "opacity,transform" });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(selector, { opacity: 1, y: 0, x: 0 });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)] underline underline-offset-2 decoration-dotted decoration-[var(--text-muted)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={13} className="text-[var(--text-muted)] shrink-0" />
        <Link
          href={`/categoria/${product.categorySlug}`}
          className="hover:text-[var(--text-primary)] underline underline-offset-2 decoration-dotted decoration-[var(--text-muted)] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={13} className="text-[var(--text-muted)] shrink-0" />
        <span className="text-[var(--text-muted)] truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Image gallery */}
        <div className="detail-image">
          <ProductGallery product={product} />
        </div>

        {/* Right: Buy box */}
        <div className="detail-info flex flex-col">
          <Link
            href={`/categoria/${product.categorySlug}`}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-2"
          >
            {product.category}
          </Link>

          <h1
            className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.h1 || product.title}
          </h1>

          {/* Byline / E-E-A-T */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[var(--text-muted)]">
              Por <span className="font-semibold text-[var(--text-secondary)]">ProductosVirales</span>
              {updated && <> · Actualizado {updated}</>}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(product.id)}
                aria-pressed={saved}
                aria-label={saved ? `Sacar ${product.title} de guardados` : `Guardar ${product.title}`}
                title={saved ? "Sacar de guardados" : "Guardar producto"}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors cursor-pointer motion-safe:active:scale-90"
              >
                <Heart size={15} className={saved ? "text-[#ef4444]" : ""} fill={saved ? "#ef4444" : "none"} />
              </button>
              <ShareButtons title={product.title} />
            </div>
          </div>

          {product.badge && (
            <div className="mt-3">
              <Badge variant={product.badge}>
                {product.badge === "viral" ? "VIRAL" : product.badge === "trending" ? "TRENDING" : "HOT DEAL"}
              </Badge>
            </div>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <RatingLink enlazar={!!product.customerReviews?.length}>
                <span
                  role="img"
                  aria-label={`${product.rating} de 5 estrellas${product.reviewCount ? `, ${product.reviewCount} opiniones` : ""}`}
                  className="inline-flex items-center gap-1.5"
                >
                  <RatingStars rating={product.rating} />
                  <span className="font-bold text-[var(--text-primary)]">
                    {product.rating.toFixed(1)}
                  </span>
                </span>
                {product.reviewCount ? (
                  <span className="text-[var(--text-muted)]">
                    · {product.reviewCount.toLocaleString("es-AR")} opiniones
                  </span>
                ) : null}
              </RatingLink>
              {fewReviews && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] text-[#d97706] bg-[rgba(245,158,11,0.12)]">
                  Pocas opiniones — lo decimos de frente
                </span>
              )}
            </div>
          )}
          {product.ratingBreakdown && <RatingBreakdown breakdown={product.ratingBreakdown} />}

          {/* Price */}
          <div id="product-price" className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-[var(--text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-semibold text-[var(--color-discount)]">
                  <span className="sr-only">{discount}% de descuento</span>
                  <span aria-hidden="true">-{discount}%</span>
                </span>
              </>
            )}
          </div>

          {priceHistory?.verdict.tone === "good" && (
            <Badge
              variant="price-low"
              className="self-start mt-2"
              title="El precio de hoy es el más bajo (o casi) que le registramos a este producto."
            >
              <TrendingDown size={10} />
              Mínimo histórico
            </Badge>
          )}

          {priceHistory && priceHistory.rangeDays >= 7 && (
            <p className="mt-1.5 text-[12.5px] text-[var(--text-secondary)]">
              Promedio de los últimos {priceHistory.rangeDays} días: {formatPrice(priceHistory.avg)}
            </p>
          )}

          <CouponBadge price={product.price} categorySlug={product.categorySlug} className="self-start mt-2" />

          {/* Cuotas / price honesty */}
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            o en cuotas en MercadoLibre ·{" "}
            <span className="text-[var(--text-muted)]">
              el precio puede cambiar, confirmalo allí
            </span>
          </p>

          {/* Shipping & condition */}
          <div className="mt-4 flex flex-wrap gap-3">
            {product.freeShipping && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-trending-up)]">
                <Truck size={14} />
                Envío gratis
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Shield size={14} />
              {product.condition === "new" ? "Nuevo" : "Usado"}
            </div>
            {product.soldQuantity && (
              <div className="text-xs text-[var(--text-muted)]">
                +{product.soldQuantity.toLocaleString("es-AR")} vendidos
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed">
              {renderInlineMarkdown(product.description)}
            </p>
          )}

          {/* Verdict */}
          {product.verdict && (
            <div className="mt-5 p-4 rounded-[var(--radius-badge)] bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.3)]">
              <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                💬 {renderInlineMarkdown(product.verdict)}
              </p>
            </div>
          )}

          {/* CTA principal (único, dominante) */}
          <div id="product-main-cta" className="mt-6">
            {product.priceStatus === "out_of_stock" && (
              <div className="mb-3 flex items-start gap-2 rounded-[var(--radius-card)] bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.35)] px-3.5 py-2.5 text-xs text-[var(--text-primary)]">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-[#d97706]" />
                <span>
                  Al último chequeo esta publicación figuraba pausada o sin stock. Puede
                  haberse repuesto desde entonces — confirmalo en MercadoLibre antes de dar
                  el click.
                </span>
              </div>
            )}
            {product.priceStatus === "out_of_stock" ? (
              <>
                {/* Sin stock: la acción principal pasa a ser interna (alternativas
                    disponibles o avisame), no empujar el click afiliado a una
                    publicación que sabemos pausada. El link a MercadoLibre queda
                    igual, solo que como acción secundaria — nunca se saca del
                    todo, por si repuso stock desde el último chequeo. */}
                <Link
                  href={hasAlternatives ? "#alternativas-disponibles" : "#avisame-stock"}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] motion-safe:active:scale-[0.98] transition-[background-color,transform]"
                >
                  {hasAlternatives ? "Ver alternativas disponibles" : "Avisame cuando vuelva"}
                  <ArrowRight size={16} />
                </Link>
                <AffiliateLink
                  href={product.affiliateUrl}
                  ctaLocation="ficha-top"
                  ariaLabel="Confirmar en MercadoLibre Argentina (se abre en una pestaña nueva)"
                  className="mt-2.5 flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold rounded-[var(--radius-pill)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Confirmar en MercadoLibre
                  <ExternalLink size={14} />
                </AffiliateLink>
              </>
            ) : (
              <AffiliateLink
                href={product.affiliateUrl}
                ctaLocation="ficha-top"
                ariaLabel="Ir a MercadoLibre Argentina (se abre en una pestaña nueva)"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] motion-safe:active:scale-[0.98] transition-[background-color,transform]"
              >
                Ir a MercadoLibre Argentina
                <ExternalLink size={16} />
              </AffiliateLink>
            )}
            <p className="mt-2.5 text-xs text-[var(--text-muted)] text-center leading-relaxed">
              Compra protegida en MercadoLibre · el precio puede cambiar, confirmalo allí.
              <br />
              Ganamos una comisión si comprás por el link — no te cambia el precio.
            </p>
            <DecisionNav product={product} hasRelated={relatedProducts.length > 0} />
          </div>
        </div>
      </div>

      {/* ─── Historial de precios (prueba social, arriba de todo) ─── */}
      {priceHistory && (
        <SectionCard
          className="detail-pricehistory"
          kicker="Seguimiento de precio"
          title="¿Cómo viene el precio?"
        >
          <PriceHistoryChart data={priceHistory} />
          <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed">
            Seguimos el precio de este producto en MercadoLibre y registramos cada
            cambio. Es una referencia para ver si hoy conviene comprar o esperar.
          </p>
        </SectionCard>
      )}

      {/* ─── Pros / Cons + mosaicos de specs ─── */}
      {(product.pros || product.cons) && (
        <SectionCard id="ficha-pros-contras" className="detail-proscons" kicker="El resumen honesto" title="A favor y en contra">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.pros && (
              <div className="rounded-[var(--radius-badge)] p-4 bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.22)]">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-[#16a34a] mb-2.5">
                  <Check size={15} /> A favor
                </h3>
                <ul className="space-y-2">
                  {product.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-snug">
                      <Check size={13} className="text-[#16a34a] shrink-0 mt-0.5" />
                      {renderInlineMarkdown(pro)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons && (
              <div className="rounded-[var(--radius-badge)] p-4 bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.22)]">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-[#ef4444] mb-2.5">
                  <X size={15} /> En contra
                </h3>
                <ul className="space-y-2">
                  {product.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-snug">
                      <X size={13} className="text-[#ef4444] shrink-0 mt-0.5" />
                      {renderInlineMarkdown(con)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {tileSpecs.length >= 3 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {tileSpecs.map((t) => (
                <div key={t.label} className="rounded-[var(--radius-badge)] bg-[var(--bg-secondary)] p-3 text-center">
                  <div className="text-base font-bold text-[var(--text-primary)] leading-tight">
                    {t.value}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* ─── Comparar con otros modelos (tabla con estrellas + botón) ─── */}
      {relatedProducts.length > 0 && (
        <SectionCard id="ficha-comparar" className="detail-related" kicker="Compará" title="Comparar con otros modelos">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-2 py-2 text-left font-semibold">Modelo</th>
                  <th className="px-2 py-2 text-left font-semibold">Precio</th>
                  <th className="px-2 py-2 text-left font-semibold">Puntaje</th>
                  <th className="px-2 py-2 text-right font-semibold" aria-label="Comprar" />
                </tr>
              </thead>
              <tbody>
                {relatedProducts.map((related) => (
                  <tr key={related.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-2 py-3">
                      <Link href={productHref(related)} prefetch={false} className="flex items-center gap-2.5 group">
                        <span
                          className="relative w-10 h-10 shrink-0 rounded-[var(--radius-badge)] overflow-hidden"
                          style={{ backgroundColor: related.pastelColor || "var(--bg-secondary)" }}
                        >
                          {related.image && (
                            <Image
                              src={related.image}
                              alt={related.title}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          )}
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:text-[#3483fa] transition-colors">
                          {related.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap font-semibold text-[var(--text-primary)]">
                      {formatPrice(related.price)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {related.rating ? (
                        <span className="inline-flex items-center gap-1">
                          <RatingStars rating={related.rating} size={13} />
                          <span className="text-[var(--text-secondary)]">
                            {related.rating.toFixed(1)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {related.priceStatus === "out_of_stock" ? (
                        <Link
                          href={productHref(related)}
                          prefetch={false}
                          aria-label={`Ver ${related.title} (sin stock en esta publicación)`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-[var(--radius-pill)] bg-[#3483fa] text-white hover:bg-[#2968c8] transition-colors whitespace-nowrap"
                        >
                          Ver <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <AffiliateLink
                          href={related.affiliateUrl}
                          ctaLocation="ficha-comparar"
                          ariaLabel={`Ver ${related.title} en MercadoLibre Argentina (se abre en una pestaña nueva)`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-[var(--radius-pill)] bg-[#3483fa] text-white hover:bg-[#2968c8] transition-colors whitespace-nowrap"
                        >
                          Ver <ArrowRight size={13} />
                        </AffiliateLink>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ─── ¿Para quién es? (extraído del artículo) ─── */}
      {(paraYes || paraNo) && (
        <SectionCard className="detail-parawhom" kicker="¿Es para vos?" title="Para quién sí y para quién no">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paraYes && (
              <div className="rounded-[var(--radius-badge)] p-4 bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.22)]">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-[#16a34a] mb-2">
                  <Check size={15} /> Comprala si…
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{renderInlineMarkdown(paraYes)}</p>
              </div>
            )}
            {paraNo && (
              <div className="rounded-[var(--radius-badge)] p-4 bg-[var(--bg-secondary)] border border-[var(--border)]">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] mb-2">
                  <X size={15} /> Mejor otra si…
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{renderInlineMarkdown(paraNo)}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ─── Article body ─── */}
      {articleBlocks.length > 0 && (
        <SectionCard className="detail-article" kicker="El análisis">
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
            {articleBlocks.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-lg font-bold text-[var(--text-primary)] mt-7 mb-3 first:mt-0"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (/^\d+\.\s/.test(block)) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-sm leading-relaxed">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-sm leading-relaxed mb-4">
                  {renderInlineMarkdown(block)}
                </p>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* ─── Customer reviews ─── */}
      {product.customerReviews && product.customerReviews.length > 0 && (
        <SectionCard id="ficha-opiniones" className="detail-reviews" kicker="Voz del comprador" title="Lo que dicen los compradores">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.customerReviews.map((review, i) => (
              <figure
                key={i}
                className="rounded-[var(--radius-badge)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span aria-label={`${review.rating} de 5 estrellas`} className="inline-flex">
                    <RatingStars rating={review.rating} size={13} />
                  </span>
                  {review.country && (
                    <span className="text-[var(--text-muted)]">· {review.country}</span>
                  )}
                  {review.date && (
                    <span className="text-[var(--text-muted)]">· {review.date}</span>
                  )}
                </div>
                <blockquote className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </figure>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ─── Specs table ─── */}
      {product.specs && product.specs.length > 0 && (
        <SectionCard id="ficha-specs" className="detail-specs" kicker="Ficha técnica" title="Especificaciones">
          <div className="rounded-[var(--radius-badge)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={i % 2 === 0 ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-primary)]"}
                  >
                    <td className="px-4 py-2.5 font-medium text-[var(--text-primary)] w-[40%]">
                      {spec.label}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text-secondary)]">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ─── FAQ ─── */}
      {product.faq && product.faq.length > 0 && (
        <SectionCard id="ficha-faq" className="detail-faq" kicker="Antes de comprar" title="Preguntas frecuentes">
          <div className="space-y-3">
            {product.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-[var(--radius-badge)] border border-[var(--border)] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  {item.question}
                  <ChevronRight
                    size={16}
                    className="shrink-0 transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="px-4 pb-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {renderInlineMarkdown(item.answer)}
                </div>
              </details>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ─── Banda CTA final ─── */}
      {(product.articleBody || product.faq) && (
        <div
          id="product-bottom-cta"
          className="detail-cta-band mt-10 max-w-3xl mx-auto rounded-[var(--radius-card)] p-7 md:p-8 text-center bg-[#111111]"
          style={{ opacity: 0 }}
        >
          <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {product.priceStatus === "out_of_stock" ? "¿Sin stock justo ahora?" : "¿Te convenció?"}
          </p>
          <p className="mt-1 text-sm text-white opacity-70">
            {product.priceStatus === "out_of_stock"
              ? "Esta publicación figuraba pausada al último chequeo."
              : "Confirmá precio y stock en MercadoLibre Argentina."}
          </p>
          {/* Blanco, no amarillo: el amarillo es exclusivo del boton (regla de
              oro CRO del sitio). En amarillo, este precio leia como la mitad de
              arriba del CTA y recibia toques que no hacian nada. */}
          <div className="mt-3 text-2xl font-bold text-white">
            {formatPrice(product.price)}
          </div>
          {product.priceStatus === "out_of_stock" ? (
            <Link
              href={hasAlternatives ? "#alternativas-disponibles" : "#avisame-stock"}
              className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[#ffe600] text-[#111111] hover:brightness-95 motion-safe:active:scale-[0.98] transition"
            >
              {hasAlternatives ? "Ver alternativas disponibles" : "Avisame cuando vuelva"}
              <ArrowRight size={16} />
            </Link>
          ) : (
            <AffiliateLink
              href={product.affiliateUrl}
              ctaLocation="ficha-bottom"
              ariaLabel="Comprar en MercadoLibre Argentina (se abre en una pestaña nueva)"
              className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[#ffe600] text-[#111111] hover:brightness-95 motion-safe:active:scale-[0.98] transition"
            >
              Comprar en MercadoLibre Argentina
              <ExternalLink size={16} />
            </AffiliateLink>
          )}
        </div>
      )}

      <RecentlyViewed excludeId={product.id} currentCategorySlug={product.categorySlug} />

      <StickyMobileCta product={product} hasAlternatives={hasAlternatives} />
    </div>
  );
}
