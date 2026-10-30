import type { Coupon } from "@/lib/types";

// Mismo tramo chico que ayer, solo cambia el código:
//   >= $80.000     -> ACTIVALO ($8.000)
//   menos de $80k  -> sin badge
//
// Tercer mensaje seguido SIN vigencia declarada (TUCUPON el 28, ADELANTO el
// 29). Se asume el corte de siempre, hoy 23:59, porque es preferible que el
// badge desaparezca de más y no que prometa un descuento que el carrito
// rechaza. Sin `validFrom`: ya está activo.
export const activeCoupons: Coupon[] = [
  {
    code: "ACTIVALO",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-10-30T23:59:00-03:00",
    active: true,
  },
];
