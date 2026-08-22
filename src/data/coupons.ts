import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // El mensaje de MELI solo indicó el límite (23:59), sin horario de
    // inicio, así que va sin `validFrom`: vale desde cualquier hora.
    code: "YAOFERTAZO",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-08-22T23:59:00-03:00",
    active: true,
  },
];
