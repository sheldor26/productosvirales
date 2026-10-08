"use client";

import { useEffect, useRef, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useOnlineStatus } from "@/lib/use-online-status";

/** Si se corta la conexión a mitad de una visita (subte, corte de datos),
 * el click a "Ir a MercadoLibre" simplemente no hace nada y no hay forma de
 * saber si es un problema del sitio o de la red. Arriba de todo (no abajo:
 * el sitio ya tiene 5 elementos fixed/bottom distintos según la página —
 * StickyMobileCta, StickyBuyBar, el botón de comparar, TableOfContents,
 * NewsletterBanner — así que esquiva esa zona entera en vez de competir). */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      setShowReconnected(false);
      return;
    }
    if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-[60] print:hidden flex items-center justify-center gap-2 py-2 text-xs font-medium text-white"
      style={{ backgroundColor: isOnline ? "var(--color-trending-up)" : "#d97706" }}
    >
      {isOnline ? (
        <>
          <Wifi size={14} />
          Conexión restablecida
        </>
      ) : (
        <>
          <WifiOff size={14} />
          Sin conexión — lo que guardaste sigue acá
        </>
      )}
    </div>
  );
}
