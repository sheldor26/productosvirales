import type { Coupon } from "@/lib/types";

// Puede haber varios cupones vigentes a la vez con pisos distintos.
// `getApplicableCoupon` se queda con el de mayor descuento entre los que el
// precio alcanza, asi que conviene tener los dos cargados: un producto de
// $150.000 muestra DOBLE88 (unico que llega) y uno de $300.000 muestra
// HOYJUEGA8, que le conviene mas al comprador.
export const activeCoupons: Coupon[] = [
  {
    code: "HOYJUEGA8",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-08-08T09:00:00-03:00",
    validUntil: "2026-08-08T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLE88",
    discountAmount: 10000,
    minPurchase: 100000,
    validFrom: "2026-08-08T00:00:00-03:00",
    validUntil: "2026-08-08T23:59:00-03:00",
    active: true,
  },
];
