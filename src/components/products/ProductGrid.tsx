"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ products, loading = false, title, subtitle }: ProductGridProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".product-card"));
    if (cards.length === 0) return;

    // Set per-card stagger via CSS variable so the transition delay reads it
    cards.forEach((c, i) => {
      c.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [products]);

  return (
    <section ref={containerRef}>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2
              className="text-xl md:text-2xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
      </div>
    </section>
  );
}
