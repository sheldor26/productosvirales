-- Baja de suscripción (obligatorio por ley para mails de marketing).
-- Cada mail de alerta lleva un link de baja con token firmado; al abrirlo,
-- /api/unsubscribe marca esta columna en true y el cron deja de mandarle.
--
-- Correr UNA vez en el SQL Editor de Neon (dashboard de Vercel → Storage →
-- tu base → Open in Neon → SQL Editor), o con cualquier cliente de Postgres.

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN NOT NULL DEFAULT false;
