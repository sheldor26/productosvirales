"use client";

import { useEffect, useState } from "react";

/** Estado real de conexión vía los eventos nativos del navegador (no
 * polling). `navigator.onLine` arranca en `true` para que el primer render
 * del cliente coincida con el SSR (sin esto habría un flash del banner en
 * cada carga, incluso con internet real) y se corrige al toque en el efecto. */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return isOnline;
}
