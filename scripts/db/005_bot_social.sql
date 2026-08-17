-- Estado del bot social autónomo (Instagram, Threads, X).
-- Ver tasks/bot-social.md y scripts/bot-social.mjs.
--
-- Correr UNA vez en el SQL Editor de Neon.

-- Qué se publicó, dónde y cuándo. Es la memoria que impide repetir el mismo
-- producto en la misma red antes de que pasen 30 días (gate 4 de bot-gates.mjs).
CREATE TABLE IF NOT EXISTS bot_posts (
  id           BIGSERIAL PRIMARY KEY,
  red          TEXT NOT NULL,          -- 'instagram' | 'threads' | 'x'
  product_id   TEXT NOT NULL,
  media_id     TEXT,                   -- id que devuelve la API de la red
  price        INTEGER NOT NULL,       -- precio con el que salió publicado
  affiliate_url TEXT NOT NULL,
  caption      TEXT,
  posted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- El índice que realmente se usa: "¿publiqué este producto en esta red hace poco?"
CREATE INDEX IF NOT EXISTS bot_posts_red_producto_fecha
  ON bot_posts (red, product_id, posted_at DESC);

-- Corte de emergencia sin necesidad de deploy ni de tocar secrets de GitHub.
-- Si hay una fila con activo = true, el bot no publica nada y avisa por Telegram.
--   INSERT INTO bot_kill_switch (motivo) VALUES ('precio raro en el Roborock');
--   UPDATE bot_kill_switch SET activo = false WHERE activo;
CREATE TABLE IF NOT EXISTS bot_kill_switch (
  id         BIGSERIAL PRIMARY KEY,
  activo     BOOLEAN NOT NULL DEFAULT true,
  motivo     TEXT,
  creado_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bitácora de corridas: sirve para entender por qué un día no publicó nada
-- (todos los productos bloqueados por gates, kill switch activo, error de API).
CREATE TABLE IF NOT EXISTS bot_runs (
  id           BIGSERIAL PRIMARY KEY,
  red          TEXT NOT NULL,
  resultado    TEXT NOT NULL,          -- 'publicado' | 'publicado-sin-registro' | 'sin-candidatos' | 'kill-switch' | 'error'
  product_id   TEXT,
  detalle      TEXT,
  corrida_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
