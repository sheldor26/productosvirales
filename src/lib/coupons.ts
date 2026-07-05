import { activeCoupons } from "@/data/coupons";
import type { Coupon } from "./types";

/** Mejor cupón activo que aplica para un precio dado, o null si ninguno cierra. */
export function getApplicableCoupon(price: number): Coupon | null {
  const now = new Date();
  const eligible = activeCoupons.filter(
    (c) => c.active && price >= c.minPurchase && (!c.validUntil || new Date(c.validUntil) > now)
  );
  if (eligible.length === 0) return null;
  return eligible.reduce((best, c) => (c.discountAmount > best.discountAmount ? c : best));
}
