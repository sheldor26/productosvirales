"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, ChevronRight, Truck, Shield, Check, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";
import { Badge } from "@/components/ui/Badge";
import { TikTokBadge } from "@/components/widgets/TikTokBadge";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : null;

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { autoAlpha: 0, y: 20, duration: 0.4, ease: "power2.out" } });
      tl.from(".detail-image", { x: -20, y: 0 })
        .from(".detail-info", { x: 20, y: 0 }, "<0.1")
        .from(".detail-article", {}, 0.3)
        .from(".detail-specs", {}, "-=0.05")
        .from(".detail-faq", {}, "-=0.05")
        .from(".detail-related", {}, "-=0.05");
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".detail-image, .detail-info, .detail-article, .detail-specs, .detail-faq, .detail-related", {
        autoAlpha: 1, y: 0, x: 0,
      });
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
        {/* Left: Image */}
        <div className="detail-image" style={{ visibility: "hidden" }}>
          <div
            className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden"
            style={{ backgroundColor: product.pastelColor || "#f8f8f6" }}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
              unoptimized
            />
            {product.tiktokViews && (
              <div className="absolute top-4 left-4">
                <TikTokBadge views={product.tiktokViews} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="detail-info flex flex-col" style={{ visibility: "hidden" }}>
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

          {product.badge && (
            <div className="mt-3">
              <Badge variant={product.badge}>
                {product.badge === "viral" ? "VIRAL" : product.badge === "trending" ? "TRENDING" : "HOT DEAL"}
              </Badge>
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

          {/* Pros / Cons */}
          {(product.pros || product.cons) && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.pros && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                    A favor
                  </h4>
                  <ul className="space-y-1.5">
                    {product.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <Check size={14} className="text-[var(--color-trending-up)] shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                    En contra
                  </h4>
                  <ul className="space-y-1.5">
                    {product.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <X size={14} className="text-[var(--color-discount)] shrink-0 mt-0.5" />
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
            <div className="mt-5 p-4 rounded-[var(--radius-badge)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                💬 {product.verdict}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
            >
              Ver en MercadoLibre
              <ExternalLink size={14} />
            </a>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius-pill)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Ir a la oferta
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Article body ─── */}
      {product.articleBody && (
        <article className="detail-article mt-10 max-w-3xl" style={{ visibility: "hidden" }}>
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

      {/* ─── Specs table ─── */}
      {product.specs && product.specs.length > 0 && (
        <div className="detail-specs mt-8 max-w-3xl" style={{ visibility: "hidden" }}>
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
        <section className="detail-faq mt-8 max-w-3xl" style={{ visibility: "hidden" }}>
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

      {/* ─── Comparar con otros modelos (interlinking) ─── */}
      {relatedProducts.length > 0 && (
        <section className="detail-related mt-10 max-w-3xl" style={{ visibility: "hidden" }}>
          <h2
            className="text-lg font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Comparar con otros modelos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/producto/${related.id}`}
                className="group flex items-center gap-3 p-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div
                  className="relative w-16 h-16 shrink-0 rounded-[var(--radius-badge)] overflow-hidden"
                  style={{ backgroundColor: related.pastelColor || '#f8f8f6' }}
                >
                  {related.image && (
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:text-[var(--cta-bg)] transition-colors">
                    {related.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {formatPrice(related.price)}
                    {related.rating && ` · ${related.rating}⭐`}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--cta-bg)] group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ─── */}
      {(product.articleBody || product.faq) && (
        <div className="mt-8 max-w-3xl flex justify-center">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
          >
            Ver precio en MercadoLibre
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
