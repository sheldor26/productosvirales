import type { Coupon } from "@/lib/types";

// Cyber Monday extendido del jueves 5/11: siguen los tres escalones principales
// con códigos nuevos. Se sacan todos los cupones vencidos del 4/11.
//   >= $1.000.000    -> SEGUIMOSCONTODO ($80.000)
//   $500k a $1.000k  -> MELIOTRARONDA ($45.000)
//   $250k a $500k    -> MELICYBERON ($20.000)
//   menos de $250k   -> sin badge
// El mensaje no indica horarios: sin inicio definido y vencimiento hoy 23:59.
export const activeCoupons: Coupon[] = [
  {
    code: "MELICYBERON",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-05T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIOTRARONDA",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-05T23:59:00-03:00",
    active: true,
  },
  {
    code: "SEGUIMOSCONTODO",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-05T23:59:00-03:00",
    active: true,
  },
];
