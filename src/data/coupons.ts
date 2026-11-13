import type { Coupon } from "@/lib/types";

// Viernes 13/11: llegaron DOS tandas de cupones exclusivos para afiliados el mismo
// día y se SUMAN. Se sacan los cupones vencidos del 12/11.
//   Tanda 1 (sin horario): AFILIAHORRA20 / MELIBENEF45 / AFILIOFF80
//   Tanda 2 (9:00 a 23:59): MELIAFF8 / AFILIMELI18 / MELIOFF25
// OJO: la tanda 2 usa los MISMOS códigos y montos que los del 12/11, y el mensaje
// no trae fecha. Puede ser un reenvío de ayer (en ese caso ya no sirven) o MELI
// reusando los códigos hoy. No se pudieron probar en el carrito: se cargan porque
// Juan los pasó. Si un comprador reporta que MELIAFF8 / AFILIMELI18 / MELIOFF25
// no andan hoy, sacar la tanda 2.
//
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> AFILIOFF80 ($80.000)
//   $500k a $1.000k  -> MELIBENEF45 ($45.000)
//   $300k a $500k    -> MELIOFF25 ($25.000)
//   $250k a $300k    -> AFILIAHORRA20 ($20.000)
//   $200k a $250k    -> AFILIMELI18 ($18.000)
//   $100k a $200k    -> MELIAFF8 ($8.000)
//   menos de $100k   -> sin badge
//
// Por ser exclusivos para afiliados puede que ML los limite a "productos
// seleccionados" (pasó con ONCEDELONCE); el badge no lo distingue, el carrito manda.
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
  {
    code: "MELIAFF8",
    discountAmount: 8000,
    minPurchase: 100000,
    validFrom: "2026-11-13T09:00:00-03:00",
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "AFILIMELI18",
    discountAmount: 18000,
    minPurchase: 200000,
    validFrom: "2026-11-13T09:00:00-03:00",
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIOFF25",
    discountAmount: 25000,
    minPurchase: 300000,
    validFrom: "2026-11-13T09:00:00-03:00",
    validUntil: "2026-11-13T23:59:00-03:00",
    active: true,
  },
];
