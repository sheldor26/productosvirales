import type { Coupon } from "@/lib/types";

// Domingo 15/11: cupones nuevos para afiliados. Se sacan los del 14/11 (MELIAHORRA10,
// AFILIMAS25, MELIAFF45), que vencieron ayer a las 23:59.
//   >= $300.000    -> AFILIOFF25 ($25.000)
//   $200k a $300k  -> MELIMAS18 ($18.000)
//   $100k a $200k  -> AFILIOCHO8 ($8.000)
//   menos de $100k -> sin badge
//
// HOY EL TECHO ES $25.000: el mensaje trae solo tres cupones y el mas alto es $25.000
// desde $300.000 (ayer era $45.000 desde $500.000, el 13/11 $80.000 desde $1.000.000).
// Un producto de $2.600.000 recibe el mismo badge que uno de $300.000. No agregar un
// cupon mayor por costumbre.
//
// El mensaje dice "se acaban de activar" y "hasta las 23:59 hs o hasta agotar stock": no
// trae hora de inicio, se asume activo ya (validFrom null) y cierre hoy 23:59. El corte
// puede ser antes si se agota el stock y el badge no lo sabe: el carrito manda.
export const activeCoupons: Coupon[] = [
  {
    code: "AFILIOCHO8",
    discountAmount: 8000,
    minPurchase: 100000,
    validFrom: null,
    validUntil: "2026-11-15T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIMAS18",
    discountAmount: 18000,
    minPurchase: 200000,
    validFrom: null,
    validUntil: "2026-11-15T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIOFF25",
    discountAmount: 25000,
    minPurchase: 300000,
    validFrom: null,
    validUntil: "2026-11-15T23:59:00-03:00",
    active: true,
  },
];
