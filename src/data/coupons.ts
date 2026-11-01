import type { Coupon } from "@/lib/types";

// Dos cupones vigentes a la vez, los dos del 1/11. CYBERMON llegó a la tarde
// como "el último cupón del día", así que SE SUMA a SEVIENECYBERM en vez de
// reemplazarlo: el de la mañana sigue vigente hasta las 23:59.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $250.000      -> SEVIENECYBERM ($20.000)
//   $120k a $250k    -> CYBERMON ($12.000)
//   menos de $120k   -> sin badge
//
// CYBERMON no trae vigencia declarada; se le pone el mismo corte de hoy 23:59,
// que además es lo que dice el texto ("antes de que termine el día").
export const activeCoupons: Coupon[] = [
  {
    code: "SEVIENECYBERM",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-01T09:00:00-03:00",
    validUntil: "2026-11-01T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERMON",
    discountAmount: 12000,
    minPurchase: 120000,
    validFrom: null,
    validUntil: "2026-11-01T23:59:00-03:00",
    active: true,
  },
];
