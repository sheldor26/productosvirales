import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cupón de primavera, de la tarde: arranca 12:00. Acotado a productos
    // 1P (venta directa de MELI), que no modelamos: va sin restricción,
    // mismo criterio que los anteriores.
    code: "LLEGOPRIMAVERA",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-09-24T12:00:00-03:00",
    validUntil: "2026-09-24T23:59:00-03:00",
    active: true,
  },
];
