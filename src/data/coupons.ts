import type { Coupon } from "@/lib/types";

// Hoy MELI mandó UN SOLO cupón, no la tanda de tres escalonada que venía
// desde el 1/10. Consecuencia directa, para que nadie la lea como un bug:
//   >= $150.000     -> MELIFUEGO ($15.000), incluido todo lo caro
//   menos de $150k  -> sin badge
// O sea que hoy un producto de $400.000 muestra $15.000 OFF y no $25.000, y
// los de $80k a $150k se quedan sin nada. Es lo que dice el mensaje del día.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIFUEGO",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-17T09:00:00-03:00",
    validUntil: "2026-10-17T23:59:00-03:00",
    active: true,
  },
];
