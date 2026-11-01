import type { Coupon } from "@/lib/types";

// Vuelve el tramo alto, pero con monto nuevo: $20.000, no los $25.000 que
// venía teniendo la mínima de $250.000 en toda la serie de octubre.
//   >= $250.000     -> SEVIENECYBERM ($20.000)
//   menos de $250k  -> sin badge
// Cargar siempre lo que dice el mensaje del día, nunca asumir el monto por el
// tramo ni por el nombre del código.
export const activeCoupons: Coupon[] = [
  {
    code: "SEVIENECYBERM",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-01T09:00:00-03:00",
    validUntil: "2026-11-01T23:59:00-03:00",
    active: true,
  },
];
