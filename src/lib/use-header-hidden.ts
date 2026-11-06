"use client";

import { useSyncExternalStore } from "react";

/**
 * Mismo algoritmo de "esconder al bajar, mostrar al subir" que ya usaba
 * Header.tsx (patrón Material "Hide App Bar"), ahora como un único listener
 * de scroll global (useSyncExternalStore) en vez de uno por componente: con
 * dos instancias independientes del mismo hook (una en Header.tsx, otra en
 * SiloNav.tsx de /guias) cada una llevaba su propio último scrollY y podían
 * desincronizarse por el orden exacto en que React procesa cada evento —
 * el header quedaba visible mientras la barra de categorías ya se había
 * movido a top-0, dejando un hueco (reportado por Juan, 2026-11-06). Con una
 * sola fuente de verdad compartida, todo lo que use este hook se mueve
 * exactamente en el mismo momento.
 *
 * `disabled` fuerza visible (usado por Header.tsx mientras el dropdown de
 * categorías o el buscador están abiertos, para no esconderse a mitad de
 * una interacción) — es local a cada suscriptor, no afecta el estado
 * compartido de scroll.
 */

let hiddenByScroll = false;
let lastScrollY = 0;
const listeners = new Set<() => void>();

function handleScroll() {
  const y = window.scrollY;
  const delta = y - lastScrollY;
  let next = hiddenByScroll;
  if (y < 80) {
    next = false;
  } else if (delta > 10) {
    next = true;
  } else if (delta < -10) {
    next = false;
  }
  lastScrollY = y;
  if (next !== hiddenByScroll) {
    hiddenByScroll = next;
    listeners.forEach((l) => l());
  }
}

let listenerCount = 0;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (listenerCount === 0) {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  listenerCount++;
  return () => {
    listeners.delete(onStoreChange);
    listenerCount--;
    if (listenerCount === 0) {
      window.removeEventListener("scroll", handleScroll);
    }
  };
}

function getSnapshot() {
  return hiddenByScroll;
}

function getServerSnapshot() {
  return false;
}

export function useHeaderHidden(disabled = false) {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return disabled ? false : hidden;
}
