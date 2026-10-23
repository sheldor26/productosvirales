import type { Coupon } from "@/lib/types";

// Un solo cupón, y el piso vuelve a bajar al tramo chico:
//   >= $80.000      -> MODONUBE ($8.000)
//   menos de $80k   -> sin badge
// Ayer la mínima era $250.000 (MELIBONUS) y hoy baja a $80.000: entran muchos
// más productos, pero el de ticket alto cobra $8.000 en vez de $25.000.
// Desde el 17/10 vienen mandando uno solo por día y rotando el tramo sin
// patrón previsible, así que nunca asumir el monto antes del mensaje.
export const activeCoupons: Coupon[] = [
  {
    code: "MODONUBE",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-10-23T09:00:00-03:00",
    validUntil: "2026-10-23T23:59:00-03:00",
    active: true,
  },
];
