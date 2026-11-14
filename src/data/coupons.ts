import type { Coupon } from "@/lib/types";

// Sabado 14/11: cupones nuevos para afiliados. Se sacan los del 13/11 (AFILIAHORRA20,
// MELIBENEF45, AFILIOFF80), que vencieron ayer a las 23:59.
//   >= $500.000    -> MELIAFF45 ($45.000)
//   $250k a $500k  -> AFILIMAS25 ($20.000)
//   $150k a $250k  -> MELIAHORRA10 ($10.000)
//   menos de $150k -> sin badge
//
// HOY NO HAY ESCALON DE $1.000.000: el mensaje trae solo tres cupones y el mas alto es
// $45.000 desde $500.000 (ayer era $80.000 desde $1.000.000). Un producto de $2.600.000
// recibe el mismo badge que uno de $500.000. No agregar un cupon mayor por costumbre.
//
// El mensaje dice "hasta las 23:59 hs o hasta que se agote el stock": no trae hora de
// inicio, se asume activo ya (validFrom null) y cierre hoy 23:59. El corte puede ser
// antes si se agota el stock y el badge no lo sabe: el carrito manda.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIAHORRA10",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: null,
    validUntil: "2026-11-14T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIMAS25",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-14T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIAFF45",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-14T23:59:00-03:00",
    active: true,
  },
];
