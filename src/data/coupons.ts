import type { Coupon } from "@/lib/types";

// Día 3 de Cyber Monday: mismos tres tramos y montos, solo cambian los códigos.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> CYBERENCENDIDO ($80.000)
//   $500k a $1.000k  -> MELIROMPETODO ($45.000)
//   $250k a $500k    -> CYBERALMAX ($20.000)
//   menos de $250k   -> sin badge
//
// Hoy arrancan a las 10:00, no a las 00:00 como el 2/11, de ahí el validFrom.
export const activeCoupons: Coupon[] = [
  {
    code: "CYBERALMAX",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIROMPETODO",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERENCENDIDO",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
];
