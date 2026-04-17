"use client";

import { useState } from "react";

export function NewsletterForm() {
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
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage("Listo. Te vamos a avisar cuando publiquemos algo nuevo.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Hubo un error. Probá de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Hubo un error. Probá de nuevo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        aria-label="Email"
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
          className="sm:w-full text-xs mt-1"
          style={{ color: status === "ok" ? "var(--editorial-accent)" : "var(--text-muted)" }}
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
