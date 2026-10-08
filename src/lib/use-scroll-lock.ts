"use client";

import { useEffect } from "react";

/** Bloquea el scroll del body mientras `locked` es true y restaura la
 * posición exacta donde estaba al desbloquear. Sin esto, un modal/drawer con
 * overlay (MobileNav.tsx, TableOfContents.tsx) deja que la página de atrás
 * siga scrolleando detrás del panel, y al cerrar se pierde el punto de
 * lectura. `position: fixed` + offset (no `overflow: hidden` solo) porque
 * en iOS Safari `overflow: hidden` en el body no frena el scroll táctil. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
