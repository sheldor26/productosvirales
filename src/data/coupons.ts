import type { Coupon } from "@/lib/types";

// Un solo cupón otra vez, y el piso vuelve a bajar:
//   >= $80.000      -> MELIFLASH ($8.000)
//   menos de $80k   -> sin badge
// Ayer la mínima era $150.000 (MELIMODO / MODOMELI) y hoy baja a $80.000, así
// que entran bastantes más productos, pero los de ticket alto cobran $8.000 en
// vez de los $15.000 de ayer. Es lo que dice el mensaje del día, no un bug.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIFLASH",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-21T09:00:00-03:00",
    validUntil: "2026-10-21T23:59:00-03:00",
    active: true,
  },
];
