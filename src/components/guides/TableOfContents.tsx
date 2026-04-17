"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

function useActiveId(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || ids.length === 0) return;

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the top-most visible heading
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
          setActive(top.target.id);
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function TocList({
  items,
  activeId,
  onItemClick,
}: {
  items: TocItem[];
  activeId: string | null;
  onItemClick?: () => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onItemClick}
              className="block pl-3 py-1 text-sm leading-snug border-l-2 transition-colors"
              style={{
                color: isActive ? "var(--editorial-accent)" : "var(--text-muted)",
                borderLeftColor: isActive ? "var(--editorial-accent)" : "transparent",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveId(items.map((i) => i.id));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop: sticky aside */}
      <nav
        aria-label="Tabla de contenidos"
        className="hidden lg:block sticky top-[96px] self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-2"
      >
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          EN ESTA GUÍA
        </p>
        <TocList items={items} activeId={activeId} />
      </nav>

      {/* Mobile: floating button + drawer */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-[55] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium"
        style={{
          backgroundColor: "var(--editorial-accent)",
          color: "#FFFFFF",
        }}
        aria-label="Abrir tabla de contenidos"
      >
        <List size={16} />
        Secciones
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Tabla de contenidos"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/60"
          />
          <div
            className="rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-[11px] font-semibold tracking-[0.14em]"
                style={{ color: "var(--text-muted)" }}
              >
                EN ESTA GUÍA
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar"
                className="p-1 -mr-1"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>
            <TocList
              items={items}
              activeId={activeId}
              onItemClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
