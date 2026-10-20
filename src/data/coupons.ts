import type { Coupon } from "@/lib/types";

// Segundo mensaje del mismo día (20/10): a la mañana había llegado MELIMODO y
// al mediodía llegó MODOMELI, mismo monto y misma mínima. Se reemplaza por el
// último que mandaron, que es la regla de siempre: vale lo que dice el mensaje
// más reciente, no acumular códigos viejos.
//   >= $150.000     -> MODOMELI ($15.000)
//   menos de $150k  -> sin badge
// Sin `validFrom` a propósito: este mensaje no trae hora de inicio (dice solo
// "hoy hasta las 23:59"), así que aplica desde que se carga.
export const activeCoupons: Coupon[] = [
  {
    code: "MODOMELI",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: null,
    validUntil: "2026-10-20T23:59:00-03:00",
    active: true,
  },
];
