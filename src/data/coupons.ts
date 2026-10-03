import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> MODO1010 ($25.000)
//   $150k a $250k    -> MEGA1010 ($15.000)
//   $80k a $150k     -> APROVECHA1010 ($8.000)
//
// Mismos umbrales y montos que el 1/10 y el 2/10, solo cambian los
// códigos. El "1 uso por usuario" es un límite del checkout de MELI,
// no algo que el badge modele.
export const activeCoupons: Coupon[] = [
  {
    code: "MODO1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-03T09:00:00-03:00",
    validUntil: "2026-10-03T23:59:00-03:00",
    active: true,
  },
  {
    code: "MEGA1010",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-03T09:00:00-03:00",
    validUntil: "2026-10-03T23:59:00-03:00",
    active: true,
  },
  {
    code: "APROVECHA1010",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-03T09:00:00-03:00",
    validUntil: "2026-10-03T23:59:00-03:00",
    active: true,
  },
];
