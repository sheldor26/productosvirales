import type { Coupon } from "@/lib/types";

// Fecha doble 11.11 (miércoles 11/11): tres escalones de monto fijo, los mismos
// tramos de la previa de ayer pero con códigos nuevos. Se sacan los de ayer.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $500.000      -> MELIDOBLEON ($45.000)
//   $250k a $500k    -> 11FECHADOBLE26 ($20.000)
//   $150k a $250k    -> 11X11MELI ($10.000)
//   menos de $150k   -> sin badge
//
// Ojo con la vigencia: el mensaje dice "a partir de las 00:00 HS" y no trae hora
// de cierre. Se asume 23:59 de hoy (11/11), como pide el runbook. Si ML los
// extiende a mañana, subir validUntil.
export const activeCoupons: Coupon[] = [
  {
    code: "11X11MELI",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
  {
    code: "11FECHADOBLE26",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIDOBLEON",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
];
