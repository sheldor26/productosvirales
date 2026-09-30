import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Anticipo del Día de la Madre. Acotado a productos 1P (venta directa
    // de MELI), que no modelamos: va sin restricción, mismo criterio que
    // los anteriores.
    code: "SEVIENEMAMA",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-09-30T09:00:00-03:00",
    validUntil: "2026-09-30T23:59:00-03:00",
    active: true,
  },
];
