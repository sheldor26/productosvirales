-- Agrega de qué guía/página vino cada suscriptor, para mandarle contenido
-- relacionado a lo que estaba leyendo cuando dejó el mail.
--
-- Correr UNA vez en el SQL Editor de Neon (dashboard de Vercel → Storage →
-- tu base → Open in Neon → SQL Editor), o con cualquier cliente de Postgres.
--
-- `source_detail` guarda la ruta de origen, ej:
--   "/guias/climatizacion/estufas-electricas"  (form al pie de una guía)
--   "/guias/masajeadores"                       (popup, página de guía)
--   "/"                                          (popup, home)
-- Queda NULL si el suscriptor entró antes de esta columna.

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS source_detail TEXT;
