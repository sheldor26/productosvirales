import type { ActiveCoupon } from "@/lib/types";

/**
 * Cupones reales de MercadoLibre vigentes hoy, para cruzar contra los
 * productos de /enlaces. Sumar uno acá cuando Juan lo reciba de ML — se
 * apaga solo pasado `validUntil`, no hay que borrarlo a mano.
 */
export const activeCoupons: ActiveCoupon[] = [
  {
    code: "MUNDOJUGUETE",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-08-13T23:59:00-03:00",
  },
];
