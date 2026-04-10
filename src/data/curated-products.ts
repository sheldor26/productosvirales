import type { Product } from '@/lib/types';

/**
 * ProductosVirales.com.ar — Curated Products (MVP Phase 1)
 *
 * Datos reales de MercadoLibre Argentina.
 * Actualizar precios y links periódicamente.
 * Última actualización: Abril 2026
 */

export const curatedProducts: Product[] = [
  {
    id: 'MLAU3809091558',
    title: 'Bomba Selladora Al Vacío Portátil Para Alimentos',
    price: 21450,
    originalPrice: 32999,
    currency: 'ARS',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_824134-MLA107464848667_022026-F.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_2X_824134-MLA107464848667_022026-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_616913-MLA107464731383_022026-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_812841-MLA106793849750_022026-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_878784-MLA107465403893_022026-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_875635-MLA107465463359_022026-F.webp',
    ],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: 'https://www.mercadolibre.com.ar/bomba-selladora-al-vacio-portatil-para-alimentos/up/MLAU3809091558',
    affiliateUrl: 'https://meli.la/198LAYm',
    condition: 'new',
    freeShipping: false,
    rating: undefined,
    soldQuantity: undefined,
    tiktokViews: '8M+',
    badge: 'viral',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      '35% de descuento — de $32.999 a $21.450',
      'Portátil y recargable — ideal para llevar de viaje',
      'Conserva alimentos frescos hasta 5x más tiempo',
      'Incluye 2 bolsas de sellado al vacío',
    ],
    cons: [
      'Las bolsas de repuesto se compran aparte',
      'Marca genérica — no es primera marca',
    ],
    verdict: 'El gadget de meal prep que explotó en TikTok. Ideal para conservar alimentos, marinar carne en minutos y organizar el freezer. Con 35% OFF es compra impulsiva asegurada.',
    description: 'Conservá tus alimentos frescos por más tiempo con esta bomba selladora al vacío portátil. Ideal para uso doméstico, permite sellar bolsas de manera rápida y sencilla, evitando la oxidación y prolongando la vida útil de carnes, verduras y otros productos. Diseño compacto y portátil, recargable y eficiente para el hogar o viajes.',
  },
];

// ─────────────────────────────────────────────
// Helper: Categorías con colores pastel
// ─────────────────────────────────────────────
export const categoryPastels: Record<string, string> = {
  cocina: 'var(--pastel-coral)',
  hogar: 'var(--pastel-amber)',
  tech: 'var(--pastel-blue)',
  belleza: 'var(--pastel-pink)',
  fitness: 'var(--pastel-green)',
  moda: 'var(--pastel-purple)',
  gadgets: 'var(--pastel-blue)',
};
