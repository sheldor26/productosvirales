import type { Coupon } from "@/lib/types";

// Lunes 16/11: cupones nuevos para afiliados. Se sacan los del 15/11 (AFILIOCHO8,
// MELIMAS18, AFILIOFF25), que vencieron ayer a las 23:59.
//   >= $1.000.000  -> MELIAHORRA80 ($80.000)
//   $500k a $1M    -> AFILIBENEF45 ($45.000)
//   $250k a $500k  -> MELIDESCU20 ($20.000)
//   menos de $250k -> sin badge
//
// Vuelve el escalon de $1.000.000 que el 14 y el 15/11 no estuvo (esos dias el techo fue
// $45.000 y $25.000). Los tres tramos son los mismos del 13/11, con codigos nuevos.
//
// El mensaje dice "cayeron recien" y "cierran hoy a las 23:50 hs": no trae hora de inicio,
// se asume activo ya (validFrom null) y el cierre es 23:50, no 23:59. El corte puede ser
// antes si se agota el stock y el badge no lo sabe: el carrito manda.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIDESCU20",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-16T23:50:00-03:00",
    active: true,
  },
  {
    code: "AFILIBENEF45",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-16T23:50:00-03:00",
    active: true,
  },
  {
    code: "MELIAHORRA80",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-16T23:50:00-03:00",
    active: true,
  },
];
