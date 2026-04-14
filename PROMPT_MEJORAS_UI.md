# Prompt para mejoras visuales de ProductosVirales

Necesito que hagas mejoras visuales a mi proyecto Next.js (ProductosVirales). Es un sitio de productos virales de MercadoLibre Argentina con estética de tendencias/TikTok. Antes de hacer cualquier cambio, leé la guía de Next.js en `node_modules/next/dist/docs/` y respetá lo que diga. No asumas que las APIs son iguales a versiones anteriores.

## Contexto del proyecto
- Next.js 16.2.3, React 19.2.4, Tailwind CSS v4 (inline theme en globals.css), Framer Motion, Lucide icons
- Tema claro/oscuro con CSS variables y `next-themes` (atributo `data-theme`)
- Fuentes actuales: Plus Jakarta Sans (display), DM Sans (body), Dancing Script (accent/logo)
- El sitio ya funciona y compila. No rompas nada, hacé cambios incrementales.

## Cambios que quiero (en orden de prioridad)

### 1. Hero Banner más impactante (`src/components/feed/HeroBanner.tsx`)
El hero actual es un gradiente rosa-azul-verde con círculos decorativos blancos. Está bien pero se siente genérico.

Mejoras:
- Agregá una textura de noise/grain sutil con CSS (un pseudo-elemento ::after con un SVG inline de noise o un filtro). Mantené el gradiente pero hacelo más vibrante/saturado.
- Hacé el H1 más grande y con más impacto: `text-3xl md:text-5xl` en vez del `text-2xl md:text-3xl` actual.
- Acortá el copy del H1 a algo más directo, por ejemplo: "Lo que todos están comprando" o "Los productos que explotan en Internet". Mantené la vibe argentina.
- Mejorá la animación de entrada: en vez del simple fade-in actual (`opacity 0→1, y 10→0`), hacé un stagger donde primero aparece el label, después el H1, después el párrafo, y último el botón (usá motion de framer-motion con variants y staggerChildren).
- Agregá un efecto de shimmer/brillo sutil en el botón CTA para atraer la atención.
- Reemplazá los círculos decorativos con formas más interesantes (blobs amorfos con border-radius tipo `30% 70% 70% 30% / 30% 30% 70% 70%` o similar).

### 2. Product Cards con más personalidad (`src/components/products/ProductCard.tsx`)
Las cards están bien pero son todas iguales visualmente sin importar si el producto es "viral", "trending" o "hot-deal".

Mejoras:
- Para productos con `badge === "viral"`: agregá un borde sutil con glow (un `ring` o `shadow` con color, algo como `shadow-[0_0_12px_rgba(239,68,68,0.15)]` o similar).
- Para `badge === "hot-deal"`: agregá un efecto de pulse sutil en el badge de descuento (una animación CSS `@keyframes pulse-badge`).
- Mejorá el hover: además del `-translate-y-0.5` actual, hacé que el shadow sea más pronunciado y que la imagen haga un scale un poco más dramático (scale-108 en vez de scale-105).
- El título a `text-[13px]` en mobile es muy chico. Subilo a `text-sm` (14px).

### 3. Dark mode con más profundidad (`src/app/globals.css`)
El dark mode actual (`#0a0a0f`) es muy plano y oscuro. 

Cambios en el bloque `[data-theme="dark"]`:
- Cambiá `--bg-primary` de `#0a0a0f` a `#0c0c18` (un azul/violeta muy oscuro, da más profundidad).
- Cambiá `--bg-secondary` de `#141420` a `#16162a` (acompaña al primary).
- Cambiá `--border` de `rgba(255,255,255,0.07)` a `rgba(255,255,255,0.09)` (un toque más visible).

### 4. TrendingBar más viva (`src/components/feed/TrendingBar.tsx` y `src/components/feed/TrendingPills.tsx`)
Las pills de trending se pierden visualmente, parecen texto plano.

Mejoras:
- En `TrendingPills.tsx`: agregá un efecto de auto-scroll tipo marquee con CSS animation (`@keyframes marquee` que mueva el contenedor en X). Duplicá el array de trends para que el loop sea seamless.
- Dale más presencia visual a las pills: bordes más definidos, y al hacer hover que cambien a un fondo más vibrante.
- El label "Trending en ML" podría tener un icono animado (el TrendingUp con una animación sutil de bounce o pulse).

### 5. Widgets de conversión con más punch
**WhatsAppCTA** (`src/components/widgets/WhatsAppCTA.tsx`):
- Hacelo "use client" y agregá un shimmer effect en el botón "Unirme gratis" (una animación CSS de un brillo que pasa de izquierda a derecha cada 3 segundos).
- Agregá un emoji 🔥 o ícono al lado del texto del botón.

**PriceAlert** (`src/components/widgets/PriceAlert.tsx`):
- Agregá un gradiente sutil en el fondo en vez del `bg-[var(--bg-secondary)]` plano. Algo como un gradiente del bg-secondary a bg-primary muy sutil.
- El icono de Bell podría tener una micro-animación de "ring" (una rotación de ±5 grados que se repita 2 veces al montar el componente).

### 6. Espaciado con más variación (`src/app/page.tsx`)
El home usa `space-y-8 md:space-y-10` para todo, lo que crea un ritmo monótono.

- Sacá el `space-y-8 md:space-y-10` del contenedor principal.
- Usá gaps variables: más aire antes/después de los widgets de conversión (WhatsAppCTA, PriceAlert) con `mt-12 md:mt-16`, y mantené gaps más compactos entre HeroBanner → HomeFeed → TrendingBar con `mt-6 md:mt-8`.

## Reglas importantes
- No cambies la estructura de componentes ni los types. Solo mejoras visuales y animaciones.
- Todos los colores nuevos deben usar CSS variables en `globals.css` para soportar dark/light mode.
- Las animaciones CSS nuevas van en `globals.css`. Las de Framer Motion van inline en los componentes.
- No instales paquetes nuevos. Usá solo lo que ya está: Framer Motion, Lucide, Tailwind v4.
- Asegurate que todo compile sin errores después de cada cambio.
- Probá que el dark mode se vea bien con cada cambio.
