"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap-config";
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
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".product-card");
    if (cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(cards, { autoAlpha: 0, y: 30 });

      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            overwrite: true,
          });
        },
        start: "top 88%",
        once: true,
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
    });
  }, { scope: containerRef, dependencies: [products] });

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
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
