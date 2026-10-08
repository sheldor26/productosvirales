"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pv_saved_products";
const CHANGE_EVENT = "pv-saved-products-change";
/** Evento aparte del de sincronización: solo lo dispara un toggle individual
 * (nunca `addMany`, que es una importación masiva de una lista compartida —
 * no tiene sentido un toast por cada ítem) y lleva el detalle para que el
 * toast sepa si mostrar "Guardado" o "Quitado de guardados". */
export const SAVED_TOAST_EVENT = "pv-saved-toast";

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
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Modo privado o cuota agotada: no persiste entre recargas, pero no
    // debe cortar acá — dispatchEvent/setIds (en el caller) siguen
    // corriendo para que el corazón responda igual durante esta visita.
  }
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
    window.dispatchEvent(
      new CustomEvent(SAVED_TOAST_EVENT, { detail: { action: wasSaved ? "remove" : "add", id } })
    );
    window.gtag?.("event", "saved_product_toggle", {
      action: wasSaved ? "remove" : "add",
      item_id: id,
    });
  }, []);

  // Para "Guardar todos" al abrir una lista compartida: agrega los que
  // falten sin tocar los que el visitante ya tenía guardados.
  const addMany = useCallback((newIds: string[]) => {
    const current = readSaved();
    const merged = [...current, ...newIds.filter((id) => !current.includes(id))];
    writeSaved(merged);
    setIds(merged);
    window.gtag?.("event", "saved_products_import", { count: newIds.length });
  }, []);

  return { ids, isSaved, toggle, addMany };
}
