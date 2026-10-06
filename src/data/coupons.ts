import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> APROVECHA1010 ($25.000)
//   $150k a $250k    -> SUPER1010 ($15.000)
//   $80k a $150k     -> DOBLEFEST10 ($8.000)
//
// Ojo: APROVECHA1010 ya se usó el 3/10 pero con otros términos ($8.000
// desde $80.000). MELI reusa códigos cambiando el monto, así que hay que
// leer el mensaje del día, no asumir por el nombre.
export const activeCoupons: Coupon[] = [
  {
    code: "APROVECHA1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-06T09:00:00-03:00",
    validUntil: "2026-10-06T23:59:00-03:00",
    active: true,
  },
  {
    code: "SUPER1010",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-06T09:00:00-03:00",
    validUntil: "2026-10-06T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLEFEST10",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-06T09:00:00-03:00",
    validUntil: "2026-10-06T23:59:00-03:00",
    active: true,
  },
];
