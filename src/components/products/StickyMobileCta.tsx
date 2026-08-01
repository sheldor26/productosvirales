"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface StickyMobileCtaProps {
  product: Product;
  /** Ver ProductDetail.tsx: si hay alternativas disponibles promovidas. */
  hasAlternatives?: boolean;
}

/**
 * Barra de compra fija al pie de la pantalla, solo mobile.
 *
 * Aparece al salir del bloque de precio (#product-price), no recién cuando
 * el CTA principal ya quedó arriba del viewport — en mobile el CTA principal
 * queda bastante abajo (descripción + veredicto de por medio), así que
 * esperarlo dejaba a la barra sin trabajo que hacer en ese primer tramo.
 * Se esconde cuando el CTA del final (#product-bottom-cta) entra en pantalla,
 * para no tapar un botón que apunta al mismo lugar.
 */
export function StickyMobileCta({ product, hasAlternatives = false }: StickyMobileCtaProps) {
  const [pastPrice, setPastPrice] = useState(false);
  const [bottomCtaVisible, setBottomCtaVisible] = useState(false);

  useEffect(() => {
    const priceBlock = document.getElementById("product-price");
    const bottomCta = document.getElementById("product-bottom-cta");
    const observers: IntersectionObserver[] = [];

    if (priceBlock) {
      const obs = new IntersectionObserver(
        ([entry]) =>
          setPastPrice(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        { threshold: 0 }
      );
      obs.observe(priceBlock);
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

  const visible = pastPrice && !bottomCtaVisible;

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
        {product.priceStatus === "out_of_stock" ? (
          <Link
            href={hasAlternatives ? "#alternativas-disponibles" : "#avisame-stock"}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] motion-safe:active:scale-95 transition-[background-color,transform]"
          >
            {hasAlternatives ? "Ver alternativas" : "Avisame cuando vuelva"}
            <ArrowRight size={14} />
          </Link>
        ) : (
          <AffiliateLink
            href={product.affiliateUrl}
            ctaLocation="sticky"
            ariaLabel={`Ver ${product.title} en MercadoLibre Argentina (se abre en una pestaña nueva)`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] motion-safe:active:scale-95 transition-[background-color,transform]"
          >
            Ver en MercadoLibre Argentina
            <ExternalLink size={14} />
          </AffiliateLink>
        )}
      </div>
    </div>
  );
}
