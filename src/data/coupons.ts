import type { Coupon } from "@/lib/types";

// Arranque de octubre: tres cupones vigentes a la vez, escalonados por
// compra mínima. `getApplicableCoupon` se queda con el que más descuento
// da para cada precio, así que las franjas se resuelven solas:
//   >= $250.000      -> FESTEJO1010 ($25.000)
//   $150k a $250k    -> MELI1010 ($15.000)
//   $80k a $150k     -> DOBLE10 ($8.000)
// Los tres son site-wide: el mensaje no menciona la restricción 1P.
export const activeCoupons: Coupon[] = [
  {
    code: "FESTEJO1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-01T09:00:00-03:00",
    validUntil: "2026-10-01T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELI1010",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-01T09:00:00-03:00",
    validUntil: "2026-10-01T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLE10",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-01T09:00:00-03:00",
    validUntil: "2026-10-01T23:59:00-03:00",
    active: true,
  },
];
