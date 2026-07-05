import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "SIETESIETE",
    discountAmount: 10000,
    minPurchase: 150000,
    validUntil: "2026-07-05T23:59:00-03:00",
    active: true,
  },
  {
    // Cupón sorpresa 05-jul: activo de 14:00 a 23:59 (cargado ya empezada la ventana).
    code: "CERCAFECHA77",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-07-05T23:59:00-03:00",
    active: true,
  },
];
