"use client";

import { useEffect, useId, useState } from "react";

// Captación de emails. Banner NO bloqueante abajo a la derecha (mobile: barra
// abajo, por encima de la sticky de compra). NO tapa el contenido ni los botones
// de afiliado: aparece recién cuando el lector ya recorrió la mayor parte de la
// guía (o sea, después de ver los productos, no antes de comprar). Se cierra con
// ✕ o Esc y no vuelve a molestar (localStorage). Si se suscribe, tampoco.

const STORAGE_KEY = "pv_newsletter_banner"; // valor: "dismissed" | "subscribed"

// Fracción de la página que hay que recorrer para que aparezca. 0.6 = ya vio el
// grueso del contenido y los product-cards. Antes saltaba a los 400px (arriba de
// todo, tapando el CTA); eso mataba la conversión.
const TRIGGER_SCROLL_RATIO = 0.6;

export function NewsletterBanner() {
  const messageId = useId();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Si ya lo descartó o ya se suscribió, ni enganchamos el scroll.
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const full = document.documentElement.scrollHeight;
      // Necesita recorrido real (guías largas) Y haber pasado el umbral de ratio.
      if (window.scrollY > 600 && full > 0 && scrolled / full >= TRIGGER_SCROLL_RATIO) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si carga ya scrolleado
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // localStorage puede fallar (modo privado); no es crítico.
    }
  }

  // Cerrar con Escape mientras está abierto.
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ref: window.location.pathname }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage("Listo. Te escribo cuando tenga algo que valga la pena.");
        setEmail("");
        window.gtag?.("event", "newsletter_subscribe_success", {
          page_path: window.location.pathname,
        });
        try {
          localStorage.setItem(STORAGE_KEY, "subscribed");
        } catch {}
        window.setTimeout(() => setShow(false), 3500);
      } else {
        setStatus("error");
        setMessage(
          data.error ||
            "No salió. Probá de nuevo en un rato; si sigue fallando, escribime a hola@productosvirales.com.ar."
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "No salió. Probá de nuevo en un rato; si sigue fallando, escribime a hola@productosvirales.com.ar."
      );
    }
  }

  if (!show) return null;

  return (
    <div
      className="newsletter-banner fixed z-40 left-3 right-3 bottom-[84px] sm:left-auto sm:right-5 sm:bottom-5 sm:w-[380px]"
    >
      <div
        role="dialog"
        aria-label="Suscripción al newsletter"
        className="newsletter-popup relative rounded-[18px] border p-5"
        style={{
          background: "var(--bg-primary)",
          borderColor: "var(--border)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none opacity-60 transition-opacity hover:opacity-100"
          style={{ color: "var(--text-muted)" }}
        >
          ×
        </button>

        <div className="pr-4">
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Te paso los que valen la pena
          </p>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Un mail cada tanto con lo que reviso y recomiendo. Sin spam, sin vender humo.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
            <input
              type="email"
              required
              aria-label="Email"
              aria-describedby={message ? messageId : undefined}
              aria-invalid={status === "error" ? true : undefined}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "ok"}
              className="w-full rounded-[12px] border px-4 py-3 text-sm focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "ok"}
              className="w-full rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
            >
              {status === "submitting" ? "Enviando…" : "Avisame"}
            </button>
          </form>

          {message && (
            <p
              id={messageId}
              role={status === "error" ? "alert" : "status"}
              className="mt-3 text-xs"
              style={{ color: status === "error" ? "var(--text-secondary)" : "var(--text-primary)" }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
