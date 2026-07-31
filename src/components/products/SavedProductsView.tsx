"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, RotateCcw } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { useSavedProducts } from "@/lib/use-saved-products";
import type { CardProduct } from "@/lib/types";

export function SavedProductsView() {
  const { ids } = useSavedProducts();
  const [products, setProducts] = useState<CardProduct[] | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setFetchFailed(false);
      return;
    }
    let cancelled = false;
    setFetchFailed(false);
    fetch(`/api/saved-products?ids=${encodeURIComponent(ids.join(","))}`)
      .then((res) => {
        if (!res.ok) throw new Error(`saved-products respondió ${res.status}`);
        return res.json();
      })
      .then((data: CardProduct[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        // Si guardó productos pero el fetch falla (red inestable, API caída),
        // NO mostrar "todavía no guardaste nada": es información falsa sobre
        // datos que sí existen, y contradice la honestidad que promete el
        // sitio. Se distingue de la lista real vacía con `fetchFailed`.
        if (!cancelled) setFetchFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, retryTick]);

  if (fetchFailed) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-10 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          No pudimos cargar tus guardados ahora mismo. Siguen ahí, es un problema de conexión.
        </p>
        <button
          type="button"
          onClick={() => setRetryTick((n) => n + 1)}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold underline decoration-[var(--border)] underline-offset-2 cursor-pointer"
        >
          <RotateCcw size={14} />
          Reintentar
        </button>
      </div>
    );
  }

  if (products === null) {
    return <ProductGrid products={[]} loading />;
  }

  if (products.length === 0) {
    return (
      <div>
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
        {/* Si no guardó nada pero sí navegó, mostrarle lo último que vio: la
            página vacía deja de ser un callejón sin salida y le da otra
            oportunidad de guardar/comprar sin volver al inicio. */}
        <div className="mt-8">
          <RecentlyViewed />
        </div>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
