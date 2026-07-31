"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Flame, Award, Sun, Gift, Heart, ImageOff } from "lucide-react";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { Badge } from "@/components/ui/Badge";
import { CouponBadge } from "@/components/products/CouponBadge";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { productHref } from "@/lib/product-url";
import { useSavedProducts } from "@/lib/use-saved-products";
import type { CardProduct } from "@/lib/types";

function TikTokIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
    </svg>
  );
}

const badgeConfig = {
  viral: { icon: Sparkles, label: "VIRAL" },
  trending: { icon: TrendingUp, label: "TRENDING" },
  "hot-deal": { icon: Flame, label: "HOT DEAL" },
  bestseller: { icon: Award, label: "BESTSELLER" },
  "summer-pick": { icon: Sun, label: "PARA VERANO" },
  "tiktok-viral": { icon: TikTokIcon, label: "VIRAL EN TIKTOK" },
  collector: { icon: Gift, label: "EDICIÓN ESPECIAL" },
} as const;

interface ProductCardProps {
  product: CardProduct;
  index?: number;
  /** Mark the card's image as LCP candidate (priority + fetchpriority=high). */
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const productUrl = productHref(product);
  const { isSaved, toggle } = useSavedProducts();
  const saved = isSaved(product.id);
  const [imgError, setImgError] = useState(false);
  const {
    title,
    price,
    originalPrice,
    image,
    category,
    categorySlug,
    affiliateUrl,
    tiktokViews,
    badge,
    pastelColor,
    bestPrice,
  } = product;

  const discount = originalPrice ? formatDiscount(originalPrice, price) : null;
  const BadgeIcon = badge ? badgeConfig[badge].icon : null;
  const badgeLabel = badge ? badgeConfig[badge].label : null;

  return (
    <div
      className={`product-card ${priority ? "" : "reveal"} group rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] transition-transform hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.18)] motion-safe:active:scale-[0.98] ${
        badge === "viral" ? "shadow-[0_0_14px_rgba(236,72,153,0.16)]" : ""
      }`}
    >
      {/* Image area. Wrapper propio (no el <Link>) para poder poner el botón de
          guardar como hermano, no hijo: un <button> dentro de un <a> es HTML
          inválido y rompe el accessibility tree / los clicks. */}
      <div className="relative" style={{ aspectRatio: "10/9" }}>
        <Link href={productUrl} className="block relative w-full h-full">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: pastelColor || "var(--bg-secondary)" }}
          />
          <div className="relative w-full h-full overflow-hidden">
            {imgError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[var(--text-muted)]">
                <ImageOff size={22} />
                <span className="text-[10px] text-center px-2">Imagen no disponible</span>
              </div>
            ) : (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                preload={priority}
                fetchPriority={priority ? "high" : undefined}
                loading={priority ? "eager" : "lazy"}
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Top-left: TikTok badge */}
          {tiktokViews && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="viral" className="gap-1">
                <TikTokIcon size={10} />
                {tiktokViews} views
              </Badge>
            </div>
          )}

          {/* Top-right: Discount badge */}
          {discount && (
            <div className="absolute top-2.5 right-2.5">
              <Badge variant="discount" className={badge === "hot-deal" ? "pulse-badge" : ""}>
                <span className="sr-only">{discount}% de descuento</span>
                <span aria-hidden="true">-{discount}%</span>
              </Badge>
            </div>
          )}

          {/* Bottom-left: Product badge */}
          {badge && BadgeIcon && (
            <div className="absolute bottom-2.5 left-2.5">
              <Badge variant={badge} className="gap-1">
                <BadgeIcon size={10} />
                {badgeLabel}
              </Badge>
            </div>
          )}
        </Link>

        {/* Bottom-right: guardar (localStorage, sin cuentas). Hermano del
            Link, no hijo (ver comentario arriba). */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-pressed={saved}
          aria-label={saved ? "Sacar de guardados" : "Guardar producto"}
          title={saved ? "Sacar de guardados" : "Guardar producto"}
          className="absolute bottom-2.5 right-2.5 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 motion-safe:active:scale-90 transition-transform cursor-pointer"
        >
          <Heart
            size={15}
            className={saved ? "text-[#ef4444]" : "text-[var(--text-muted)]"}
            fill={saved ? "#ef4444" : "none"}
          />
        </button>
      </div>

      {/* Info area */}
      <div className="p-3 md:p-3.5">
        <Link
          href={`/categoria/${categorySlug}`}
          className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          {category}
        </Link>

        <Link href={productUrl}>
          <h3 className="mt-1 text-sm font-medium leading-[1.3] text-[var(--text-primary)] line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[18px] font-bold text-[var(--text-primary)]">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {product.priceStatus === "stale" && (
              <span
                className="text-[10px] text-amber-600 font-medium"
                title="Precio puede haber cambiado, verificá en MercadoLibre"
              >
                ⚠ verificar
              </span>
            )}
          </div>

          <AffiliateLink
            href={affiliateUrl}
            ctaLocation="card"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-full bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] motion-safe:active:scale-90 transition-[background-color,transform] shrink-0"
            ariaLabel="Ver en MercadoLibre Argentina"
          >
            <ArrowRight size={16} />
          </AffiliateLink>
        </div>

        {bestPrice && (
          <Badge
            variant="price-low"
            className="mt-1.5"
            title="El precio de hoy es el más bajo que le registramos a este producto."
          >
            <TrendingDown size={10} />
            Mínimo histórico
          </Badge>
        )}

        <CouponBadge price={price} className="mt-1.5" />
      </div>
    </div>
  );
}
