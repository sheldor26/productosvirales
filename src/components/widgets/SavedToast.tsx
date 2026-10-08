"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, HeartCrack } from "lucide-react";
import { SAVED_TOAST_EVENT } from "@/lib/use-saved-products";

/** Guardar un producto hoy solo cambia el corazón a rojo — en mobile, si ya
 * se hizo scroll lejos del Header, el contador que sube no se ve y la acción
 * pasa inadvertida. Este toast confirma la acción y, más importante, suma un
 * CTA directo a /guardados (hoy esa página solo se descubre desde el Header).
 * Arriba y anclado a la derecha (no abajo: el sitio ya tiene varios
 * elementos fixed/bottom compitiendo, ver OfflineBanner.tsx) y no full-width
 * (a diferencia de OfflineBanner, que sí lo es) para que ambos puedan
 * coexistir sin pisarse si llegan a mostrarse a la vez. */
export function SavedToast() {
  const [toast, setToast] = useState<"add" | "remove" | null>(null);

  useEffect(() => {
    const onToast = (e: Event) => {
      const action = (e as CustomEvent<{ action: "add" | "remove" }>).detail?.action;
      if (!action) return;
      setToast(action);
    };
    window.addEventListener(SAVED_TOAST_EVENT, onToast);
    return () => window.removeEventListener(SAVED_TOAST_EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const added = toast === "add";

  return (
    <div
      role="status"
      aria-live="polite"
      className="saved-toast-in fixed top-[72px] right-3 sm:right-5 z-[65] print:hidden"
    >
      <Link
        href="/guardados"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] shadow-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
      >
        {added ? (
          <Heart size={16} className="text-[#ef4444] shrink-0" fill="#ef4444" />
        ) : (
          <HeartCrack size={16} className="text-[var(--text-muted)] shrink-0" />
        )}
        <span>{added ? "Guardado" : "Quitado de guardados"}</span>
        <span className="font-medium underline decoration-[var(--border)] underline-offset-2 whitespace-nowrap">
          Ver mi lista
        </span>
      </Link>
    </div>
  );
}
