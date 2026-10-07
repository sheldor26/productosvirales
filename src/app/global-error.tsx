"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // global-error reemplaza el layout raíz entero (Header/Footer incluidos),
    // así que necesita su propio <html>/<body> y estilos inline: es la última
    // red de contención, no puede depender de que el resto del sitio funcione.
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#fff",
          color: "#111",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "#6b7280",
              marginBottom: 12,
            }}
          >
            ALGO SALIÓ MAL
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            El sitio tuvo un problema
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, color: "#4b5563" }}>
            No es algo que hayas hecho vos. Probá de nuevo en un momento.
          </p>
          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => unstable_retry()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 6,
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
