import type { Coupon } from "@/lib/types";

// Tramo nuevo, no visto antes en la serie: $10.000 con mínima $100.000.
//   >= $100.000     -> TUCUPON ($10.000)
//   menos de $100k  -> sin badge
//
// OJO con la vigencia: el mensaje llegó de noche ("cerramos la jornada de
// hoy") y NO dice hasta cuándo vale, a diferencia de todos los anteriores que
// aclaraban "hoy de 9:00 a 23:59". Se asume el mismo corte de siempre (hoy
// 23:59) porque es preferible que el badge desaparezca de más y no que prometa
// un descuento que el carrito rechaza. Sin `validFrom`: ya está activo.
export const activeCoupons: Coupon[] = [
  {
    code: "TUCUPON",
    discountAmount: 10000,
    minPurchase: 100000,
    validFrom: null,
    validUntil: "2026-10-28T23:59:00-03:00",
    active: true,
  },
];
