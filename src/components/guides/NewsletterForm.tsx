"use client";

import { useId, useState } from "react";

interface NewsletterFormProps {
  // Ruta de origen (ej. la guía donde está el form), para guardar de dónde
  // vino la suscripción y mandar contenido relacionado.
  source?: string;
}

export function NewsletterForm({ source }: NewsletterFormProps = {}) {
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ref: source }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage("Listo. Te vamos a avisar cuando publiquemos algo nuevo.");
        setEmail("");
        window.gtag?.("event", "newsletter_subscribe_success", {
          page_path: window.location.pathname,
        });
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

  return (
    <form onSubmit={handleSubmit} className="not-prose flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        aria-label="Email"
        aria-describedby={message ? messageId : undefined}
        aria-invalid={status === "error" ? true : undefined}
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "submitting"}
        className="flex-1 px-4 py-2.5 text-sm rounded-[6px] border bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2"
        style={{ borderColor: "var(--border)" }}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-5 py-2.5 text-sm font-semibold rounded-[6px] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--editorial-accent)" }}
      >
        {status === "submitting" ? "Enviando…" : "Suscribirme"}
      </button>
      {message && (
        <p
          id={messageId}
          role={status === "error" ? "alert" : "status"}
          className="sm:w-full text-xs mt-1"
          style={{ color: status === "ok" ? "var(--editorial-accent)" : "var(--text-muted)" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
