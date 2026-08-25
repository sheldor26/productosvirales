import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Ventana relámpago de 3 horas. El badge se apaga solo a las 15:00.
    // MELI también dice "o hasta agotar stock", que no podemos saber:
    // el horario es el único corte que el sitio puede respetar.
    code: "HORASLOCASYA",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-08-25T12:00:00-03:00",
    validUntil: "2026-08-25T15:00:00-03:00",
    active: true,
  },
];
