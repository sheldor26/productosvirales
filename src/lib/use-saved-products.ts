"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pv_saved_products";
const CHANGE_EVENT = "pv-saved-products-change";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  // localStorage no dispara el evento "storage" en la misma pestaña que
  // escribe (solo en otras pestañas) — sin este evento propio, el contador
  // del Header no se actualiza hasta recargar la página.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Productos guardados por el visitante, sin cuentas ni backend: viven en
 * localStorage del navegador. `toggle` agrega/saca un id; `isSaved` chequea
 * uno puntual (para el botón de una card); `ids` es la lista completa (para
 * la página /guardados y el contador del Header).
 */
export function useSavedProducts() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readSaved());
    const sync = () => setIds(readSaved());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = readSaved();
    const wasSaved = current.includes(id);
    const next = wasSaved ? current.filter((x) => x !== id) : [...current, id];
    writeSaved(next);
    setIds(next);
    window.gtag?.("event", "saved_product_toggle", {
      action: wasSaved ? "remove" : "add",
      item_id: id,
    });
  }, []);

  return { ids, isSaved, toggle };
}
