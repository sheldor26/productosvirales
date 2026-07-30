"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useSavedProducts } from "@/lib/use-saved-products";
import type { CardProduct } from "@/lib/types";

export function SavedProductsView() {
  const { ids } = useSavedProducts();
  const [products, setProducts] = useState<CardProduct[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/saved-products?ids=${encodeURIComponent(ids.join(","))}`)
      .then((res) => res.json())
      .then((data: CardProduct[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (products === null) {
    return <ProductGrid products={[]} loading />;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-10 text-center">
        <Heart size={28} className="mx-auto text-[var(--text-muted)]" />
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Todavía no guardaste ningún producto. Tocá el corazón en cualquier tarjeta para
          guardarlo acá.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm font-semibold underline decoration-[var(--border)] underline-offset-2"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
