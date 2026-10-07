import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> TODO1010 ($25.000)
//   $150k a $250k    -> DOBLEOFF10 ($15.000)
//   $80k a $150k     -> MELIFEST1010 ($8.000)
//
// Mismos umbrales y montos que vienen desde el 1/10. MELI reusa códigos
// cambiándoles el monto (pasó con APROVECHA1010 el 3 y el 6), así que
// siempre cargar lo que dice el mensaje del día, no asumir por el nombre.
export const activeCoupons: Coupon[] = [
  {
    code: "TODO1010",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-07T09:00:00-03:00",
    validUntil: "2026-10-07T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLEOFF10",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-07T09:00:00-03:00",
    validUntil: "2026-10-07T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIFEST1010",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-07T09:00:00-03:00",
    validUntil: "2026-10-07T23:59:00-03:00",
    active: true,
  },
];
