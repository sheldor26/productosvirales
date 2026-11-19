import type { Coupon } from "@/lib/types";

// Jueves 19/11: tres escalones exclusivos para afiliados, los mismos montos y
// mínimas que el 16/11 (20k / 45k / 80k), con códigos nuevos. Se sacan los
// cupones vencidos del 18/11. El escalón de $80.000 vuelve después de dos días
// sin él (17/11 y 18/11).
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> MELIOFF80 ($80.000)
//   $500k a $1M      -> AFILIMAS45 ($45.000)
//   $250k a $500k    -> MELIAFF20 ($20.000)
//   menos de $250k   -> sin badge
// El mensaje no declara vigencia: se asume hasta hoy 23:59 (sin hora de inicio).
export const activeCoupons: Coupon[] = [
  {
    code: "MELIAFF20",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-19T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIMAS45",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-19T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIOFF80",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-19T23:59:00-03:00",
    active: true,
  },
];
