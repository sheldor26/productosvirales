import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cyber Fest electro. MELI lo habilitó en 5 landings: air fryers,
    // heladeras, cocción, pequeños electros y lavado. De las categorías
    // del sitio, `cocina` cubre las primeras 4 y es electro en 56 de 58
    // productos (las 2 excepciones son prensas francesas manuales).
    //
    // `hogar` queda afuera a propósito aunque tenga los secarropas de la
    // landing de lavado: ahí conviven con termos y estufas a leña, que no
    // son electro. Mostrar el badge sobre un termo sería prometer un
    // descuento que el carrito rechaza.
    code: "CYBERELECTRO",
    discountPercent: 10,
    maxDiscount: 80000,
    minPurchase: 50000,
    categories: ["cocina"],
    validFrom: "2026-09-05T09:00:00-03:00",
    validUntil: "2026-09-05T23:59:00-03:00",
    active: true,
  },
];
