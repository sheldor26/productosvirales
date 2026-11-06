# Seguimiento de seguidores del perfil social de MercadoLibre

Mide el efecto del aviso "seguinos en ML" (`SeguirMlBanner.tsx`, disparado desde
`AffiliateTracker.tsx`) sobre los seguidores del perfil
[Productos Virales en MercadoLibre](https://www.mercadolibre.com.ar/social/jm159).

## Por qué es manual (por ahora)

No hay API de MercadoLibre para esto (regla del repo: no usamos la API de ML,
usamos Bright Data — ver `scripts/apply-brightdata-prices.cjs`). El collector
de Bright Data que ya existe (`c_mrbcvyc91n9lmqv6dt`, disparado desde
`.github/workflows/brightdata-scoped-scrape.yml`) está armado para fichas de
producto (precio, rating, reviews), no para una página de perfil social — no
devuelve conteo de seguidores. Un fetch directo sin Bright Data se bloquea
(ML frena navegadores automatizados sin fingerprint real).

**Por ahora, la medición es manual:** entrar a la URL del perfil con un
navegador real (no el navegador interno de Claude Code, que ML bloquea) y
anotar el número que muestra "+N seguidores". Si esto se vuelve una rutina
frecuente, la mejora pendiente es armar un collector de Bright Data nuevo
apuntado a esa página — no está hecho todavía.

## Cómo tomar una medición nueva

1. Abrir `https://www.mercadolibre.com.ar/social/jm159` en un navegador real
   (logueado o no, el dato es público).
2. Anotar el texto exacto que muestra junto al botón "Seguir" (hoy dice
   "+30 seguidores" — puede ser un número aproximado, no necesariamente exacto).
3. Agregar una fila a la tabla de abajo con la fecha.

## Historial

| Fecha | Seguidores | Nota |
|---|---|---|
| 2026-11-06 | +30 | Baseline, ANTES de activar el banner en producción (deploy el mismo día) |

## Qué mirar en paralelo (GA4)

El banner manda tres eventos a GA4 y Clarity (ver `AffiliateTracker.tsx` /
`SeguirMlBanner.tsx`):

- `seguir_ml_banner_shown`: se mostró el aviso (una vez por semana por navegador).
- `seguir_ml_banner_click`: alguien tocó el aviso y se abrió el perfil de ML
  en una pestaña nueva — intención de seguir, no confirma que haya tocado
  "Seguir" ahí adentro.
- `affiliate_click`: ya existía, click real a un link de afiliado (lo que
  dispara el aviso).

Con eso se puede calcular una tasa de click del aviso
(`seguir_ml_banner_click / seguir_ml_banner_shown`) sin esperar el número de
seguidores, que tarda más en reflejar el cambio real.
