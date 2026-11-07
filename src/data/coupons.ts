import type { Coupon } from "@/lib/types";

// Cyber Monday del sábado 7/11: siguen los tres escalones de siempre con códigos
// nuevos. Se sacan los cupones vencidos del 6/11 (incluido NADIECYBER).
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> MELIUNAMAS ($80.000)
//   $500k a $1.000k  -> SIGUELAFIESTA ($45.000)
//   $250k a $500k    -> MELIEXTREMO ($20.000)
//   menos de $250k   -> sin badge
// Vigencia declarada en el mensaje: hoy de 00:00 a 23:59.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIEXTREMO",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-07T00:00:00-03:00",
    validUntil: "2026-11-07T23:59:00-03:00",
    active: true,
  },
  {
    code: "SIGUELAFIESTA",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-07T00:00:00-03:00",
    validUntil: "2026-11-07T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIUNAMAS",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-07T00:00:00-03:00",
    validUntil: "2026-11-07T23:59:00-03:00",
    active: true,
  },
];
