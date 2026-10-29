import type { Coupon } from "@/lib/types";

// Vuelve el tramo chico de siempre:
//   >= $80.000     -> ADELANTO ($8.000)
//   menos de $80k  -> sin badge
//
// Segundo mensaje seguido SIN vigencia declarada (el anterior fue TUCUPON el
// 28/10). Se asume el corte de siempre, hoy 23:59, porque es preferible que el
// badge desaparezca de más y no que prometa un descuento que el carrito
// rechaza. Sin `validFrom`: ya está activo.
export const activeCoupons: Coupon[] = [
  {
    code: "ADELANTO",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-10-29T23:59:00-03:00",
    active: true,
  },
];
