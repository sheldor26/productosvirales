# Línea de base: requests de categoría antes del fix de prefetch

Para comparar después del deploy `6002ea5` (2026-08-06 23:33 ART).

## Cómo se midió

Vercel runtime logs, proyecto `prj_PXCYIx1iZUsMkC5dpvYqAYBLc7dr`,
team `team_xNLb1GJeiOqnHpE0iMLkyGzB`, agrupado por `requestPath`,
environment `production`, ventana `since: 6h`.

Corrida el 2026-08-07 a las 02:14 UTC, o sea la ventana
**2026-08-06 17:14 a 23:14 ART**.

Para que la comparación valga, la próxima medición tiene que ser en la
misma franja horaria (el tráfico varía mucho por hora del día).

## Números de base

Total de requests en la ventana: **9.655** (9.097 con status 200, 558 con 304,
cero errores).

Las 10 rutas de `CATEGORY_NAV`:

| Ruta | Hits en 6h |
|---|---|
| /categoria/seguridad | 359 |
| /categoria/climatizacion | 341 |
| /categoria/coleccionables | 338 |
| /categoria/cocina | 335 |
| /categoria/audio | 334 |
| /categoria/gaming | 329 |
| /categoria/hogar | 328 |
| /categoria/salud-bienestar | 328 |
| /categoria/tech | 327 |
| /categoria/belleza | 327 |
| **Total** | **3.346** (35% de todo el tráfico) |

Otras rutas de navegación, no tocadas por el fix (sirven de control):

| Ruta | Hits en 6h |
|---|---|
| /guias | 376 |
| /trending | 335 |
| /guardados | 316 |
| / | 300 |

## Qué mirar

1. **La señal principal:** que las 10 categorías bajen y **dejen de estar
   todas empatadas en ~330**. El empate es la huella del prefetch: son hits
   automáticos, no interés real. Si bajan pero siguen parejas entre sí, el
   prefetch sigue viniendo de otro lado.

2. **El control:** `/guias`, `/trending`, `/guardados` y `/` **no** deberían
   bajar mucho, porque a esos links no les tocamos el prefetch. Si bajan
   igual, entonces cambió el tráfico real y la comparación no vale.

3. **`movilidad` como testigo:** no está en `CATEGORY_NAV`, así que nunca se
   prefetcheó. Antes del fix no llegaba a 40 hits mientras las del nav tenían
   ~330. Después del fix, las del nav deberían acercarse al orden de magnitud
   de movilidad. Ese es el número "limpio" de tráfico real por categoría.

## Qué se cambió

`prefetch={false}` en los links de categoría de `Footer.tsx` y del dropdown
de `Header.tsx`. `MobileNav.tsx` conserva el prefetch a propósito (es la vía
real de navegación en celular), así que **no se espera que la baja sea del
100%** — la estimación es entre 20% y 35% del total del sitio.
