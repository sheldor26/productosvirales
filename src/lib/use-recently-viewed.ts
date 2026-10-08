"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pv_recently_viewed";
const CHANGE_EVENT = "pv-recently-viewed-change";
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
    // "storage" solo dispara en OTRAS pestañas, no en la que escribe; el
    // evento propio cubre esa. Sin esto, abrir varios productos en pestañas
    // de fondo (cmd+click) deja la pestaña base con el historial "congelado"
    // hasta recargar — mismo patrón ya resuelto en use-saved-products.ts.
    const sync = () => setIds(readRecent());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const record = useCallback((id: string) => {
    const current = readRecent();
    const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX_ITEMS);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Mismo caso que use-saved-products.ts: sin persistencia entre
      // recargas, pero el registro en memoria de esta visita sigue andando.
    }
    setIds(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Mismo caso que record(): sin persistencia, pero el estado en
      // memoria de esta visita se limpia igual abajo.
    }
    setIds([]);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { ids, record, clear };
}
