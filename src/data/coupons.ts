import type { Coupon } from "@/lib/types";

// Jueves 12/11, despues del 11.11: tres cupones "exclusivos para afiliados" con tramos nuevos
// (mas bajos que los del Doble 11). Se sacan los vencidos del 11/11.
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $300.000      -> MELIOFF25 ($25.000)
//   $200k a $300k    -> AFILIMELI18 ($18.000)
//   $100k a $200k    -> MELIAFF8 ($8.000)
//   menos de $100k   -> sin badge
// Vigencia: el mensaje dice "12/11 de 9:00 a 23:59 hs".
// Ojo: por ser cupones exclusivos para afiliados puede que ML los limite a "productos seleccionados"
// (pasó con ONCEDELONCE); el badge no lo distingue, el carrito manda.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIAFF8",
    discountAmount: 8000,
    minPurchase: 100000,
    validFrom: "2026-11-12T09:00:00-03:00",
    validUntil: "2026-11-12T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIMELI18",
    discountAmount: 18000,
    minPurchase: 200000,
    validFrom: "2026-11-12T09:00:00-03:00",
    validUntil: "2026-11-12T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIOFF25",
    discountAmount: 25000,
    minPurchase: 300000,
    validFrom: "2026-11-12T09:00:00-03:00",
    validUntil: "2026-11-12T23:59:00-03:00",
    active: true,
  },
];
