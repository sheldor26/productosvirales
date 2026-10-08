"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "lucide-react";
import { useScrollLock } from "@/lib/use-scroll-lock";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  useScrollLock(mobileOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // A diferencia de MobileNav (que arranca con un ref nulo hasta la primera
  // apertura), acá `triggerRef` ya apunta a un botón real desde el montaje:
  // sin este flag, la rama de "devolver el foco" se dispararía también en el
  // montaje inicial y le robaría el foco al botón "Secciones" apenas carga
  // la guía, sin que nadie haya abierto nada.
  const wasOpenRef = useRef(false);

  // Mismo patrón de trampa de foco que MobileNav.tsx: sin esto, una persona
  // que navega con teclado o lector de pantalla abre el drawer y el foco se
  // queda atrás, en la página tapada por el overlay, sin forma evidente de
  // volver. Foco inicial en "Cerrar", Tab/Shift+Tab atrapados adentro,
  // Escape cierra, y el foco vuelve al botón "Secciones" al cerrar.
  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true;
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileOpen(false);
          return;
        }
        if (e.key !== "Tab" || !panelRef.current) return;
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
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
        ref={triggerRef}
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-[76px] right-4 z-[55] flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg text-[13px] font-medium"
        style={{
          backgroundColor: "var(--editorial-accent)",
          color: "#FFFFFF",
        }}
        aria-label="Abrir tabla de contenidos"
        aria-expanded={mobileOpen}
        aria-controls="toc-mobile-panel"
      >
        <List size={16} />
        Secciones
      </button>

      {mobileOpen && (
        <div
          ref={panelRef}
          id="toc-mobile-panel"
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
                ref={closeRef}
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
