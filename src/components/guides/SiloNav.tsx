"use client";

import { cn } from "@/lib/utils";
import { useHeaderHidden } from "@/lib/use-header-hidden";

interface SiloNavItem {
  slug: string;
  name: string;
  count: number;
}

/**
 * Barra de categorías de /guias. Comparte el mismo hook de scroll que
 * Header.tsx (useHeaderHidden) para moverse EN EL MISMO MOMENTO que el
 * header: al bajar, el header se esconde y esta barra sube a top-0 (queda
 * pegada arriba, sin el hueco vacío que dejaba el offset fijo); al subir,
 * vuelve a su lugar de siempre, debajo del header. Pedido de Juan,
 * 2026-11-06, con captura de la barra "flotando" con un hueco arriba.
 */
export function SiloNav({ categories }: { categories: SiloNavItem[] }) {
  const headerHidden = useHeaderHidden();

  return (
    <nav
      aria-label="Silos de guías"
      className={cn(
        "sticky z-40 -mx-4 md:-mx-6 px-4 md:px-6 py-2.5 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border)] mb-6 transition-[top] duration-200",
        headerHidden ? "top-0" : "top-14 md:top-16"
      )}
    >
      <ul className="flex gap-[7px] overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        {categories.map((silo) => (
          <li key={silo.slug} className="shrink-0 snap-start">
            <a
              href={`#silo-${silo.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors whitespace-nowrap"
            >
              <span>{silo.name}</span>
              <span className="text-[11.5px] text-[var(--text-muted)]">{silo.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
