import type { Product } from '@/lib/types';

/**
 * ProductosVirales.com.ar — Curated Products (MVP Phase 1)
 *
 * Datos reales de MercadoLibre Argentina.
 * Actualizar precios y links periódicamente.
 * Última actualización: Abril 2026
 */

export const curatedProducts: Product[] = [
  // ─────────────────────────────────────────────
  // COCINA — Gadgets virales
  // ─────────────────────────────────────────────

  {
    id: 'MLA-XXXXXXXXX', // TODO: pegar MLA ID real del link 1
    title: 'Picadora Manual Verduras Mandolina Vegetales Pica Cebolla',
    price: 21826,
    originalPrice: 25002,
    currency: 'ARS',
    image: '', // TODO: reemplazar con URL de imagen -O.jpg de ML
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '', // TODO: pegar link completo de ML
    affiliateUrl: '', // TODO: generar desde barra de afiliados ML
    condition: 'new',
    freeShipping: true,
    rating: 4.3,
    soldQuantity: 1000,
    tiktokViews: '5M+',
    badge: 'trending',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Más de 1000 vendidos en ML — el más popular de su categoría',
      'Incluye múltiples cuchillas y accesorios',
      'Envío gratis con FULL',
      '12% de descuento sobre precio original',
    ],
    cons: [
      'Las cuchillas requieren cuidado al lavar',
      'Ocupa espacio en la alacena por la cantidad de piezas',
    ],
    verdict: 'La mandolina más vendida de MercadoLibre Argentina. Si hacés meal prep o cocinás seguido, te ahorra 20 minutos por comida. El producto viral de cocina por excelencia.',
    description: 'Picadora manual de verduras multifunción con mandolina incluida. Corta, rebana, ralla y pica todo tipo de vegetales y frutas. Incluye múltiples accesorios y cuchillas intercambiables. Ideal para meal prep.',
  },

  {
    id: 'MLA850734153',
    title: 'Mandolina Cortador De Vegetales Rallador 5 En 1 Multifunción',
    price: 15181,
    originalPrice: 15980,
    currency: 'ARS',
    image: '', // TODO: reemplazar con URL de imagen -O.jpg de ML
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: 'https://articulo.mercadolibre.com.ar/MLA-850734153-cortador-mandolina-de-vegetales-multiuso-verde-accesorios-_JM',
    affiliateUrl: '', // TODO: generar desde barra de afiliados ML
    condition: 'new',
    freeShipping: true,
    rating: 4.6,
    soldQuantity: 100,
    tiktokViews: '2.3M',
    badge: 'viral',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Mejor rating de su categoría (4.6 estrellas)',
      '5 funciones en 1: corta, ralla, rebana, juliana y más',
      'Precio accesible — opción más económica',
      'Diseño compacto, fácil de guardar',
    ],
    cons: [
      'Menos accesorios que la versión premium',
      'Menos vendidos que la opción #1',
    ],
    verdict: 'La mejor relación calidad-precio en mandolinas. Rating 4.6 y casi $7.000 más barata que la competencia. Ideal si buscás algo compacto y funcional.',
    description: 'Mandolina multifunción 5 en 1 para cortar, rallar y rebanar vegetales. Cuchillas de acero inoxidable, diseño compacto con contenedor incluido. Color verde con accesorios.',
  },

  // ─────────────────────────────────────────────
  // COCINA — Más productos (completar con links reales)
  // ─────────────────────────────────────────────

  {
    id: 'ML-SELLADORA-001', // TODO: reemplazar con MLA ID real
    title: 'Selladora al Vacío Portátil + 2 Contenedores',
    price: 35000, // TODO: actualizar precio real
    originalPrice: 42000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '', // TODO: link real ML
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.2,
    soldQuantity: 500,
    tiktokViews: '8M+',
    badge: 'viral',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Mantiene la comida fresca hasta 5x más tiempo',
      'Portátil y recargable por USB',
      'Incluye contenedores y bolsas',
    ],
    cons: [
      'Las bolsas de repuesto se compran aparte',
      'No sirve para líquidos',
    ],
    verdict: 'El gadget de meal prep que explotó en TikTok. Ideal para conservar alimentos, marinar carne en minutos y organizar el freezer.',
    description: 'Selladora al vacío portátil inalámbrica con contenedores incluidos. Ideal para conservar alimentos frescos, meal prep y organización de freezer.',
  },

  {
    id: 'ML-ICEROLL-001', // TODO: reemplazar con MLA ID real
    title: 'Máquina de Helado Roll - Ice Cream Rolls Casero',
    price: 28000, // TODO: actualizar precio real
    originalPrice: undefined,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.0,
    soldQuantity: 200,
    tiktokViews: '12M+',
    badge: 'hot-deal',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Contenido ASMR perfecto para TikTok',
      'No necesita electricidad',
      'Divertido para hacer con chicos',
    ],
    cons: [
      'Hay que congelar la bandeja varias horas antes',
      'Requiere práctica para lograr los rolls perfectos',
    ],
    verdict: 'El producto más "instagrameable" de la lista. Los videos de helado roll casero son ASMR puro y acumulan millones de views.',
    description: 'Bandeja para hacer helado roll casero estilo thai. Congela la bandeja, vertí la mezcla, y hacé rolls de helado como los profesionales. Incluye espátulas.',
  },

  {
    id: 'ML-STIRRER-001', // TODO: reemplazar con MLA ID real
    title: 'Revolvedor Automático de Olla - Stirmate Gen 3',
    price: 18000, // TODO: actualizar precio real
    originalPrice: undefined,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.1,
    soldQuantity: 150,
    tiktokViews: '3.5M',
    badge: 'trending',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Revuelve solo mientras hacés otra cosa',
      'Velocidad variable — sirve para salsas, polenta, risotto',
      'Fácil de limpiar',
    ],
    cons: [
      'No sirve para ollas muy grandes',
      'Funciona a pilas',
    ],
    verdict: 'El gadget que no sabías que necesitabas. Ideal para salsas, polenta y risotto. Los videos de "mirá cómo cocina solo" son virales asegurados.',
    description: 'Revolvedor automático de ollas con 3 velocidades. Se apoya en cualquier olla y revuelve continuamente. Ideal para salsas, sopas, polenta y risotto.',
  },

  {
    id: 'ML-ORGANIZER-001', // TODO: reemplazar con MLA ID real
    title: 'Set Organizadores de Heladera x6 — Cajones Apilables',
    price: 12000, // TODO: actualizar precio real
    originalPrice: 15000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.4,
    soldQuantity: 800,
    tiktokViews: '4M+',
    badge: 'trending',
    pastelColor: 'var(--pastel-coral)',
    pros: [
      'Tendencia "quiet organizing" 2026',
      'Set completo de 6 piezas apilables',
      'Precio accesible — compra impulsiva',
      'Transformación visual increíble (antes/después)',
    ],
    cons: [
      'Verificar medidas de tu heladera antes de comprar',
      'Plástico — no apto para lavavajillas en todos los casos',
    ],
    verdict: 'El producto más visual para before/after en TikTok. La tendencia de organización de heladera sigue creciendo en 2026.',
    description: 'Set de 6 organizadores para heladera. Cajones apilables transparentes para frutas, verduras, fiambres y lácteos. Optimizá el espacio de tu heladera.',
  },

  // ─────────────────────────────────────────────
  // HOGAR — Gadgets virales
  // ─────────────────────────────────────────────

  {
    id: 'ML-VENTILADOR-001', // TODO: reemplazar con MLA ID real
    title: 'Ventilador de Techo Retráctil con Luz LED y Control Remoto',
    price: 85000, // TODO: actualizar precio real
    originalPrice: 95000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Hogar',
    categorySlug: 'hogar',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.3,
    soldQuantity: 300,
    tiktokViews: '6M+',
    badge: 'viral',
    pastelColor: 'var(--pastel-amber)',
    pros: [
      'Aspas retráctiles — se esconden cuando está apagado',
      '3 tonos de luz LED (fría, neutra, cálida)',
      'Control remoto con temporizador',
      'Ticket alto = buena comisión de afiliado',
    ],
    cons: [
      'Requiere instalación en el techo',
      'Precio elevado vs ventilador común',
    ],
    verdict: 'El producto con mayor ticket de la lista. Los videos de "mirá cómo desaparecen las aspas" son hipnóticos y virales. Marcas en ML: Etheos, Gadnic, Peabody.',
    description: 'Ventilador de techo con aspas retráctiles que se pliegan al apagarse. Luz LED de 3 tonos, 6 velocidades, modo verano/invierno, control remoto incluido.',
  },

  {
    id: 'ML-GALAXIA-001', // TODO: reemplazar con MLA ID real
    title: 'Proyector de Galaxia y Estrellas LED — Astronauta con Control Remoto',
    price: 22000, // TODO: actualizar precio real
    originalPrice: 28000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Hogar',
    categorySlug: 'hogar',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.5,
    soldQuantity: 600,
    tiktokViews: '10M+',
    badge: 'viral',
    pastelColor: 'var(--pastel-amber)',
    pros: [
      'Breakout hit Q1 2026 — un video viral generó +10.000 ventas',
      'Timer automático (45/90 min)',
      'Control remoto hasta 5 metros',
      'Ideal para contenido "bedroom glow-up"',
    ],
    cons: [
      'Proyección se nota menos con luz ambiente',
      'Ruido leve del motor de rotación',
    ],
    verdict: 'El producto viral #1 de 2026 a nivel global. Los videos de "bedroom glow-up" explotan en todas las plataformas. Versión astronauta es la más popular.',
    description: 'Proyector LED de galaxia y estrellas con forma de astronauta. Proyecta cielo estrellado en techo y paredes. Timer, control remoto, rotación 360°.',
  },

  {
    id: 'ML-MINIPROYECTOR-001', // TODO: reemplazar con MLA ID real
    title: 'Mini Proyector Portátil LED Full HD WiFi + HDMI',
    price: 120000, // TODO: actualizar precio real
    originalPrice: undefined,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Tech',
    categorySlug: 'tech',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.2,
    soldQuantity: 250,
    tiktokViews: '7M+',
    badge: 'trending',
    pastelColor: 'var(--pastel-blue)',
    pros: [
      'Convertí cualquier pared en cine',
      'WiFi + HDMI + USB + Bluetooth',
      'Portátil con batería recargable',
      'El ticket más alto = mayor comisión',
    ],
    cons: [
      'Brillo limitado vs proyector profesional',
      'Resolución nativa puede ser menor a Full HD en modelos baratos',
    ],
    verdict: 'El gadget aspiracional. Videos de "convertí mi cuarto en cine por $X" son irresistibles. Marcas en ML: Gadnic, ViewSonic M1.',
    description: 'Mini proyector portátil con WiFi, HDMI, USB y parlante integrado. Hasta 2000 lúmenes. Ideal para cine en casa, camping o presentaciones.',
  },

  {
    id: 'ML-LIMPIAVIDRIOS-001', // TODO: reemplazar con MLA ID real
    title: 'Limpiavidrios Magnético Doble Cara — Limpia Ambos Lados',
    price: 15000, // TODO: actualizar precio real
    originalPrice: 18000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Hogar',
    categorySlug: 'hogar',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.1,
    soldQuantity: 400,
    tiktokViews: '4.5M',
    badge: 'trending',
    pastelColor: 'var(--pastel-amber)',
    pros: [
      'Limpiás ambos lados de la ventana a la vez',
      'Imán potente — no se cae',
      'Súper visual para videos TikTok',
      'Envío gratis en ML',
    ],
    cons: [
      'Verificar espesor de vidrio compatible',
      'No funciona en vidrios muy gruesos sin versión especial',
    ],
    verdict: 'El producto de limpieza más viral. El efecto visual de limpiar ambos lados a la vez es contenido TikTok asegurado.',
    description: 'Limpiavidrios magnético que limpia ambos lados de la ventana simultáneamente. Sistema de imanes potentes con escurridor y paño de microfibra.',
  },

  // ─────────────────────────────────────────────
  // COMODINES VIRALES
  // ─────────────────────────────────────────────

  {
    id: 'ML-LEDSTRIP-001', // TODO: reemplazar con MLA ID real
    title: 'Tira LED RGB 5 Metros con Control Remoto y App',
    price: 8000, // TODO: actualizar precio real
    originalPrice: 12000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Hogar',
    categorySlug: 'hogar',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.3,
    soldQuantity: 2000,
    tiktokViews: '20M+',
    badge: 'hot-deal',
    pastelColor: 'var(--pastel-amber)',
    pros: [
      'El producto viral eterno — siempre vendiendo',
      'Control por app + control remoto',
      'Precio bajo = compra impulsiva garantizada',
      '-33% de descuento',
    ],
    cons: [
      'Adhesivo puede despegarse con el calor',
      'App puede variar según marca',
    ],
    verdict: 'El producto con más volumen de ventas de toda la lista. Siempre viral, siempre trending. Ideal para "room makeover" en TikTok.',
    description: 'Tira LED RGB de 5 metros con 16 millones de colores. Control por app Bluetooth y control remoto IR. Adhesivo 3M. Ideal para dormitorios y escritorios gamer.',
  },

  {
    id: 'ML-CARTRASH-001', // TODO: reemplazar con MLA ID real
    title: 'Mini Basura para Auto — Car Trash Can Compacto',
    price: 5000, // TODO: actualizar precio real
    originalPrice: undefined,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Gadgets',
    categorySlug: 'gadgets',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.0,
    soldQuantity: 300,
    tiktokViews: '2M',
    badge: 'trending',
    pastelColor: 'var(--pastel-blue)',
    pros: [
      'Cabe en portavasos o puerta',
      'Tapa con cierre hermético',
      'Precio ultra bajo = compra impulsiva',
    ],
    cons: [
      'Tamaño pequeño — solo para residuos chicos',
    ],
    verdict: 'El gadget de auto que no sabías que necesitabas. Trending en la categoría organización/limpieza de TikTok.',
    description: 'Mini cesto de basura compacto para auto. Cabe en portavasos o compartimento de puerta. Tapa hermética, fácil de vaciar y limpiar.',
  },

  {
    id: 'ML-ORGALACENA-001', // TODO: reemplazar con MLA ID real
    title: 'Organizador de Alacena Giratorio 360° — Lazy Susan',
    price: 10000, // TODO: actualizar precio real
    originalPrice: 13000,
    currency: 'ARS',
    image: '',
    images: [],
    category: 'Hogar',
    categorySlug: 'hogar',
    permalink: '',
    affiliateUrl: '',
    condition: 'new',
    freeShipping: true,
    rating: 4.4,
    soldQuantity: 350,
    tiktokViews: '3M+',
    badge: 'trending',
    pastelColor: 'var(--pastel-amber)',
    pros: [
      'Tendencia "quiet organizing" 2026',
      'Giratorio 360° — accedés a todo fácil',
      'Sirve para alacena, bajo mesada o heladera',
      'Transformación visual perfecta para content',
    ],
    cons: [
      'Verificar diámetro vs espacio disponible',
    ],
    verdict: 'Complemento perfecto de los organizadores de heladera. La dupla organización heladera + alacena es contenido gold para TikTok.',
    description: 'Organizador giratorio 360° tipo Lazy Susan para alacena o bajo mesada. Base antideslizante, ideal para especias, condimentos y frascos.',
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
