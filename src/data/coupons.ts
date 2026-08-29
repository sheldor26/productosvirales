import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Sin horario de inicio en el mensaje de MELI, solo el límite de las
    // 23:59, así que va sin `validFrom`: vale desde cualquier hora.
    code: "FINOFERTA",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-08-29T23:59:00-03:00",
    active: true,
  },
];
