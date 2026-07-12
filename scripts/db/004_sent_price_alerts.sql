-- Registro de qué baja de precio ya se le avisó a cada suscriptor, para NO
-- reenviar la misma si el workflow se re-ejecuta, reintenta, o el PR de precios
-- no se mergeó antes de la siguiente corrida (ver notify-price-drops-email.cjs).
--
-- Correr UNA vez en el SQL Editor de Neon.

CREATE TABLE IF NOT EXISTS sent_price_alerts (
  email      TEXT NOT NULL,
  product_id TEXT NOT NULL,
  price      INTEGER NOT NULL,   -- precio nuevo (con el que se avisó)
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (email, product_id, price)
);
