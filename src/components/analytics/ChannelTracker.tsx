"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Rastreo de clicks en los botones "Sumarme al canal" (Telegram / WhatsApp).
 *
 * Mismo patrón que `AffiliateTracker`: un solo listener delegado a nivel
 * documento, sin tocar los componentes de botón. Filtra por el host del link
 * (t.me / whatsapp.com/channel) y dispara `channel_click` en GA4 con la
 * plataforma y el `data-channel-location` (footer, inline...) para saber qué
 * ubicación convierte más clicks de intención.
 *
 * Esto mide la INTENCIÓN de sumarse (el click), no el alta real en el canal:
 * eso pasa dentro de WhatsApp/Telegram y no hay forma de que este sitio se
 * entere. Para Telegram existe una vía aparte (el bot del canal recibe
 * `chat_member` updates si es admin), pero es un evento del bot, no de la web.
 */
export function ChannelTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const el = event.target as HTMLElement | null;
      const link = el?.closest?.<HTMLAnchorElement>("a[href]");
      if (!link) return;

      let channel: "telegram" | "whatsapp" | null = null;
      if (link.href.includes("t.me/")) channel = "telegram";
      else if (link.href.includes("whatsapp.com/channel/")) channel = "whatsapp";
      if (!channel) return;

      const payload = {
        channel,
        channel_location: link.dataset.channelLocation || "otro",
        page_path: window.location.pathname,
      };

      window.gtag?.("event", "channel_click", payload);
      track("channel_click", payload);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
