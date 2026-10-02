import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> DESCUENTO1010 ($25.000)
//   $150k a $250k    -> AHORRO1010 ($15.000)
//   $80k a $150k     -> OFERTA1010 ($8.000)
//
// Mismos umbrales y montos que los del 1/10, solo cambian los códigos.
// MELI aclara "1 uso por usuario", que es un límite de su checkout y no
// algo que el badge modele.
export const activeCoupons: Coupon[] = [
  {
    code: "DESCUENTO1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-02T09:00:00-03:00",
    validUntil: "2026-10-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "AHORRO1010",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-02T09:00:00-03:00",
    validUntil: "2026-10-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "OFERTA1010",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-02T09:00:00-03:00",
    validUntil: "2026-10-02T23:59:00-03:00",
    active: true,
  },
];
