import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // "Horas Locas" de la mañana: se apaga solo a las 15:00. El tope de
    // $10.000 muerde a partir de $100.000; por debajo el badge muestra el
    // 10% real. Con mínimo de $25.000 califica casi todo el catálogo.
    //
    // Acotado a productos 1P (venta directa de MELI), que no modelamos:
    // va sin restricción, mismo criterio que los anteriores.
    code: "ENVIOPLUS",
    discountPercent: 10,
    maxDiscount: 10000,
    minPurchase: 25000,
    validFrom: "2026-09-23T09:00:00-03:00",
    validUntil: "2026-09-23T15:00:00-03:00",
    active: true,
  },
];
