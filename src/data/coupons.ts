import type { Coupon } from "@/lib/types";

// Viernes 27/11 (Black Friday): tres cupones del mismo monto, $9.000 desde $90.000.
// El mensaje solo traia codigos y hora de inicio; monto, minima y vigencia salen de
// las condiciones de cada cupon en la cuenta de ML (campanias 14815150, 14815268 y
// 14149841).
// Restricciones que el badge NO puede mostrar: solo productos seleccionados vendidos
// por Mercado Libre (1P), solo en la app, no se suman con otras promociones, y cada
// campania corta al llegar a $5.328.000 en descuentos (pueden agotarse antes de las
// 23:59).
// Al ser iguales, `getApplicableCoupon` muestra uno solo para todo producto >= $90.000.
export const activeCoupons: Coupon[] = [
  {
    code: "CADAVIERNES",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:00:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
  {
    code: "BLACKSHOW",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:00:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
  {
    code: "APROVECHA",
    discountAmount: 9000,
    minPurchase: 90000,
    validFrom: "2026-11-27T09:30:00-03:00",
    validUntil: "2026-11-27T23:59:00-03:00",
    active: true,
  },
];
