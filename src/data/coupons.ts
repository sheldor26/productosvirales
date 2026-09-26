import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Monto fijo pese al nombre "MELI10OFF": no es porcentual, son
    // \$15.000 planos desde \$150.000 de compra.
    //
    // Acotado a productos 1P (venta directa de MELI), que no modelamos:
    // va sin restricción, mismo criterio que los anteriores.
    code: "MELI10OFF",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-09-26T09:00:00-03:00",
    validUntil: "2026-09-26T23:59:00-03:00",
    active: true,
  },
];
