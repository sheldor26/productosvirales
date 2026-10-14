import type { Coupon } from "@/lib/types";

// Tres cupones vigentes a la vez, escalonados por compra mínima.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $250.000      -> MIMOPARAMA ($25.000)
//   $150k a $250k    -> MAMAOFF ($15.000)
//   $80k a $150k     -> FESTEJAMAMA ($8.000)
//
// Tercera tanda de Día de la Madre (la fecha es el domingo 18/10): mismos
// umbrales y montos que vienen desde el 1/10, solo cambian los códigos. El
// mensaje sugiere repartirlos por categoría (moda, hogar, tecno), pero los
// cupones no están limitados por categoría — es solo una idea de contenido,
// así que acá siguen entrando por precio, como siempre.
export const activeCoupons: Coupon[] = [
  {
    code: "MIMOPARAMA",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-14T09:00:00-03:00",
    validUntil: "2026-10-14T23:59:00-03:00",
    active: true,
  },
  {
    code: "MAMAOFF",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-14T09:00:00-03:00",
    validUntil: "2026-10-14T23:59:00-03:00",
    active: true,
  },
  {
    code: "FESTEJAMAMA",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-14T09:00:00-03:00",
    validUntil: "2026-10-14T23:59:00-03:00",
    active: true,
  },
];
