import type { Coupon } from "@/lib/types";

// Cyber Monday del lunes 9/11, ultimo dia: siguen los tres escalones de siempre con
// codigos nuevos. Se sacan los cupones vencidos del 8/11.
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $1.000.000    -> ULTIMACHANCE ($80.000)
//   $500k a $1.000k  -> CHAUCYBER ($45.000)
//   $250k a $500k    -> YATERMINA ($20.000)
//   menos de $250k   -> sin badge
// Vigencia: el mensaje dice "hoy lunes 9/11 hasta las 23:59" sin hora de inicio; Juan
// avisó que arrancan a las 00:00, por eso validFrom es el comienzo del lunes.
export const activeCoupons: Coupon[] = [
  {
    code: "YATERMINA",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-09T00:00:00-03:00",
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "CHAUCYBER",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-09T00:00:00-03:00",
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "ULTIMACHANCE",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-09T00:00:00-03:00",
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
];
