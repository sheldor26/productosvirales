import type { Coupon } from "@/lib/types";

// Miércoles 18/11: tres escalones exclusivos para afiliados, los mismos montos y
// mínimas que el 12/11 y el 15/11, con códigos nuevos. Se sacan los cupones
// vencidos del 17/11.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $300.000      -> MELIBENEF25 ($25.000)
//   $200k a $300k    -> AFILIAHORRA18 ($18.000)
//   $100k a $200k    -> MELIDESCU8 ($8.000)
//   menos de $100k   -> sin badge
// Vigencia declarada en el mensaje: hoy de 9:00 a 23:59.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIDESCU8",
    discountAmount: 8000,
    minPurchase: 100000,
    validFrom: "2026-11-18T09:00:00-03:00",
    validUntil: "2026-11-18T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIAHORRA18",
    discountAmount: 18000,
    minPurchase: 200000,
    validFrom: "2026-11-18T09:00:00-03:00",
    validUntil: "2026-11-18T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIBENEF25",
    discountAmount: 25000,
    minPurchase: 300000,
    validFrom: "2026-11-18T09:00:00-03:00",
    validUntil: "2026-11-18T23:59:00-03:00",
    active: true,
  },
];
