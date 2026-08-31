import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Ventana relámpago de la tarde: el badge se prende solo a las 18:00
    // y se apaga a las 23:59, sin tocar nada.
    code: "HORASLOCA",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-08-31T18:00:00-03:00",
    validUntil: "2026-08-31T23:59:00-03:00",
    active: true,
  },
];
