import type { Coupon } from "@/lib/types";

// Día 2 de Cyber Monday: mismos tres tramos de ayer, solo cambian los códigos.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> ARRANCAMELI ($80.000)
//   $500k a $1.000k  -> CYBEREXPLOTA ($45.000)
//   $250k a $500k    -> MELIMODOCYBER ($20.000)
//   menos de $250k   -> sin badge
//
// El mensaje no trae vigencia; se asume el corte de siempre (hoy 23:59), igual
// que ayer. Sin `validFrom`: ya están activos.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIMODOCYBER",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-03T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBEREXPLOTA",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-03T23:59:00-03:00",
    active: true,
  },
  {
    code: "ARRANCAMELI",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-03T23:59:00-03:00",
    active: true,
  },
];
