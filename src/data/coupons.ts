import type { Coupon } from "@/lib/types";

// Martes 17/11: cupones nuevos para afiliados. Se sacan los del 16/11 (MELIDESCU20,
// AFILIBENEF45, MELIAHORRA80), que vencieron anoche a las 23:50.
//   >= $500.000    -> AFILIOFF45 ($45.000)
//   $250k a $500k  -> MELIMAS20 ($20.000)
//   $150k a $250k  -> AFILIMELI10 ($10.000)
//   menos de $150k -> sin badge
//
// Hoy NO hay escalon de $80.000 desde $1.000.000 (ayer si). El techo es $45.000, asi que una
// consola de mas de $1.000.000 recibe $45.000. Vuelve el tramo chico de $10.000 desde $150.000,
// que ayer no estaba. Vigencia del mensaje: de 9:00 a 23:59.
export const activeCoupons: Coupon[] = [
  {
    code: "AFILIMELI10",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: "2026-11-17T09:00:00-03:00",
    validUntil: "2026-11-17T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIMAS20",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-17T09:00:00-03:00",
    validUntil: "2026-11-17T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIOFF45",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-17T09:00:00-03:00",
    validUntil: "2026-11-17T23:59:00-03:00",
    active: true,
  },
];
