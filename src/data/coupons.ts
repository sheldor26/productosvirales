import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // El tope de $10.000 muerde a partir de $100.000; por debajo el badge
    // muestra el 10% real. Con mínimo de $30.000 califica casi todo el
    // catálogo.
    //
    // Acotado a productos 1P (venta directa de MELI), que no modelamos:
    // va sin restricción, mismo criterio que los anteriores.
    code: "SUMATEMAS",
    discountPercent: 10,
    maxDiscount: 10000,
    minPurchase: 30000,
    validFrom: "2026-09-25T09:00:00-03:00",
    validUntil: "2026-09-25T23:59:00-03:00",
    active: true,
  },
];
