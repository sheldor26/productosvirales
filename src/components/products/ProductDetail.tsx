"use client";

import { useRef } from "react";
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
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "./ProductGallery";
import { StickyMobileCta } from "./StickyMobileCta";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import { productHref } from "@/lib/product-url";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
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

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : null;

  const updated = updatedLabel(product);
  const fewReviews =
    typeof product.reviewCount === "number" && product.reviewCount < 50;

  useGSAP(() => {
    const selector =
      ".detail-image, .detail-info, .detail-article, .detail-reviews, .detail-specs, .detail-faq, .detail-related, .detail-cta-band";

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // El SSR pinta estos bloques con opacity:0 (espacio reservado, sin CLS).
      // Antes de animar, fijamos el estado final visible (opacity:1) para que
      // .from() interpole DESDE 0 HACIA 1 — animamos solo opacity/transform,
      // nunca layout.
      gsap.set(selector, { opacity: 1 });
      const tl = gsap.timeline({ defaults: { opacity: 0, y: 20, duration: 0.4, ease: "power2.out" } });
      tl.from(".detail-image", { x: -20, y: 0 })
        .from(".detail-info", { x: 20, y: 0 }, "<0.1")
        .from(".detail-article", {}, 0.3)
        .from(".detail-reviews", {}, "-=0.05")
        .from(".detail-specs", {}, "-=0.05")
        .from(".detail-faq", {}, "-=0.05")
        .from(".detail-related", {}, "-=0.05")
        .from(".detail-cta-band", {}, "-=0.05");
      // Aseguramos el estado final (por si el usuario no espera la animación).
      tl.set(selector, { clearProps: "opacity,transform" });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(selector, { opacity: 1, y: 0, x: 0 });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/categoria/${product.categorySlug}`}
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Image gallery */}
        <div className="detail-image" style={{ opacity: 0 }}>
          <ProductGallery product={product} />
        </div>

        {/* Right: Info */}
        <div className="detail-info flex flex-col" style={{ opacity: 0 }}>
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
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Por <span className="font-semibold text-[var(--text-secondary)]">ProductosVirales</span>
            {updated && <> · Actualizado {updated}</>}
          </p>

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
              {product.reviewCount && (
                <span className="text-[var(--text-muted)]">
                  · {product.reviewCount.toLocaleString("es-AR")} opiniones
                </span>
              )}
              {fewReviews && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] text-[#d97706] bg-[rgba(245,158,11,0.12)]">
                  Pocas opiniones — lo decimos de frente
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-[var(--text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-semibold text-[var(--color-discount)]">
                  -{discount}%
                </span>
              </>
            )}
          </div>

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
              {product.description}
            </p>
          )}

          {/* Pros / Cons — tarjetas de color */}
          {(product.pros || product.cons) && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.pros && (
                <div className="rounded-[var(--radius-badge)] p-3.5 bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.22)]">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#16a34a] mb-2 uppercase tracking-wider">
                    <Check size={14} /> A favor
                  </h4>
                  <ul className="space-y-1.5">
                    {product.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-snug">
                        <Check size={13} className="text-[#16a34a] shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && (
                <div className="rounded-[var(--radius-badge)] p-3.5 bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.22)]">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#ef4444] mb-2 uppercase tracking-wider">
                    <X size={14} /> En contra
                  </h4>
                  <ul className="space-y-1.5">
                    {product.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-snug">
                        <X size={13} className="text-[#ef4444] shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Verdict */}
          {product.verdict && (
            <div className="mt-5 p-4 rounded-[var(--radius-badge)] bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.3)]">
              <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                💬 {product.verdict}
              </p>
            </div>
          )}

          {/* CTA principal (único, dominante) */}
          <div id="product-main-cta" className="mt-6">
            <AffiliateLink
              href={product.affiliateUrl}
              ariaLabel="Ver en MercadoLibre (se abre en una pestaña nueva)"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[#3483fa] text-white hover:bg-[#2968c8] transition-colors"
            >
              Ir a MercadoLibre
              <ExternalLink size={16} />
            </AffiliateLink>
            <p className="mt-2.5 text-xs text-[var(--text-muted)] text-center leading-relaxed">
              Compra protegida en MercadoLibre · el precio puede cambiar, confirmalo allí.
              <br />
              Ganamos una comisión si comprás por el link — no te cambia el precio.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Article body ─── */}
      {product.articleBody && (
        <article className="detail-article mt-10 max-w-3xl" style={{ opacity: 0 }}>
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
            {product.articleBody.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h2
                    key={i}
                    className="text-lg font-bold text-[var(--text-primary)] mt-8 mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {block.replace('## ', '')}
                  </h2>
                );
              }
              if (/^\d+\.\s/.test(block)) {
                const items = block.split('\n').filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-sm leading-relaxed">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-sm leading-relaxed mb-4">
                  {parseInlineLinks(block)}
                </p>
              );
            })}
          </div>
        </article>
      )}

      {/* ─── Customer reviews ─── */}
      {product.customerReviews && product.customerReviews.length > 0 && (
        <section className="detail-reviews mt-8 max-w-3xl" style={{ opacity: 0 }}>
          <h2
            className="text-lg font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Lo que dicen los compradores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.customerReviews.map((review, i) => (
              <figure
                key={i}
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
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
        </section>
      )}

      {/* ─── Specs table ─── */}
      {product.specs && product.specs.length > 0 && (
        <div className="detail-specs mt-8 max-w-3xl" style={{ opacity: 0 }}>
          <h2
            className="text-lg font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Especificaciones
          </h2>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={i % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}
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
        </div>
      )}

      {/* ─── FAQ ─── */}
      {product.faq && product.faq.length > 0 && (
        <section className="detail-faq mt-8 max-w-3xl" style={{ opacity: 0 }}>
          <h2
            className="text-lg font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {product.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-[var(--radius-card)] border border-[var(--border)] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  {item.question}
                  <ChevronRight
                    size={16}
                    className="shrink-0 transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="px-4 pb-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {parseInlineLinks(item.answer)}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ─── Comparar con otros modelos (tabla con estrellas, links internos) ─── */}
      {relatedProducts.length > 0 && (
        <section className="detail-related mt-10 max-w-3xl" style={{ opacity: 0 }}>
          <h2
            className="text-lg font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Comparar con otros modelos
          </h2>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] overflow-x-auto">
            <table className="w-full text-sm min-w-[460px]">
              <thead>
                <tr className="bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left font-semibold">Modelo</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Precio</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Puntaje</th>
                  <th className="px-4 py-2.5 text-right font-semibold" aria-label="Ver" />
                </tr>
              </thead>
              <tbody>
                {relatedProducts.map((related) => (
                  <tr
                    key={related.id}
                    className="border-t border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={productHref(related)}
                        className="flex items-center gap-2.5 group"
                      >
                        <span
                          className="relative w-10 h-10 shrink-0 rounded-[var(--radius-badge)] overflow-hidden"
                          style={{ backgroundColor: related.pastelColor || '#f8f8f6' }}
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
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-[var(--text-primary)]">
                      {formatPrice(related.price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={productHref(related)}
                        aria-label={`Ver ${related.title}`}
                        className="inline-flex text-[var(--text-muted)] hover:text-[#3483fa] transition-colors"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ─── Banda CTA final ─── */}
      {(product.articleBody || product.faq) && (
        <div
          id="product-bottom-cta"
          className="detail-cta-band mt-10 max-w-3xl rounded-[var(--radius-card)] p-7 md:p-8 text-center bg-[var(--text-primary)]"
          style={{ opacity: 0 }}
        >
          <p className="text-lg font-bold text-[var(--bg-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            ¿Te convenció?
          </p>
          <p className="mt-1 text-sm text-[var(--bg-primary)] opacity-70">
            Confirmá precio y stock en MercadoLibre.
          </p>
          <div className="mt-3 text-2xl font-bold text-[#ffe600]">
            {formatPrice(product.price)}
          </div>
          <AffiliateLink
            href={product.affiliateUrl}
            ariaLabel="Comprar en MercadoLibre (se abre en una pestaña nueva)"
            className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-[var(--radius-pill)] bg-[#ffe600] text-[#111111] hover:brightness-95 transition"
          >
            Comprar en MercadoLibre
            <ExternalLink size={16} />
          </AffiliateLink>
        </div>
      )}

      <StickyMobileCta product={product} />
    </div>
  );
}
