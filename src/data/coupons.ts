import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // El mensaje de MELI no indicó horario de inicio (a diferencia de los
    // anteriores), así que va sin `validFrom`: vale desde cualquier hora.
    code: "REGALAZO",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-08-15T23:59:00-03:00",
    active: true,
  },
];
