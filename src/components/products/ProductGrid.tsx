"use client";

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
  return (
    <section>
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
              <ProductCard key={product.id} product={product} index={i} />
            ))}
      </div>
    </section>
  );
}
