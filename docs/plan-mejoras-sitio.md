# Plan de mejoras del sitio (auditorías Codex + Gemini, 2026-07-11)

Síntesis de las dos auditorías técnicas (Codex = arquitectura/perf/seguridad; Gemini = diseño/CRO/descubribilidad) cruzada con los hallazgos de GSC. Los dos convergen en lo mismo desde ángulos opuestos: **enlazado interno débil (Gemini) + páginas lentas (Codex) = las dos palancas de DA1**, y explican por qué guías fuertes están clavadas en posición ~9.

Orden por impacto/esfuerzo. Nada del stack base se toca sin OK de Juan (regla 4 de CLAUDE.md).

---

## Tier 1 — Plata rápida de afiliado (bajo–medio esfuerzo, bajo riesgo)

- [x] **1.1 Botón de afiliado más grande en mobile** ✅ 2026-07-11 (44×44 mobile / 40×40 desktop, icono 16px)
  - Por qué: hoy es un ícono de 32×32px (`w-8 h-8`), muy chico para el pulgar → se pierden clicks (= comisiones) por fricción física. Estándar accesible: 44×44.
  - Archivos: `src/components/products/ProductCard.tsx`.
  - Pasos: en mobile, botón full-width (o mínimo 44×44); opcional, que tap en el precio también sea link al afiliado.
  - Riesgo: **bajo** (CSS/markup). Verificar en preview mobile.

- [x] **1.2 PriceHistoryChart prominente en la ficha** ✅ 2026-07-11 (promovido a primera sección tras el buy box, full-width legible)
  - Por qué: prueba social tipo CamelCamelCamel ("precio más bajo en 3 meses") → derriba la duda de compra y genera recurrencia (la gente vuelve a chequear si el precio de ML es "verdad").
  - Archivos: `src/components/products/ProductDetail.tsx` (subirlo above the fold), `src/components/widgets/PriceHistoryChart.tsx` (ya existe), datos en `src/data/price-history.json`.
  - Pasos: reposicionar el chart; estado vacío elegante cuando hay <2 puntos.
  - Riesgo: **bajo**. Ojo: `price-history.json` empezó a alimentarse el 2026-07-09 (Bright Data 3x/semana), todavía hay poca densidad por producto → priorizar productos con historial.

- [~] **1.3 PriceAlert + motor de alertas por email** — 🟡 Código completo 2026-07-11, falta activación de Juan.
  - **Captura:** widget guarda el lead (`/api/subscribe`, `source: "price-alert"`, loading/error/timeout/lock/a11y, copy honesto). Sumado a las 21 fichas sin stock ("avisame cuando vuelva", `ref = productId`).
  - **Motor:** `scripts/notify-price-drops-email.cjs` (dry-run/`--send`) manda las bajas de cada corrida de Bright Data a los suscriptores `price-alert` vía Resend, con link de afiliado. Baja de suscripción: `/api/unsubscribe` + HMAC (`src/lib/unsubscribe-token.ts`) + migración `003`. Paso agregado al workflow `update-prices-brightdata`.
  - Auditado por el trío (Codex + agy): arreglados bajas accidentales (GET→confirmación, POST da de baja), DB caída (503, no éxito falso), duplicados (tabla `sent_price_alerts` + idempotencia), secret obligatorio antes de enviar. Mail con thumbnails/preheader/asunto dinámico/tope 12.
  - **FALTA (Juan) para activarlo:** (1) cuenta Resend + verificar dominio `productosvirales.com.ar`; (2) secrets en **GitHub Actions**: `RESEND_API_KEY`, `EMAIL_FROM` (`ProductosVirales <ofertas@productosvirales.com.ar>`), `UNSUBSCRIBE_SECRET` (aleatorio), `DATABASE_URL` (el de Neon); (3) el MISMO `UNSUBSCRIBE_SECRET` + `DATABASE_URL` en **Vercel** (para `/api/unsubscribe`); (4) correr en Neon las migraciones `003_subscribers_unsubscribe.sql` y `004_sent_price_alerts.sql`.
  - Por qué: la feature más alineada con recurrencia y afiliados; máquina de plata en Hot Sale / Black Friday. Hoy `PriceAlert` solo setea estado local, no guarda nada.
  - Archivos: `src/components/widgets/PriceAlert.tsx`, `src/app/api/subscribe/` (YA existe), Neon (`subscribers` ya existe; falta `price_watches`).
  - Pasos: (a) form que postee a `/api/subscribe` con `source: "price-alert"` + `productId`; (b) tabla `price_watches` en Neon; (c) enganchar al pipeline de precios que YA corre (Bright Data 3x/semana) para disparar la alerta con el link de afiliado por email (Resend) o Telegram.
  - Riesgo: **medio** (toca Neon + cron + Resend). NO usar API de ML (bloqueada) — usar el flujo Bright Data existente.

---

## Tier 2 — Estructural SEO / enlazado interno (medio) — la mayor palanca DA1

- [x] **2.1 Categorías como links reales (matar "categorías fantasma")** ✅ 2026-07-11 (dropdown en Header con los 10 hubs como links reales; `category-nav.ts` liviano; a11y con `inert` tras audit de Codex)
  - Decisión (Juan, 2026-07-11): los **CategoryTabs de la home se quedan como filtro** del feed (no navegan a los hubs). La crawlabilidad de los hubs ya la cubre el dropdown del Header en toda página.
  - Por qué: los `CategoryTabs` de la home son botones de React con `onClick`, **no links `<a>`** → Google no puede crawlear los hubs `/categoria/[slug]` desde la home y quedan huérfanos. El Header además hardcodea `/categoria/belleza`. Enlazado interno = palanca #1 de DA1; conecta directo con el "por qué posición 9".
  - Archivos: `CategoryTabs` (home feed), `src/components/layout/Header.tsx`.
  - Pasos: (a) tabs → `<Link href="/categoria/[slug]">` o que actualicen `?cat=slug`; (b) Header: dropdown "Categorías" con TODOS los hubs (pasa link juice desde el header a todo el sitio).
  - Riesgo: **medio** — toca navegación/home. Mantener el filtrado actual funcionando (pasar a URL-driven sin romper la UX).

- [x] **2.2 Trending pills al buscador interno (frenar fuga de link juice)** ✅ 2026-07-11 (pills → `/?q=` interno con `<Link>`; términos curados a nuestro catálogo; ya no van a mercadolibre.com.ar)
  - Por qué: `TrendingBar`/`TrendingPills` linkean directo a `listado.mercadolibre.com.ar` → echás al usuario y a Google fuera del sitio en el primer pantallazo, sin pasar por el embudo.
  - Archivos: `src/components/.../TrendingBar.tsx`, `TrendingPills.tsx`.
  - Pasos: apuntar a `/buscar?q=...` interno (depende de 2.3).
  - Riesgo: **bajo–medio**.

- [ ] **2.3 Buscador interno `/buscar` con filtros reales**
  - Por qué: retención, más páginas indexables, y destino para las trending pills. Los dos auditores lo piden. Ya existe `/api/search`.
  - Archivos: nueva ruta `src/app/buscar/page.tsx` (server), índice server-only desde `curated-products` (NO búsqueda client sobre todo el catálogo).
  - Pasos: página server con filtros (categoría, precio, rating, envío, priceStatus, descuento, orden).
  - Riesgo: **medio** (feature nueva). Cuidar de no meter el catálogo entero al cliente (ligado a 3.1).

---

## Tier 3 — Técnico de fondo (medio–alto) — levanta el piso de TODO

- [x] **3.1 Sacar el catálogo del bundle cliente (P0 de Codex)** ✅ 2026-07-11 — chunk del catálogo **3,71 MB → 0,22 MB**. HomeFeed recibe DTOs (`toFeedCard`); StickyBuyBar recibe DTO desde GuideRenderer; ProductDetail usa un parser markdown client-safe (`inline-markdown.tsx`) con los tokens de precio resueltos en el server. Verificado: chequeo transitivo limpio + home/ficha/guía andan.
  - Por qué: hay un chunk JS de ~3,7 MB con el catálogo entero (IDs, affiliateUrl, articleBody) porque componentes client importan `curated-products.ts` (~4 MB) y `guides.ts` (~2,2 MB). Mata Core Web Vitals → techo de ranking + UX lenta.
  - Archivos: `src/components/feed/HomeFeed.tsx` (`"use client"` importa `getRotatedVisibleProducts`), `src/lib/products.ts`, `src/app/page.tsx`, `src/components/guides/StickyBuyBar.tsx`, `QuickPicks.tsx`.
  - Pasos: páginas server resuelven productos y pasan DTOs chicos (ya existe `CardProduct` en `types.ts` justo para esto); los componentes client reciben props, no importan la data.
  - Riesgo: **medio–alto** — toca la arquitectura de datos + home. Requiere avisar antes (regla 4). Verificar con `npm run build` + preview.

- [ ] **3.2 `ProductDetail` → RSC + islas cliente**
  - Archivos: `src/components/products/ProductDetail.tsx`.
  - Pasos: contenido, tablas, pros/cons, reviews, FAQ y JSON-LD en server; dejar client solo `ProductGallery`, `PriceHistoryChart`, `ShareButtons`, `StickyMobileCta`. Reemplazar GSAP por CSS transitions o import dinámico.
  - Riesgo: **medio–alto**.

- [ ] **3.3 Home cacheable**
  - Archivos: `src/app/page.tsx` (usa `Math.random()` en `makeRotationSeed()` + `searchParams` → request-driven).
  - Pasos: seed diario determinístico + `revalidate = 86400`; mover búsqueda a `/buscar`.
  - Riesgo: **medio**.

---

## Mantenimiento / aparte (bajo esfuerzo, cuando haya hueco)

- [ ] **Seguridad:** rotar los OAuth tokens y secrets locales (`scripts/gsc/token.json`, `scripts/ga4/token.json`, `scripts/gsc/client_secret.json`, `scripts/keyword-planner/google-ads.yaml`) y cambiar el `*.json` global del `.gitignore` por ignores específicos (para no esconder archivos nuevos sin querer). Están gitignoreados (no se suben), pero conviene rotarlos.
- [ ] **Imágenes:** `<img>` crudo → `next/image` en `QuickPicks`, `guides/ProductCard`, `StickyBuyBar` (control de CLS y formatos).
- [x] **Accesibilidad:** ✅ 2026-07-11 — `MobileNav` con `role="dialog"`/`aria-modal`/foco al abrir/`inert` al cerrar/Escape (+ unificado a los 10 hubs); `aria-label` en el botón limpiar de `SearchInput`; `aria-expanded`/`aria-haspopup` en el hamburguesa. (Falta focus-trap completo; nice-to-have.)
- [ ] **CSP:** sacar `unsafe-eval`/`unsafe-inline` pasando GA/Clarity a nonce o componentes controlados (`next.config.ts`).
- [ ] **URL base:** centralizar en `src/lib/site.ts` (`SITE_URL`, `absoluteUrl(path)`) y usarlo en sitemap, metadata, guide-url, llms, JSON-LD.

---

## Secuencia recomendada

1. **Tier 1 completo** primero — visible, bajo riesgo, plata de afiliado directa. Arrancar por 1.1 (trivial) y 1.2 (alto valor/bajo riesgo); 1.3 como mini-proyecto aparte.
2. **2.1 (categorías como links)** — la mayor palanca DA1, y no depende de guías frescas.
3. **3.1 + 2.3 juntos** — sacar el catálogo del cliente y montar el buscador server-side comparten el mismo trabajo (índice server-only). Es el proyecto técnico de fondo; se planifica y ejecuta con OK explícito.

> Nota: las optimizaciones on-page de guías por posición (freidora, estufas) quedan para cuando maduren — no se re-optimizan guías frescas. Para eso está `gsc.py oportunidades`.

---

## Loop de mejora continua (Codex + Gemini/agy, a pedido de Juan 2026-07-30)

Registro de qué se preguntó y qué se propuso en cada iteración, para no repetir preguntas ya contestadas. Ver memoria `sinergia-codex-gemini-mejora-continua`.

### Iteración 1 (2026-07-30)

**Preguntado:** las 7 preguntas estándar (funciones nuevas, velocidad, fricción, conversión, "¿funciona bien?", retención sin dark patterns, limpieza visual moderna) a Codex y Gemini/agy en paralelo, con el estado actual del sitio (contexto de `docs/plan-mejoras-sitio.md` ya resumido en el prompt) + investigación web propia de tendencias 2026 (UX/conversión de sitios de afiliados, diseño minimal/rápido).

**Filtrado antes de llegar a Juan:** 3 de las 12 ideas combinadas (Codex 6 + Gemini 6) ya estaban implementadas y se descartaron sin mostrárselas: el "Sticky CTA mobile inteligente" (Gemini #2) es exactamente `StickyMobileCta.tsx`, ya con IntersectionObserver en ambos extremos; el bloque "Veredicto" pros/contras (Gemini #3) es "El resumen honesto" (`ProductDetail.tsx`); el framing "comprálo si / no sirve si" (Codex #2) ya vive en el pull-quote 💬 de cada ficha. Verificado leyendo el código, no asumido.

**4 ideas propuestas a Juan** (coincidencia real entre las dos IAs en 2 de los 4 conceptos, elegido como señal de fuerza):
1. Badge "precio más bajo en X días" en las tarjetas de listado (home/guías), no solo dentro de la ficha — el dato ya existe (`price-history.json` + `analyzePriceHistory`), falta exponerlo en `ProductCard.tsx`. Propuesto independientemente por Codex ("semáforo de compra") y Gemini ("etiqueta de oportunidad real").
2. Comparador/lista local sin cuentas (localStorage, sin backend) — propuesto independientemente por Codex ("guardados + comparación rápida") y Gemini ("comparador frente a frente"). Nada de esto existe hoy en el repo (grep confirmado).
3. Filtros por caso de uso en listados de guías (ej. "para correr", "para casa chica") en vez de solo specs — complementa el buscador `/buscar` ya planeado (Tier 2.3).
4. Skeleton loaders / micro-interacciones para velocidad percibida — ángulo nuevo, el plan técnico existente (Tier 3) solo cubre velocidad real (RSC/caché), no percibida.

**Pendiente para la próxima iteración:** no repreguntar estas 7 preguntas genéricas — la próxima vuelta debería enfocarse en profundizar UNA de las ideas elegidas por Juan (si elige alguna) o en un ángulo no cubierto todavía (ej. SEO/GEO específico para AI Overviews, monetización más allá de ML afiliados).

### Iteración 2 (2026-07-30) — Diversificación de ingresos

**Preguntado:** si conviene diversificar ingresos más allá de la comisión de ML en esta etapa (4 meses, DA~1, tráfico bajo), y si conviene, qué 2-3 vías priorizar. Explícitamente se preguntó por AdSense/Ezoic.

**Filtrado antes de llegar a Juan:** el "newsletter" que ambas IAs propusieron como prioridad #1 de forma independiente NO es una idea nueva a construir de cero — el capture ya existe (`NewsletterBanner.tsx`, banner no bloqueante con scroll-trigger al 60%, postea a `/api/subscribe`). Lo que falta es el motor de envío de un digest ("mejores ofertas de la semana") y la activación de infraestructura — el MISMO bloqueo ya documentado en Tier 1.3 de este mismo archivo (Resend + secrets en GitHub/Vercel + migraciones Neon). Verificado leyendo el código antes de presentarlo como nuevo.

**Conclusión con más peso (coincidencia total, no parcial):** las dos IAs, de forma independiente, dijeron NO a activar Google AdSense/Ezoic en esta etapa, con cifras concretas: Ezoic exige ~250.000 usuarios/mes para sitios nuevos (fuera del programa Incubator); Gemini sugirió esperar a cruzar ~50.000 visitas/mes. El daño a Core Web Vitals y a la estética "curador honesto" no compensa el RPM bajísimo con el tráfico actual.

**3 ideas/decisiones propuestas a Juan:**
1. **Decisión, no build:** no activar AdSense/Ezoic todavía — dejarlo anotado como umbral (~50k visitas/mes) para revisar más adelante, no como tarea.
2. **Activar (no construir) el motor de newsletter/digest** — mismo bloqueo de infraestructura que PriceAlert (Tier 1.3): falta cuenta Resend + secrets + migraciones Neon, más un script nuevo tipo `notify-weekly-digest.cjs` (no existe hoy, solo existe el de bajas de precio).
3. **Afiliados complementarios muy selectivos** — sumar un link secundario a otra tienda/red de afiliados SOLO en categorías puntuales donde honestamente convenga más que ML (no reemplaza el botón principal). Esfuerzo medio, requiere altas de cuentas nuevas + regla editorial clara por categoría, avisar antes. Patrocinios/CPA directo con marcas D2C quedan para más adelante (ambas IAs coinciden: hoy se negociaría desde debilidad, sin autoridad/tráfico).

**Pendiente para la próxima iteración:** SEO/GEO para respuestas de IA generativa (AI Overviews, ChatGPT, Perplexity) — ángulo todavía no cubierto.

### Iteración 3 (2026-07-30) — GEO / respuestas de IA generativa

**Preguntado:** qué le falta al sitio para maximizar citas en AI Overviews/ChatGPT/Perplexity, qué patrones de contenido aumentan citabilidad, si es realista competir ahora con DA~1, y si hay algo específico de Argentina/español a tener en cuenta.

**Filtrado antes de llegar a Juan (fuerte esta vez):** 3 de las 4+4 recomendaciones ya estaban resueltas, ninguna de las dos IAs lo sabía:
- "Auditoría de acceso para crawlers de IA" (Codex #1) → `src/app/robots.ts` YA permite explícitamente `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot` y bloquea solo los bots de entrenamiento puro (`CCBot`, `Google-Extended`). Ya está bien pensado, con comentario explicando el criterio.
- "Implementar llms.txt" (parte de Gemini #3) → ya existe `src/app/llms.txt/route.ts`, generado en build time desde las guías publicadas reales, agrupado por cluster. Lo que NO existe es la variante "full" (ver abajo).
- "Autoridad editorial mínima" (Codex #3: metodología/transparencia de afiliados) → ya existe `/sobre-nosotros` con metodología, cómo se gana dinero y por qué confiar, confirmado leyendo el metaDescription real de la página.

**3 ideas nuevas propuestas a Juan:**
1. **Pasajes densos en datos ("information gain"), 40-60 palabras, con fecha de verificación** — reescribir los bloques clave de las guías con hechos concretos al frente (no prosa de relleno). Propuesto independientemente por Codex y Gemini. No es código: es un ajuste de estilo editorial aplicable vía `/optimizador-guias-pv` en próximas guías nuevas u optimizaciones, no en todo el catálogo de una vez.
2. **`llms-full.txt`: volcado completo del contenido en Markdown** (más allá del índice liviano que ya existe en `llms.txt`) — para que los crawlers de IA no dependan de renderizar el DOM/JS. Esfuerzo medio, **requiere aviso previo** (toca routing/robots).
3. **Enlaces salientes a fuentes primarias** (manual oficial del fabricante, certificaciones IRAM, ficha técnica de marca) en las fichas donde esa fuente YA se usa para verificar specs (confirmado con grep: 0 links salientes hoy en `curated-products.ts`/`guides.ts`, pese a que ya se cruzan datos contra manuales oficiales — ver memoria `ratificar-modelo-antes-de-usar-manual`). Hoy se usa la fuente para chequear el dato pero no se cita. Esfuerzo bajo, riesgo bajo, refuerza "curador honesto" con evidencia visible.

**Validación, no acción nueva:** ambas IAs coincidieron en que competir por citas de IA en términos genéricos ("mejor robot aspiradora") no es realista con DA~1 y 4 meses — pero sí para long-tail/marcas locales (Liliana, Peabody, Atma) donde el sitio puede ser la única fuente clara ("vacío de datos"). Esto confirma la estrategia cola/marca que ya se venía siguiendo, no agrega trabajo nuevo.

**Pendiente para la próxima iteración:** benchmarking contra sitios de afiliados reales que rankean bien en Argentina/LATAM — ángulo todavía no cubierto.

### Iteración 4 (2026-07-30) — Benchmarking contra sitios reales

**Preguntado:** qué hacen mejor en UX/contenido/estructura sitios de afiliados/comparadores reales que rankean en Argentina hoy (Codex y Gemini buscaron en vivo: EligiBien, CuálDura, MejoresCompras.com.ar, Historial.com.ar, Precialo.com.ar, comparado también contra la nota de MercadoLibre de cafeteras espresso).

**Filtrado antes de llegar a Juan (la ronda con más redundancia hasta ahora):** de las 8 ideas combinadas, 5 ya estaban resueltas o eran repetición de iteraciones anteriores:
- "Veredicto cuantificado arriba de todo" (Codex #1) → ya es el bloque `quickPicks` ("Nuestras elecciones") al inicio de cada guía.
- "Señal de precio confiable / mínimo histórico" (Codex #3) → YA EXISTE, es exactamente `PriceHistoryChart` (mínimo/hoy/máximo + "Hoy está en su precio más bajo registrado"). Codex no lo sabía y lo marcó como esfuerzo alto/riesgo alto.
- "Secciones anti-marketing / qué ignorar / trampas de categoría" (Codex #4, Gemini #3) → confirmado con grep: el patrón "qué mirar/qué evitar/errores comunes" ya aparece 55 veces en `guides.ts`, ya es estándar del template.
- "Bloques de decisión por caso de uso" (Codex #2) → mismo concepto que la idea #3 de la Iteración 1 (filtros por caso de uso), no es nuevo.
- "Badges anti-trampas / mínimo histórico / precio verificado" (Gemini #1) → refuerza (tercera vez que sale) la idea #1 de la Iteración 1 (badge de precio en tarjetas de listado), no es nueva.

**2 ideas genuinamente nuevas:**
1. **Guías/agrupaciones por límite de presupuesto específico en pesos** (ej. "notebooks por menos de $500.000", "regalos tecnológicos por menos de $50.000") — ángulo de contenido nuevo, bajo esfuerzo, alta relevancia en contexto inflacionario argentino. Riesgo: los montos quedan desactualizados rápido, necesitan revisión periódica.
2. **Buscador/analizador de link de ML en vivo** (pegar un link, veredicto instantáneo) — propuesto por Gemini, pero **choca con una restricción ya conocida del proyecto**: la API oficial de MercadoLibre está bloqueada (401), el sitio usa Bright Data para todo dato en vivo (ver memoria `no-usamos-api-ml-usamos-brightdata`). Un fetch en vivo simple como lo describe Gemini no es viable tal cual; habría que rediseñarlo (o descartarlo). Marcado explícitamente como "requiere aviso previo a Juan" y con una limitación técnica real detectada, no solo de esfuerzo.

**Señal de que el loop está rindiendo menos por vuelta:** de 4 ideas nuevas (iteración 1) a 3 (iteración 2) a 3 (iteración 3) a 2 (iteración 4, y una de esas 2 con una limitación técnica real). Se pausó el loop acá para que Juan decida qué construir antes de seguir generando ideas — seguir de largo con rendimientos decrecientes es la señal clásica de "loop-until-dry".
