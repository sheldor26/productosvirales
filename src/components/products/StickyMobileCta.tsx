"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface StickyMobileCtaProps {
  product: Product;
}

/**
 * Barra de compra fija al pie de la pantalla, solo mobile.
 *
 * Aparece cuando el CTA principal (#product-main-cta) ya quedó arriba
 * del viewport, y se esconde cuando el CTA del final (#product-bottom-cta)
 * entra en pantalla, para no tapar un botón que apunta al mismo lugar.
 */
export function StickyMobileCta({ product }: StickyMobileCtaProps) {
  const [pastMainCta, setPastMainCta] = useState(false);
  const [bottomCtaVisible, setBottomCtaVisible] = useState(false);

  useEffect(() => {
    const mainCta = document.getElementById("product-main-cta");
    const bottomCta = document.getElementById("product-bottom-cta");
    const observers: IntersectionObserver[] = [];

    if (mainCta) {
      const obs = new IntersectionObserver(
        ([entry]) =>
          setPastMainCta(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        { threshold: 0 }
      );
      obs.observe(mainCta);
      observers.push(obs);
    }

    if (bottomCta) {
      const obs = new IntersectionObserver(
        ([entry]) => setBottomCtaVisible(entry.isIntersecting),
        { threshold: 0 }
      );
      obs.observe(bottomCta);
      observers.push(obs);
    }

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const visible = pastMainCta && !bottomCtaVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-primary)] border-t border-[var(--border)] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-[var(--text-muted)] truncate">
            {product.brand || product.category}
          </span>
          <span className="text-base font-bold text-[var(--text-primary)] leading-tight">
            {formatPrice(product.price)}
          </span>
        </div>
        <AffiliateLink
          href={product.affiliateUrl}
          ctaLocation="sticky"
          ariaLabel={`Ver ${product.title} en MercadoLibre Argentina`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
        >
          Ver en MercadoLibre Argentina
          <ExternalLink size={14} />
        </AffiliateLink>
      </div>
    </div>
  );
}
