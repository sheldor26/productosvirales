"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDiscount } from "@/lib/utils";
import type { Product } from "@/lib/types";

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
} as const;

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const {
    id,
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
  } = product;

  const discount = originalPrice ? formatDiscount(originalPrice, price) : null;
  const BadgeIcon = badge ? badgeConfig[badge].icon : null;
  const badgeLabel = badge ? badgeConfig[badge].label : null;

  return (
    <div
      className={`product-card group rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 ${
        badge === "viral" ? "shadow-[0_0_14px_rgba(236,72,153,0.16)]" : ""
      }`}
      style={{ visibility: "hidden" }}
    >
      {/* Image area */}
      <Link href={`/producto/${id}`} className="block relative" style={{ aspectRatio: "10/9" }}>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: pastelColor || "#f8f8f6" }}
        />
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
          />
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
              -{discount}%
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

      {/* Info area */}
      <div className="p-3 md:p-3.5">
        <Link
          href={`/categoria/${categorySlug}`}
          className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          {category}
        </Link>

        <Link href={`/producto/${id}`}>
          <h3 className="mt-1 text-sm font-medium leading-[1.3] text-[var(--text-primary)] line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-bold text-[var(--text-primary)]">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors shrink-0"
            aria-label="Ver en MercadoLibre"
          >
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
