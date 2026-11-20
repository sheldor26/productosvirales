import type { Coupon } from "@/lib/types";

// Viernes 20/11: tres escalones exclusivos para afiliados, con montos distintos
// a los de ayer. Vuelve el de $10.000 desde $150.000 (como el 17/11) y se va el
// de $80.000 (que estuvo el 19/11). Se sacan los cupones vencidos del 19/11.
// AFILIMELI45 ($45.000 desde $500.000) vino en el mensaje pero a las 11:10 ML respondía
// "El cupón no está disponible" al ingresarlo y no aparecía en el panel de cupones de la
// ficha (solo $20.000 y $10.000), así que se sacó para no mostrar un descuento que no se
// puede usar. Si ML lo habilita más tarde, volver a sumarlo:
//   { code: "AFILIMELI45", discountAmount: 45000, minPurchase: 500000, validFrom: null,
//     validUntil: "2026-11-20T23:59:00-03:00", active: true }
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $250.000      -> MELIAHORRA20 ($20.000)
//   $150k a $250k    -> AFILIDESCU10 ($10.000)
//   menos de $150k   -> sin badge
// El mensaje no declara vigencia: se asume hasta hoy 23:59 (sin hora de inicio).
export const activeCoupons: Coupon[] = [
  {
    code: "AFILIDESCU10",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: null,
    validUntil: "2026-11-20T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIAHORRA20",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-20T23:59:00-03:00",
    active: true,
  },
];
