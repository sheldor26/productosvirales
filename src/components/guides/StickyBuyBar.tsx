"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface StickyBuyBarProps {
  productMlaId: string;
}

/**
 * Barra fija de compra, SOLO en mobile (<620px). Aparece al scrollear
 * (~600px) para acompañar al lector con el botón siempre a tiro.
 * El amarillo del botón es el único de la página (regla de oro CRO).
 */
export function StickyBuyBar({ productMlaId }: StickyBuyBarProps) {
  const product = getProductById(productMlaId);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) return null;

  const priceText = product.price
    ? formatPrice(product.price, product.currency)
    : null;

  return (
    <div
      className="lg:hidden fixed left-0 right-0 bottom-0 z-50 flex items-center gap-3 px-3.5 py-2.5 bg-[var(--bg-primary)] transition-transform duration-200"
      style={{
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -3px 14px rgba(0,0,0,.10)",
        transform: visible ? "translateY(0)" : "translateY(110%)",
      }}
      aria-hidden={!visible}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt=""
        className="w-[42px] h-[42px] shrink-0 object-contain rounded-[8px] bg-[var(--bg-secondary)]"
      />
      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] font-bold text-[var(--text-primary)] truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.title}
        </div>
        <div className="text-[12px] text-[var(--text-secondary)] truncate">
          {product.rating ? `${product.rating.toFixed(1)} · ` : ""}
          {product.reviewCount
            ? `${product.reviewCount.toLocaleString("es-AR")} calificaciones · `
            : ""}
          {priceText ?? ""}
        </div>
      </div>
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="sponsored nofollow noopener"
        data-cta-location="sticky"
        className="shrink-0 inline-flex items-center gap-1.5 px-4 text-[13.5px] font-extrabold rounded-[var(--radius-button)]"
        style={{
          minHeight: 44,
          backgroundColor: "var(--cta-action)",
          color: "var(--cta-action-text)",
          border: "1px solid rgba(0,0,0,.18)",
          boxShadow: "0 3px 10px rgba(180,150,0,.30)",
        }}
      >
        {priceText ? `Ver a ${priceText}` : "Ver"}
        <span aria-hidden="true" className="font-extrabold">→</span>
      </a>
    </div>
  );
}
