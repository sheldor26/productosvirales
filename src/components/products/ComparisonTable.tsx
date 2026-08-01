"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Star, TrendingDown } from "lucide-react";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { productHref } from "@/lib/product-url";
import type { CardProduct } from "@/lib/types";

interface ComparisonTableProps {
  products: CardProduct[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

/** Tabla de comparación lado a lado para los productos que el visitante
 * marcó con "Comparar" en una categoría. Vive DEBAJO de la grilla (no en un
 * modal/overlay): más simple de hacer bien en mobile, sin lidiar con scroll
 * atrapado ni z-index. Solo columnas con dato real, nunca specs inventadas. */
export function ComparisonTable({ products, onRemove, onClear }: ComparisonTableProps) {
  if (products.length < 2) return null;

  return (
    <div
      id="comparador"
      className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] p-4 md:p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2
          className="text-lg font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Comparando {products.length} producto{products.length !== 1 ? "s" : ""}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
        >
          Limpiar
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${products.length}, minmax(150px, 1fr))` }}
        >
          {products.map((p) => {
            const discount = p.originalPrice ? formatDiscount(p.originalPrice, p.price) : null;
            return (
              <div
                key={p.id}
                className="rounded-[var(--radius-card)] border border-[var(--border)] p-3 flex flex-col"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Sacar ${p.title} de la comparación`}
                    className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <a href={productHref(p)} className="block relative w-full aspect-square mb-2">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="150px"
                    className="object-contain"
                  />
                </a>

                <a
                  href={productHref(p)}
                  className="text-xs font-medium leading-snug text-[var(--text-primary)] line-clamp-2 hover:underline"
                >
                  {p.title}
                </a>

                <div className="mt-2 flex items-baseline gap-1 flex-wrap">
                  <span className="text-base font-bold text-[var(--text-primary)]">
                    {formatPrice(p.price)}
                  </span>
                  {discount && (
                    <span className="text-[10px] font-semibold text-[var(--color-discount)]">
                      -{discount}%
                    </span>
                  )}
                </div>

                {p.bestPrice && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[var(--color-trending-up)]">
                    <TrendingDown size={10} />
                    Mínimo histórico
                  </span>
                )}

                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  {p.rating && (
                    <span className="flex items-center gap-0.5">
                      <Star size={10} className="text-[#f59e0b]" fill="#f59e0b" />
                      {p.rating.toFixed(1)}
                    </span>
                  )}
                  {p.soldQuantity && <span>{p.soldQuantity.toLocaleString("es-AR")} vendidos</span>}
                </div>

                {p.priceStatus === "out_of_stock" ? (
                  <Link
                    href={productHref(p)}
                    className="mt-3 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-[var(--radius-button)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
                    aria-label={`Ver alternativas para ${p.title} (sin stock en esta publicación)`}
                  >
                    Ver alternativas
                  </Link>
                ) : (
                  <AffiliateLink
                    href={p.affiliateUrl}
                    ctaLocation="comparador"
                    className="mt-3 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-[var(--radius-button)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
                    ariaLabel={`Ver ${p.title} en MercadoLibre Argentina`}
                  >
                    Ver en MercadoLibre
                  </AffiliateLink>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
