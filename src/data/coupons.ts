import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> AHORRA1010 ($25.000)
//   $150k a $250k    -> FESTI1010 ($15.000)
//   $80k a $150k     -> DOBLEAHORRO ($8.000)
//
// Mismos umbrales y montos que vienen desde el 1/10, solo cambian los
// códigos. El "1 uso por usuario" es un límite del checkout de MELI,
// no algo que el badge modele.
export const activeCoupons: Coupon[] = [
  {
    code: "AHORRA1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-04T09:00:00-03:00",
    validUntil: "2026-10-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "FESTI1010",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-04T09:00:00-03:00",
    validUntil: "2026-10-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLEAHORRO",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-04T09:00:00-03:00",
    validUntil: "2026-10-04T23:59:00-03:00",
    active: true,
  },
];
