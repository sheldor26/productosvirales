import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> MAMAMELI ($25.000)
//   $150k a $250k    -> MELIMAMA ($15.000)
//   $80k a $150k     -> MIMAMERECE ($8.000)
//
// Segunda tanda de Día de la Madre (la fecha es el domingo 18/10): mismos
// umbrales y montos que vienen desde el 1/10, solo cambian los códigos. Ojo
// que MELIMAMA y MAMAMELI son códigos distintos con montos distintos, no un
// typo. MELI reusa códigos cambiándoles el monto (pasó con APROVECHA1010 el 3
// y el 6), así que siempre cargar lo que dice el mensaje del día.
export const activeCoupons: Coupon[] = [
  {
    code: "MAMAMELI",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-13T09:00:00-03:00",
    validUntil: "2026-10-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIMAMA",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-13T09:00:00-03:00",
    validUntil: "2026-10-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "MIMAMERECE",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-13T09:00:00-03:00",
    validUntil: "2026-10-13T23:59:00-03:00",
    active: true,
  },
];
