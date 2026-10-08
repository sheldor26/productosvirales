"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, HeartCrack } from "lucide-react";
import { SAVED_TOAST_EVENT, useSavedProducts } from "@/lib/use-saved-products";

/** Guardar un producto hoy solo cambia el corazón a rojo — en mobile, si ya
 * se hizo scroll lejos del Header, el contador que sube no se ve y la acción
 * pasa inadvertida. Este toast confirma la acción y suma un CTA: "Ver mi
 * lista" al guardar, "Deshacer" al sacar uno (sacar un producto por un tap
 * de pulgar equivocado era irreversible — mismo patrón de snackbar con
 * undo transitorio de Material Design / eBay, en vez de un confirm() que
 * la gente ignora por reflejo). Arriba y anclado a la derecha (no abajo:
 * el sitio ya tiene varios elementos fixed/bottom compitiendo, ver
 * OfflineBanner.tsx) y no full-width (a diferencia de OfflineBanner) para
 * que ambos puedan coexistir sin pisarse si llegan a mostrarse a la vez. */
export function SavedToast() {
  const { toggle } = useSavedProducts();
  const [toast, setToast] = useState<{ action: "add" | "remove"; id: string } | null>(null);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<{ action: "add" | "remove"; id: string }>).detail;
      if (!detail?.id) return;
      setToast(detail);
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

  const added = toast.action === "add";

  return (
    <div
      role="status"
      aria-live="polite"
      className="saved-toast-in fixed top-[72px] right-3 sm:right-5 z-[65] print:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] shadow-lg text-sm text-[var(--text-primary)]"
    >
      {added ? (
        <Heart size={16} className="text-[#ef4444] shrink-0" fill="#ef4444" />
      ) : (
        <HeartCrack size={16} className="text-[var(--text-muted)] shrink-0" />
      )}
      <span>{added ? "Guardado" : "Quitado de guardados"}</span>
      {added ? (
        <Link
          href="/guardados"
          className="font-medium underline decoration-[var(--border)] underline-offset-2 whitespace-nowrap hover:text-[var(--text-secondary)]"
        >
          Ver mi lista
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            toggle(toast.id);
            setToast(null);
          }}
          className="font-medium underline decoration-[var(--border)] underline-offset-2 whitespace-nowrap hover:text-[var(--text-secondary)] cursor-pointer"
        >
          Deshacer
        </button>
      )}
    </div>
  );
}
