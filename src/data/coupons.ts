import type { Coupon } from "@/lib/types";

// Mismo tramo chico de los últimos días, solo cambia el código:
//   >= $80.000     -> PREVIACYBER ($8.000)
//   menos de $80k  -> sin badge
//
// Cuarto mensaje seguido SIN vigencia declarada (TUCUPON 28, ADELANTO 29,
// ACTIVALO 30). Se asume el corte de siempre, hoy 23:59, porque es preferible
// que el badge desaparezca de más y no que prometa un descuento que el carrito
// rechaza. Sin `validFrom`: ya está activo.
//
// El nombre y el mensaje apuntan al CyberMonday: cuando arranque conviene
// pasar a cargar la tanda completa con sus fechas, no uno por día.
export const activeCoupons: Coupon[] = [
  {
    code: "PREVIACYBER",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-10-31T23:59:00-03:00",
    active: true,
  },
];
