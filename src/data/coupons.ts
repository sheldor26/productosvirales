import type { Coupon } from "@/lib/types";

// Viernes 27/11 (Black Friday): tres cupones del mismo monto, $9.000 desde $90.000.
// El mensaje solo traia codigos y hora de inicio; monto, minima y vigencia salen de
// las condiciones de cada cupon en la cuenta de ML (campanias 14815150, 14815268 y
// 14149841).
// Restricciones que el badge NO puede mostrar: solo productos seleccionados vendidos
// por Mercado Libre (1P), solo en la app, no se suman con otras promociones, y cada
// campania corta al llegar a $5.328.000 en descuentos (pueden agotarse antes de las
// 23:59).
// A las 10:00 se sumo BLACKNDN, $12.000 desde $120.000 (campania 14149775, mismas
// restricciones, corte al llegar a $23.348.000 en descuentos).
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $120.000      -> BLACKNDN ($12.000)
//   $90k a $120k     -> uno de los tres de $9.000
//   menos de $90k    -> sin badge
export const activeCoupons: Coupon[] = [
  {
    code: "CADAVIERNES",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:00:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
  {
    code: "BLACKSHOW",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:00:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
  {
    code: "APROVECHA",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:30:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
  {
    code: "BLACKNDN",
    discountAmount: 12000,
    minPurchase: 120000,
    validFrom: "2026-11-27T10:00:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
];
