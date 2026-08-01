"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CATEGORY_NAV } from "@/data/category-nav";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8OJXB6mYPIHG0M4a1t";

// "Viral ahora" va a /trending; el resto son los hubs de categoría (CATEGORY_NAV,
// misma fuente que el dropdown del header — así mobile linkea TODOS los hubs).
const navCategories = [
  { slug: "viral", label: "Viral ahora", href: "/trending", icon: Flame, color: "#ef4444" as string | undefined },
  ...CATEGORY_NAV.map((c) => ({
    slug: c.slug,
    label: c.label,
    href: `/categoria/${c.slug}`,
    icon: c.icon,
    color: undefined as string | undefined,
  })),
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Al abrir: recordar quién abrió y mover el foco al botón cerrar; Escape cierra;
  // Tab/Shift+Tab quedan atrapados dentro del panel (si no, tabular de más saca
  // el foco al header de atrás, que sigue en el árbol aunque esté tapado).
  // Al cerrar: devolver el foco al elemento que lo abrió (el hamburguesa).
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement;
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
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
    openerRef.current?.focus?.();
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        inert={!open}
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-[var(--bg-primary)] shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Menú
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-65px)]">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener"
            data-channel-location="header"
            className="flex items-center justify-center gap-2 mb-3 px-3 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}
          >
            <WhatsAppIcon size={16} />
            Sumate a nuestro canal de WhatsApp
          </a>

          <Link
            href="/"
            onClick={onClose}
            className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            Inicio
          </Link>
          <Link
            href="/trending"
            onClick={onClose}
            className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            Trending
          </Link>

          <div className="pt-3 pb-2">
            <span className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Categorías
            </span>
          </div>

          {navCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Icon size={16} style={cat.color ? { color: cat.color } : undefined} />
                {cat.label}
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              href="/guias"
              onClick={onClose}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            >
              Guías
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
