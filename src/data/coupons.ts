import type { Coupon } from "@/lib/types";

// Tres cupones de Cyber Monday, los tres del 2/11, vigentes 00:00 a 23:59 (hoy).
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> NOVIEMBREON ($80.000)
//   $500k a $1.000k  -> CYBERARRANCA ($45.000)
//   $250k a $500k    -> MELICYBER26 ($20.000)
//   menos de $250k   -> sin badge
export const activeCoupons: Coupon[] = [
  {
    code: "MELICYBER26",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERARRANCA",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "NOVIEMBREON",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: true,
  },
];
