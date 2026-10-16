import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> MAMAREGALO ($25.000)
//   $150k a $250k    -> MAMATEAMA ($15.000)
//   $80k a $150k     -> MAMAFEST ($8.000)
//
// Quinta tanda de Día de la Madre (la fecha es el domingo 18/10): mismos
// umbrales y montos que vienen desde el 1/10, solo cambian los códigos.
// Vienen renovando la tanda todos los días de esta semana.
export const activeCoupons: Coupon[] = [
  {
    code: "MAMAREGALO",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-16T09:00:00-03:00",
    validUntil: "2026-10-16T23:59:00-03:00",
    active: true,
  },
  {
    code: "MAMATEAMA",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-16T09:00:00-03:00",
    validUntil: "2026-10-16T23:59:00-03:00",
    active: true,
  },
  {
    code: "MAMAFEST",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-16T09:00:00-03:00",
    validUntil: "2026-10-16T23:59:00-03:00",
    active: true,
  },
];
