-- Sesión persistente del bot de WhatsApp Channels (Baileys).
-- Ver scripts/lib/whatsapp-session-store.mjs y scripts/whatsapp-bootstrap.mjs.
--
-- Correr UNA vez en el SQL Editor de Neon.

-- Fila única (id=1) con la sesión de login completa (creds + claves de
-- Signal) encriptada con AES-256-GCM. GitHub Actions no tiene disco
-- persistente entre corridas, así que esto reemplaza la carpeta que
-- Baileys normalmente escribe en disco (useMultiFileAuthState).
CREATE TABLE IF NOT EXISTS whatsapp_channel_session (
  id           INTEGER PRIMARY KEY,
  session_data TEXT NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
