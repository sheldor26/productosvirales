import { activeCoupons } from "@/data/coupons";
import type { Coupon } from "./types";

/**
 * Descuento real en pesos que da este cupón para un precio dado.
 *
 * Los cupones porcentuales de MELI vienen con tope (ej. 10% OFF hasta
 * $100.000), así que el número que ve el comprador depende del producto:
 * mostrar el tope a secas prometería de más en todo lo que no llegue a él.
 */
export function couponDiscountFor(coupon: Coupon, price: number): number {
  if (coupon.discountPercent) {
    const raw = Math.floor((price * coupon.discountPercent) / 100);
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  }
  return coupon.discountAmount ?? 0;
}

/**
 * Mejor cupón activo para un precio dado, o null si ninguno cierra.
 *
 * `categorySlug` es opcional: si el cupón está limitado a ciertas categorías
 * y no sabemos la del producto (ej. /enlaces, que no guarda ese dato), el
 * cupón se omite en vez de mostrarse igual — preferimos no mostrar un
 * descuento antes que prometer uno que el carrito va a rechazar.
 */
export function getApplicableCoupon(price: number, categorySlug?: string): Coupon | null {
  const now = new Date();
  const eligible = activeCoupons.filter((c) => {
    if (!c.active) return false;
    if (price < c.minPurchase) return false;
    if (c.validFrom && new Date(c.validFrom) > now) return false;
    if (c.validUntil && new Date(c.validUntil) <= now) return false;
    if (c.categories && (!categorySlug || !c.categories.includes(categorySlug))) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  // Se compara el descuento ya calculado para ESTE precio, no el nominal:
  // un 10% puede ganarle a un monto fijo en un producto caro y perder en uno barato.
  return eligible.reduce((best, c) =>
    couponDiscountFor(c, price) > couponDiscountFor(best, price) ? c : best
  );
}
