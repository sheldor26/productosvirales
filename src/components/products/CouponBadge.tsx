"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getApplicableCoupon } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import type { Coupon } from "@/lib/types";

interface CouponBadgeProps {
  price: number;
  className?: string;
}

/**
 * Cupón de MELI vigente que aplica a este precio, o nada si no hay uno que cierre.
 * El chequeo se hace en el navegador (no al generar la página): las guías y
 * fichas son estáticas y quedan cacheadas, así que si mirásemos la hora solo
 * al generar el HTML, el cupón podría seguir apareciendo horas después de
 * vencido. Arrancando en null y resolviendo en useEffect, cada visita lee la
 * hora real del visitante y el badge desaparece solo apenas vence.
 */
export function CouponBadge({ price, className }: CouponBadgeProps) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    setCoupon(getApplicableCoupon(price));
  }, [price]);

  if (!coupon) return null;

  return (
    <Badge
      variant="coupon"
      className={className}
      title={`Cupón ${coupon.code}: ${formatPrice(coupon.discountAmount)} OFF en compras desde ${formatPrice(coupon.minPurchase)}. Se ingresa en el carrito de MercadoLibre.`}
    >
      <Ticket size={10} />
      Cupón {coupon.code} -{formatPrice(coupon.discountAmount)}
    </Badge>
  );
}
