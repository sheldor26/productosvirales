import type { Coupon } from "@/lib/types";

// Cyber Monday del viernes 6/11: siguen los tres escalones principales con
// códigos nuevos. Se sacan todos los cupones vencidos del 5/11.
//   >= $1.000.000    -> OTRACHANCEMELI ($80.000)
//   $500k a $1.000k  -> CYBERMRESIGUE ($45.000)
//   $250k a $500k    -> MELINOPARA ($20.000)
//   $80k a $250k     -> NADIECYBER ($8.000), solo de 13:30 a 15:30
//   menos de $80k    -> sin badge
// Los tres primeros: el mensaje no indica horarios, sin inicio definido y
// vencimiento hoy 23:59.
// NADIECYBER: exclusivo pagando con Mercado Pago. El tipo Coupon no tiene
// campo para el medio de pago, así que el badge no aclara esa condición.
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
  {
    code: "NADIECYBER",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-11-06T13:30:00-03:00",
    validUntil: "2026-11-06T15:30:00-03:00",
    active: true,
  },
];
