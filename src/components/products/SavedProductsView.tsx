"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, RotateCcw, Share2, Check } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SortableProductGrid } from "@/components/products/SortableProductGrid";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { useSavedProducts } from "@/lib/use-saved-products";
import type { CardProduct } from "@/lib/types";

function ShareButton({ ids }: { ids: string[] }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/guardados?ids=${encodeURIComponent(ids.join(","))}`;
    window.gtag?.("event", "saved_products_share", { count: ids.length });
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "Mi lista de ProductosVirales" });
        return;
      } catch {
        // Cancelado por el usuario o no soportado: caer al copiado.
      }
    }
    // Igual que CouponBadge: si el navegador no da clipboard (contexto no
    // seguro o permiso denegado), el click no hace nada — nunca peor que no
    // tener el botón.
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-1.5 text-sm font-medium rounded-[var(--radius-pill)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] px-3.5 py-1.5 transition-colors cursor-pointer"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Link copiado" : "Compartir lista"}
    </button>
  );
}

// Lista compartida: alguien mandó un link con /guardados?ids=..., no son los
// guardados del visitante que abre el link. Se muestra aparte, sin mezclar
// con lo que ese visitante ya tenga guardado, y ofrece sumarla a lo propio.
function SharedListView({ sharedIds }: { sharedIds: string[] }) {
  const { addMany } = useSavedProducts();
  const [products, setProducts] = useState<CardProduct[] | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/saved-products?ids=${encodeURIComponent(sharedIds.join(","))}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CardProduct[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [sharedIds]);

  if (products === null) return <ProductGrid products={[]} loading />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap rounded-[var(--radius-card)] bg-[var(--bg-secondary)] px-4 py-3">
        <p className="text-sm text-[var(--text-secondary)]">
          Te compartieron esta lista ({products.length} producto{products.length !== 1 ? "s" : ""}).{" "}
          <Link href="/guardados" className="underline decoration-[var(--border)] underline-offset-2">
            Ver tus guardados
          </Link>
        </p>
        {products.length > 0 && (
          <button
            type="button"
            onClick={() => {
              addMany(products.map((p) => p.id));
              setSaved(true);
            }}
            disabled={saved}
            className="flex items-center gap-1.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] px-3.5 py-1.5 disabled:opacity-60 cursor-pointer"
          >
            {saved ? <Check size={14} /> : <Heart size={14} />}
            {saved ? "Guardada" : "Guardar toda la lista"}
          </button>
        )}
      </div>
      {products.length > 1 ? <SortableProductGrid products={products} /> : <ProductGrid products={products} />}
    </div>
  );
}

export function SavedProductsView() {
  const { ids } = useSavedProducts();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<CardProduct[] | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  const sharedIds = (searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    // En modo lista compartida, SharedListView hace su propio fetch — este
    // efecto no tiene nada que resolver todavía (ids puede estar vacío al
    // llegar por link directo, sin que eso signifique "no guardó nada").
    if (sharedIds.length > 0) return;
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
  }, [ids, retryTick, sharedIds.length]);

  if (sharedIds.length > 0) {
    return <SharedListView sharedIds={sharedIds} />;
  }

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

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <ShareButton ids={products.map((p) => p.id)} />
      </div>
      {/* Con 2+ guardados, dar orden/comparar (mismo módulo de categorías y
          búsqueda): "guardar" ya es intención alta, esta vista es donde el
          visitante decide entre las opciones que juntó. */}
      {products.length > 1 ? (
        <SortableProductGrid products={products} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
