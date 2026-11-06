import type { Coupon } from "@/lib/types";

// Cyber Monday del viernes 6/11: siguen los tres escalones principales con
// códigos nuevos. Se sacan todos los cupones vencidos del 5/11.
//   >= $1.000.000    -> OTRACHANCEMELI ($80.000)
//   $500k a $1.000k  -> CYBERMRESIGUE ($45.000)
//   $250k a $500k    -> MELINOPARA ($20.000)
//   menos de $250k   -> sin badge
// El mensaje no indica horarios: sin inicio definido y vencimiento hoy 23:59.
export const activeCoupons: Coupon[] = [
  {
    code: "MELINOPARA",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-06T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERMRESIGUE",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-06T23:59:00-03:00",
    active: true,
  },
  {
    code: "OTRACHANCEMELI",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-06T23:59:00-03:00",
    active: true,
  },
];
