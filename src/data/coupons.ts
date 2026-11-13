import type { Coupon } from "@/lib/types";

// Viernes 13/11: "CUPONES EXCLUSIVOS PARA AFILIADOS", tres escalones. Se sacan los de ayer.
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $1.000.000    -> AFILIOFF80 ($80.000)
//   $500k a $1.000k  -> MELIBENEF45 ($45.000)
//   $250k a $500k    -> AFILIAHORRA20 ($20.000)
//   menos de $250k   -> sin badge
//
// El mensaje no trae hora de vigencia: se asume hoy hasta las 23:59 (regla del runbook).
// Ojo: por ser cupones exclusivos para afiliados puede que ML los limite a "productos
// seleccionados" (paso con ONCEDELONCE); el badge no lo distingue, el carrito manda.
export const activeCoupons: Coupon[] = [
  {
    code: "AFILIAHORRA20",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIBENEF45",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIOFF80",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
];
