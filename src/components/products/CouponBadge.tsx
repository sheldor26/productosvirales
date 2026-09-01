"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { couponDiscountFor, getApplicableCoupon } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import type { Coupon } from "@/lib/types";

interface CouponBadgeProps {
  price: number;
  /** Slug de categoría del producto. Necesario para los cupones que MELI
   *  limita a ciertas categorías; sin esto, esos cupones no se muestran. */
  categorySlug?: string;
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
export function CouponBadge({ price, categorySlug, className }: CouponBadgeProps) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCoupon(getApplicableCoupon(price, categorySlug));
  }, [price, categorySlug]);

  if (!coupon) return null;

  // Monto real para ESTE producto: en los cupones porcentuales cambia
  // con el precio, así que no se puede leer un valor fijo del cupón.
  const discount = couponDiscountFor(coupon, price);

  // Un toque copia el código: el visitante llega al carrito de MercadoLibre
  // con el cupón listo para pegar, en vez de tener que memorizarlo mientras
  // la app de ML le cambia el contexto. Si el navegador no da clipboard
  // (contexto no seguro), el click no hace nada y el título sigue mostrando
  // el código completo — nunca peor que el badge pasivo de antes.
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard
      ?.writeText(coupon.code)
      .then(() => {
        setCopied(true);
        window.gtag?.("event", "coupon_copy", { coupon_code: coupon.code });
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex bg-transparent border-0 p-0 cursor-pointer motion-safe:active:scale-95 transition-transform ${className ?? ""}`}
      title={`Cupón ${coupon.code}: ${formatPrice(discount)} OFF en compras desde ${formatPrice(coupon.minPurchase)}. Tocá para copiarlo y pegalo en el carrito de MercadoLibre.`}
      aria-label={`Copiar cupón ${coupon.code}`}
      aria-live="polite"
    >
      <Badge variant="coupon">
        <Ticket size={10} />
        {copied ? "Copiado ✓ pegalo en el carrito" : `Cupón ${coupon.code} -${formatPrice(discount)}`}
      </Badge>
    </button>
  );
}
