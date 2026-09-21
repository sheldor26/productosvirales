"use client";

import { Heart } from "lucide-react";
import { useSavedProducts } from "@/lib/use-saved-products";

interface SaveHeartButtonProps {
  productId: string;
  productTitle: string;
}

/** Botón de "guardar" (localStorage) de la ficha de producto. Isla cliente
 * chica: es lo único de la buy box que necesita estado en el navegador — el
 * resto de ProductDetail es presentacional y corre en el server. */
export function SaveHeartButton({ productId, productTitle }: SaveHeartButtonProps) {
  const { isSaved, toggle } = useSavedProducts();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      aria-label={saved ? `Sacar ${productTitle} de guardados` : `Guardar ${productTitle}`}
      title={saved ? "Sacar de guardados" : "Guardar producto"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors cursor-pointer motion-safe:active:scale-90"
    >
      <Heart size={15} className={saved ? "text-[#ef4444]" : ""} fill={saved ? "#ef4444" : "none"} />
    </button>
  );
}
