"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pv_recently_viewed";
const MAX_ITEMS = 8;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Historial de fichas vistas, sin cuentas ni backend: vive en localStorage
 * del navegador. A diferencia de "Guardados" (intención explícita, botón de
 * corazón), esto es pasivo: se registra solo al visitar una ficha. `record`
 * mueve el id al frente (o lo agrega) y recorta a MAX_ITEMS; `ids` es la
 * lista completa, más reciente primero.
 */
export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readRecent());
  }, []);

  const record = useCallback((id: string) => {
    const current = readRecent();
    const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIds(next);
  }, []);

  return { ids, record };
}
