-- Tabla de captación de emails (newsletter / alertas).
-- Correr UNA vez en el SQL Editor de Neon (dashboard de Vercel → Storage →
-- tu base → Open in Neon → SQL Editor), o con cualquier cliente de Postgres.
--
-- No manda mails: solo guarda la lista para usarla más adelante.

CREATE TABLE IF NOT EXISTS subscribers (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT NOT NULL DEFAULT 'newsletter',
  ip         TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Para exportar/ordenar por fecha rápido cuando crezca.
CREATE INDEX IF NOT EXISTS subscribers_created_at_idx
  ON subscribers (created_at DESC);
