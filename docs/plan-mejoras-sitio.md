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
  - **2026-07-30 (loop de mejora continua):** sumado `scripts/notify-weekly-digest.cjs` — motor de digest semanal para los suscriptores `source='newsletter'` (los que se anotan desde `NewsletterBanner.tsx`, el capture ya vivía hecho antes de esta sesión). Calcula bajas reales de los últimos 7 días directo desde `price-history.json` (no depende del archivo efímero de cada corrida de Bright Data). Mismos guards de envío que el script de arriba (sin secrets no manda nada); probado en `--preview` y dry-run, sin `--send`. Falta: decidir día/hora y agregarlo a un cron/workflow — no está enganchado a ninguno todavía.
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

- [x] **3.3 Home cacheable** ✅ ya resuelto (fecha exacta no registrada, encontrado stale en esta nota el 2026-07-30 vía iteración 7 del loop de mejora continua). `src/app/page.tsx` ya tiene `export const revalidate = 600` y `makeRotationSeed()` usa una semilla por bucket de tiempo, no `Math.random()` (comentario propio en el código: "Semilla por bucket de tiempo (no Math.random)"). Esta nota había quedado desactualizada.

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

### Ronda de implementación (2026-07-30, misma sesión)

Juan pidió explícitamente aplicar las ideas ya validadas, en local sin pushear, sin pausas entre una y otra. 5 commits locales, cada uno verificado con `tsc --noEmit` + `npm run build` + chequeo real en navegador antes de commitear:

1. **Badge "mínimo histórico" en tarjetas de listado** (iteración 1, idea #1) — `commit a498141`. Reusa `analyzePriceHistory` ya existente; se agregó `bestPrice` a `CardProduct`.
2. **"Guardados" — lista local sin cuentas** (iteración 1, idea #2) — `commit 6514ae4`. `useSavedProducts` (localStorage) + `/api/saved-products` + `/guardados` + contador en el Header. **Bug real encontrado y corregido en el camino:** el botón había quedado anidado dentro del `<Link>` de la imagen (HTML inválido, rompía clicks); se sacó como hermano en un wrapper propio.
3. **Skeletons de carga** (iteración 4, idea de Gemini) — `commit 8fa5edb`. `loading.tsx` de App Router para `/categoria/[slug]` y `/producto/[slug]` (la página que más convierte), reusando `Skeleton`/`ProductCardSkeleton` que ya existían pero solo se usaban en la home.
4. **Motor de digest semanal por email** (iteración 2, idea #2) — `commit 3b202a8`. `scripts/notify-weekly-digest.cjs`, mismo patrón de guards que `notify-price-drops-email.cjs`. Código completo, sin activar (mismo bloqueo de infraestructura que `PriceAlert`, sin cron todavía).
5. **Enlaces a fuentes primarias — prueba de concepto** (iteración 3, idea #3) — `commit ae8cea4`. Una sola ficha (Garmin Instinct 3): las 3 menciones de "según la web oficial de Garmin" ahora enlazan de verdad, URL verificada en vivo antes de citarla. **Nota técnica encontrada sin corregir:** el parser de markdown externo marca todo link externo con `rel="nofollow sponsored"`, sin distinguir cita editorial de afiliado — funciona, pero es semánticamente impreciso; corregirlo toca un archivo compartido por 500+ fichas, queda para sesión aparte con OK explícito.

**No implementado, con motivo:**
- Filtros por caso de uso en listados de guías (iteración 1 #3 / iteración 4 #2, mismo concepto): requiere tagging editorial real por guía (170+), no es un cambio mecánico — mejor candidato para ir guía por guía vía `/optimizador-guias-pv`, no un barrido.
- `llms-full.txt`, afiliados complementarios, AdSense/Ezoic: bloqueados por reglas propias del proyecto (avisar antes de tocar routing, no crear cuentas de terceros sin autorización, decisión ya tomada de NO por ahora).

**Señal de que el loop estaba rindiendo menos por vuelta:** de 4 ideas nuevas (iteración 1) a 3 (iteración 2) a 3 (iteración 3) a 2 (iteración 4, y una de esas 2 con una limitación técnica real). Se había pausado acá — Juan pidió retomarlo sin pausas y aplicando código real (ver "Ronda de implementación" arriba), así que sigue.

### Iteración 5 (2026-07-30) — Manejo de errores y estados vacíos

**Preguntado:** qué pasa cuando algo sale mal o no hay datos — stock agotado en vivo, búsqueda/categoría sin resultados, imagen que no carga, producto descontinuado (404), algo que se rompe silenciosamente.

**Filtrado antes de llegar a Juan:** el "404 con recuperación" que propusieron LAS DOS IAs (Codex #4, Gemini #1) ya está resuelto — `src/app/not-found.tsx` ya explica "el producto ya no está disponible", con categorías + 8 productos populares. Otra vez las dos IAs coincidieron en algo que ya existía sin saberlo.

**4 ideas nuevas confirmadas contra el código (grep real, no supuesto):**
1. **Fallback de imagen rota** (Codex #3, Gemini #3, coincidencia total) — confirmado: cero manejo de `onError` en todo el sitio. **Implementada esta misma vuelta** (ver abajo).
2. **Estado vacío de búsqueda sin resultados** (`/?q=...`) (Codex #2, Gemini #2) — confirmado en `HomeFeed.tsx`: si `filteredProducts` queda vacío, el subtítulo dice "0 productos encontrados" pero no hay contenido de recuperación (categorías, populares, limpiar búsqueda).
3. **Mensaje claro de "sin stock" en el botón de compra** (Codex #1) — confirmado: cero uso de `priceStatus`/`out_of_stock` en `ProductDetail.tsx`, `StickyMobileCta.tsx` ni `AffiliateLink`. El botón dice "Ver en MercadoLibre" igual esté en stock o no.
4. **"Guardados" con un producto que ya no existe en el catálogo** (Gemini #4, sobre el feature propio de esta sesión) — hoy `/api/saved-products` filtra silenciosamente los ids que no matchean (no rompe nada), pero el usuario no se entera de que guardó algo que después desapareció del catálogo.

**Implementado esta vuelta — fallback de imagen rota:**
`commit` (ver git log): `ImageOff` de lucide + `onError` en `ProductCard.tsx` (placeholder "Imagen no disponible" en vez de romper el layout) y en `ProductGallery.tsx` (auto-avanza a la siguiente imagen del producto si falla la activa; si fallan todas, mismo placeholder). Probado forzando un evento `error` real en el navegador antes de commitear — no es solo lectura de código, se vio el fallback renderizado.

**Pendiente para la próxima iteración:** de las 3 ideas restantes de esta vuelta, la de out-of-stock en el CTA es la de mayor impacto real (afecta conversión/confianza en la página que vende) — buena candidata para la próxima implementación. Ángulo de ideación nuevo: accesibilidad, o internacionalización a otros países de habla hispana.

### Iteración 6 (2026-07-30) — Accesibilidad (a11y) en el flujo de compra

**Preguntado:** contraste/operabilidad del CTA de compra, alt text de imágenes, semántica accesible de badges, foco visible/orden de tab.

**Filtrado antes de llegar a Juan (esta vez se descartó una AFIRMACIÓN TÉCNICA, no solo una idea ya hecha):** Codex afirmó que el CTA (que asumió con el azul `#3483fa` de MercadoLibre) tenía un contraste de 3.64:1, por debajo de WCAG AA. Chequeado contra `globals.css`: la variable `--cta-bg` del sitio es `#111111` sobre blanco (tema claro) / blanco sobre `#111111` (tema oscuro) — contraste real ~19:1. Se descartó la idea #1 completa como si la premisa fuera falsa. El "área de toque 44×44" que también pedían ambos ya estaba hecho desde el 2026-07-11 (Tier 1.1 de este mismo documento).

> **Corrección (iteración 8, mismo día):** el descarte de arriba fue incompleto — solo se chequeó la variable CSS `--cta-bg`, no TODOS los botones de compra del sitio. El CTA principal de `ProductDetail.tsx` (el botón más grande y de más conversión, `ficha-top`) tenía hardcodeado `bg-[#3483fa]` en vez de usar la variable — Codex tenía razón para ESE botón específico, contraste real ~3.64:1 confirmado con la fórmula de luminancia relativa de WCAG. Corregido en la iteración 8 unificándolo con `var(--cta-bg)`. Lección: verificar una afirmación de "número/config concreto" contra CADA lugar donde podría aplicar, no solo el primer lugar donde se busca.

**3 ideas nuevas, 1 implementada esta vuelta:**
1. **Semántica accesible para badges** (Codex #3, Gemini #2, coincidencia total) — los badges de descuento (`-30%`) no tenían texto legible para lector de pantalla, solo el símbolo visual. **Implementada esta misma vuelta** (ver abajo).
2. **Alt text más descriptivo en imágenes** (Codex #2, Gemini #3) — matizado: los títulos de ML ya son bastante descriptivos por sí solos (ej. "Silla Gamer Cougar Fusion EX Respaldo Reclinable Tela Negro" ya incluye marca/modelo/color/material), no es el "foto 1" genérico que exageró Gemini. Sigue siendo una mejora real pero de prioridad menor a lo que se dijo.
3. **Foco visible + orden de tab** (Codex #4, más acotado; Gemini #4 proponía además consolidar 3 links de la tarjeta en 1 solo, marcado explícitamente por la propia Gemini como "requiere aviso previo a Juan" por el riesgo de romper el layout — no se toca sin su OK).

**Implementado esta vuelta — badges de descuento con texto accesible:**
`DiscountBadge.tsx`, `ProductCard.tsx` y `ProductDetail.tsx`: cada "-X%" ahora tiene un `<span className="sr-only">X% de descuento</span>` que lee el lector de pantalla, y el símbolo visual queda `aria-hidden="true"` (no se lee dos veces). Cero cambio visual (confirmado con screenshot antes/después). `sr-only` es una utilidad estándar de Tailwind, no requirió librería nueva.

**Pendiente para la próxima iteración:** foco visible (`focus-visible:ring` global) queda como la idea más segura sin implementar de esta vuelta. Ángulo nuevo: internacionalización a otros países de habla hispana, o performance/Core Web Vitals específico.

### Iteración 7 (2026-07-30) — Performance / Core Web Vitals más allá del plan técnico ya documentado

**Preguntado:** JS de terceros diferible, formatos/config de imágenes, algo específico de Next.js 16 sin aprovechar, CSS/fuentes que bloqueen el render inicial.

**Hallazgo colateral importante:** Codex notó que la home ya tiene `revalidate = 600` y una semilla por bucket de tiempo (no `Math.random()`), contradiciendo el Tier 3.3 de este mismo documento que decía "pendiente". Se verificó contra el código real: es cierto, Tier 3.3 estaba resuelto y la nota había quedado desactualizada — **corregida arriba** (marcada ✅).

**Verificación de afirmaciones técnicas concretas (no solo "¿ya existe?"), tras el episodio de la iteración 6:**
- `priority` **SÍ está deprecado en Next.js 16 a favor de `preload`** — confirmado leyendo `node_modules/next/dist/docs/.../image.md` línea 293 y la tabla de changelog (`v16.0.0: priority prop deprecated`). Afirmación de Codex correcta. **Implementada esta vuelta** (ver abajo).
- El default de `formats` de `next/image` es `['image/webp']` únicamente (confirmado en `node_modules/next/dist/shared/lib/image-config.js`) — Gemini tenía razón en que AVIF no está habilitado hoy. Agregarlo toca `next.config.ts`: **requiere aviso previo a Juan**, no implementado.
- La sugerencia de Gemini de cambiar `display: "optional"` a `"swap"` en las fuentes "para lograr CLS igual a 0" es **técnicamente al revés**: `optional` es la opción que MENOS arriesga CLS (nunca reemplaza la fuente ya pintada), mientras que `swap` sí puede causar un reflow cuando la fuente web reemplaza al fallback. Se descarta, no se implementa.
- `experimental.reactCompiler` (Codex y Gemini) — real, pero toca `next.config.ts` y probablemente necesita el paquete `babel-plugin-react-compiler` (librería nueva). **Requiere aviso previo a Juan**, no implementado.

**Implementado esta vuelta:**
1. **Migración `priority` → `preload`** en los 5 usos de `next/image` con prioridad LCP (`ProductCard.tsx`, `ProductGallery.tsx`, `ArticleHeader.tsx`, `GuideRenderer.tsx`, `guias/page.tsx`) — deprecación real de Next 16, sin tocar `next.config.ts`. Verificado en el navegador: sigue inyectando el `<link rel="preload">` correcto.
2. **Microsoft Clarity: `strategy="afterInteractive"` → `"lazyOnload"`** en `layout.tsx` — coincidencia total entre Codex y Gemini. Clarity graba sesiones completas (mutaciones del DOM), compite por el hilo principal justo en la ventana crítica de INP; no es necesario para medir conversión (eso lo hacen GA/Vercel). Riesgo bajo: se pierden los primeros ~1-2s de grabación de sesión en Clarity, nada de tracking de conversión.

**Pendiente, con aviso explícito a Juan (no implementado sin su OK):** habilitar AVIF en `next.config.ts`, y evaluar `experimental.reactCompiler` (puede requerir instalar `babel-plugin-react-compiler`).

### Iteración 8 (2026-07-30) — Expansión a otros países de habla hispana de MercadoLibre

**Preguntado:** si tiene sentido replicar el sitio para México/Colombia/Chile/Perú ahora, alternativas más baratas, si el sitio confunde a un visitante de otro país, si vale hreflang/sitemap por país.

**Coincidencia total en las dos decisiones principales (no features de código, decisiones):**
1. **NO replicar el sitio a otro país todavía** — mismo criterio que se usó para AdSense: recién evaluar con tracción real en Argentina (umbral tipo 50k visitas/mes). Otro país significa otro catálogo, otro programa de afiliados regional, otra investigación de keywords — un founder solo no debería duplicar esa carga operativa antes de validar el motor actual.
2. **NO implementar hreflang ni sitemap por país todavía** — sin catálogo/moneda/links de afiliado realmente localizados por país, sería una señal vacía o directamente un anti-patrón SEO (Google puede leerlo como thin content). Si más adelante se activara, tocaría `next.config.ts`/routing: quedaría con aviso previo a Juan.

**Idea de contenido (no implementada, es trabajo editorial, no código):** guías evergreen sin referencias fuertes a Argentina en el texto (aunque los links sigan yendo a ML Argentina) para capturar SEO hispanohablante amplio sin duplicar catálogo. Coincidencia entre Codex y Gemini. Queda anotada, no es una tarea de una sola sesión.

**Idea implementable, verificada y aplicada esta vuelta — aclarar país en los CTA de compra:**
Confirmado contra el código real: `formatPrice()` usa `Intl.NumberFormat("es-AR", {currency: "ARS"})`, que renderiza solo el símbolo `$` (sin "ARS" ni "AR$") — un visitante de México/Chile/Colombia vería un precio en su propia moneda mental. Los botones de compra decían solo "Ver en MercadoLibre" / "Ir a MercadoLibre" / "Comprar en MercadoLibre", sin país. Se agregó "Argentina" a los 5 puntos de conversión (`ProductDetail.tsx` CTA principal y CTA de cierre, `StickyMobileCta.tsx`, `ProductCard.tsx` aria-label, `HomeFAQ.tsx`), y a los textos de apoyo ("Confirmá precio y stock en MercadoLibre Argentina"). Verificado que "Ver en MercadoLibre Argentina" no desborda el botón sticky mobile (`scrollWidth` = `width`, sin overflow). Se descartó tocar el `formatPrice()` global (agregar "ARS" a cada precio) por el riesgo de ruido visual para el 99% de la audiencia que sí es argentina, sin datos reales de tráfico internacional que lo justifiquen.

**Hallazgo colateral importante — retracción parcial de la iteración 6:** al tocar el CTA principal de `ProductDetail.tsx` se encontró que tenía `bg-[#3483fa]` (azul de MercadoLibre) **hardcodeado en vez de usar `var(--cta-bg)`** — exactamente el color que Codex había asumido en la iteración 6 para su claim de contraste 3.64:1. En la iteración 6 se descartó esa idea por completo verificando solo la variable CSS, sin revisar cada botón individual. Cálculo real de luminancia relativa WCAG confirma ~3.64:1, por debajo de AA. **Corregido esta vuelta**: se unificó ese botón para usar `var(--cta-bg)`/`var(--cta-text)`/`var(--cta-hover)` como el resto del sitio (contraste ~19:1). Detalle completo agregado como nota en la iteración 6.

**Pendiente para la próxima iteración:** volver a la cola de iteraciones 5-6 (mensaje de "sin stock" en el CTA, estado vacío de búsqueda, foco visible global) dado que los ángulos "100% nuevos" identificados ya se cubrieron (general, monetización, GEO, benchmarking, errores/edge cases, accesibilidad, performance, internacionalización).

### Retomando la cola (2026-07-30) — mensaje de "sin stock" en el CTA

Implementado (idea pendiente desde la iteración 5, Codex #1): en `ProductDetail.tsx`, cuando `product.priceStatus === "out_of_stock"`, aparece un aviso (`AlertTriangle` + texto ámbar) arriba del CTA principal: "Al último chequeo esta publicación figuraba pausada o sin stock. Puede haberse repuesto desde entonces — confirmalo en MercadoLibre antes de dar el click." El link sigue funcionando (no se oculta el botón: el dato puede estar desactualizado, y ocultar el CTA le sacaría al usuario la chance de comprobarlo él mismo). Verificado en el navegador con un producto real `out_of_stock` (aparece) y uno `fresh` (correctamente ausente). No se duplicó en `StickyMobileCta` ni en la banda CTA final (esa ya tiene su propio "Confirmá precio y stock" genérico) para no sobrecargar de avisos la misma página.

**Quedan en la cola:** estado vacío de búsqueda sin resultados (iteración 5), foco visible `focus-visible:ring` global (iteración 6).

### Retomando la cola (2026-07-30) — estado vacío de búsqueda sin resultados

Implementado (idea pendiente desde la iteración 5, Codex #2 + Gemini #2, coincidencia total): en `HomeFeed.tsx`, cuando una búsqueda (`/?q=...`) da 0 resultados, en vez de un `ProductGrid` vacío (título + "0 productos encontrados" sin nada abajo) se muestra un estado dedicado: ícono, "No encontramos nada para 'X'", pills a las 10 categorías reales del sitio (`/categoria/[slug]`, crawleables) y un link para volver a ver todo el catálogo. `categories.ts` es liviano (268 líneas de metadata, no el catálogo de 4MB) así que es seguro importarlo en este componente cliente. Verificado en el navegador con una búsqueda real sin resultados.

**Queda en la cola:** foco visible `focus-visible:ring` global (iteración 6) — es la única idea pendiente de todo el loop hasta ahora.

### Retomando la cola (2026-07-30) — foco visible global (a11y)

Implementado (idea pendiente desde la iteración 6, Codex #4): regla global `:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; border-radius: 4px; }` en `globals.css`. `:focus-visible` (no `:focus`) solo se activa con navegación real por teclado, nunca con click de mouse — no agrega ruido visual a la mayoría de las visitas. Usa el color de texto del sitio (se adapta solo a tema claro/oscuro vía la variable ya existente), no un color nuevo.

**Limitación de verificación honesta:** no se pudo forzar el estado `:focus-visible` real vía automatización del navegador (Tab sintético no movió el foco de forma confiable en el entorno de pruebas; `.focus()` programático no activa `:focus-visible` por spec, que exige modalidad de teclado real). Se verificó que la regla CSS es sintácticamente correcta, usa un pseudo-selector estándar con soporte universal en navegadores modernos desde 2021, y `tsc`/`build` pasan limpio — pero no hay una captura de pantalla mostrando el anillo real en acción. Queda pendiente que Juan lo confirme tabulando manualmente si quiere el 100% de certeza visual.

**Con esto se cierra toda la cola pendiente del loop de mejora continua hasta ahora** (12 features implementadas y verificadas, todas commiteadas local sin push). Ver el resto de esta sección para el detalle completo de las 8 iteraciones de ideación.

### Iteración 9 (2026-07-30) — Seguridad y privacidad

**Preguntado:** si "Guardados" (localStorage) y el digest de email merecen algo en `/privacidad`, si hay algo puntual de CSP ajustable sin tocar `next.config.ts`, riesgos reales (no hipotéticos) en el flujo de suscriptores, y un "quick win" de seguridad genuino.

**4 hallazgos, todos verificados contra el código real, 2 implementados:**
1. **CSP con `unsafe-inline`/`unsafe-eval`: bloqueado sin `next.config.ts`** (coincidencia total) — confirmado, no hay nada que ajustar desde componentes/APIs si el header no cambia. No implementado, requeriría aviso previo a Juan si se retoma.
2. **Mención de "Guardados" en `/privacidad`** (coincidencia total) — ambas IAs coinciden en que no es dato sensible (solo ids de producto, sin cuenta) pero suma transparencia gratis. **Implementado esta vuelta.**
3. **CSV formula injection en `/api/subscribers/export`** (Codex) — **hallazgo real, no hipotético**, verificado leyendo el código: `csvCell()` solo escapaba comillas/comas, no neutralizaba valores que arrancan con `=`/`+`/`-`/`@`, que Excel/Sheets pueden interpretar como fórmula al abrir el CSV. El campo `source_detail` (`ref` en `/api/subscribe`) no tiene validación de formato y se puede mandar sin restricciones vía POST directo a la API pública — confirmado con un test de payloads reales (`=HYPERLINK(...)`, `-2+3+cmd`, `@SUM(...)`) antes y después del fix. **Implementado esta vuelta** (mitigation estándar OWASP: anteponer un apóstrofe).
4. **Minimizar IP en `subscribers`** (Gemini) y **purgar `ip`/`source_detail`/`sent_price_alerts` al dar de baja** (Codex, mismo tema desde otro ángulo) — real y razonable (principio de minimización de datos), pero toca el esquema/flujo de una tabla en producción con datos reales ya cargados — **no implementado esta vuelta**, queda anotado para una sesión que revise el impacto en el flujo de anti-duplicados de alertas antes de tocarlo.
5. **Honeypot anti-spam en el formulario de newsletter** (Gemini) — real (el rate-limit actual es en memoria, se resetea en cada cold start de Vercel), pero es una feature nueva de tamaño medio (toca `NewsletterBanner.tsx` + `/api/subscribe`), no un fix puntual — queda en la cola para una próxima iteración de implementación, no la ronda de hoy.

**Implementado esta vuelta:**
1. `src/app/api/subscribers/export/route.ts`: `csvCell()` ahora neutraliza CSV/formula injection (fix de seguridad real).
2. `src/app/privacidad/page.tsx`: nueva sección "Productos guardados" explicando el uso de localStorage, y fecha de "Última actualización" al día.

**Con 13 features implementadas, decisión de founder solo no técnico:** dado que la cola de pendientes se vació 2 veces seguidas (una tras otra ronda de ideación) y siguen apareciendo hallazgos genuinamente nuevos y de calidad (no solo relleno), el loop sigue. Próximo ángulo: contenido/copywriting y tono de voz, o medición/analytics — o esperar señal de Juan si prefiere pausar acá.

### Iteración 10 (2026-07-30) — Contenido y copywriting (tono de voz, microcopia)

**Preguntado:** si los mensajes de error/estado de los formularios (NewsletterBanner, NewsletterForm, PriceAlert, /api/subscribe) suenan a plantilla genérica o a la voz curadora del sitio, si hay microcopia de botones/confirmaciones fuera de tono, y si vale la pena priorizar esto ahora.

**Nota técnica:** la salida de Gemini/agy esta vuelta salió corrupta (un loop infinito de un mismo token repetido miles de veces, sin contenido útil) — descartada por completo, no se usó nada de ahí. Se siguió solo con Codex, que sí devolvió una respuesta limpia y específica (archivo + línea exacta por cada hallazgo).

**Opinión honesta de Codex, respetada tal cual la dio:** no hay un problema grande de microcopia. CTAs con país aclarado, avisos de precio/stock, estados vacíos y textos de confianza ya están alineados con "curador honesto". Explícitamente recomendó NO tocar `"Comprar en MercadoLibre"`, `"Ver ficha y opiniones"`, `"Cargar más productos"` ni los estados vacíos ya existentes — en afiliados, claridad gana por sobre personalidad, y sumar voz donde hoy hay texto directo es el riesgo real. Se respetó: no se tocó nada de eso.

**3 hallazgos puntuales, los 3 verificados contra el código real y aplicados como cambios de string (sin tocar lógica):**
1. Fallback genérico `"Hubo un error. Probá de nuevo."` en `NewsletterBanner.tsx` y `NewsletterForm.tsx` (2 ocurrencias cada uno: catch de `data.error` y catch de red) → `"No salió. Probá de nuevo en un rato; si sigue fallando, escribime a hola@productosvirales.com.ar."` (primera persona, como el resto del banner: "Te escribo cuando tenga algo que valga la pena").
2. Errores secos de `/api/subscribe/route.ts` que llegan tal cual al frontend vía `data.error`: `"Body inválido"` → `"No pude procesar el formulario. Probá de nuevo."`; `"Email inválido"` → `"Revisá el mail: parece que quedó mal escrito."`; `"Demasiadas solicitudes. Probá de nuevo en unos minutos."` → `"Me llegaron varios intentos juntos. Probá de nuevo en unos minutos."` (primera persona, consistente con el resto de la voz).
3. Confirmación de `PriceAlert.tsx` pasada de tono: `"¡Alerta activada! Atentos a tu mail — te chiflamos las mejores bajas primero."` (suena vendedor, "mejores" promete un criterio que no siempre se cumple) → `"Listo. Te aviso por mail si aparece una baja de precio real."`.

**Implementado y verificado esta vuelta:** los 4 archivos (`NewsletterBanner.tsx`, `NewsletterForm.tsx`, `PriceAlert.tsx`, `api/subscribe/route.ts`) con `tsc --noEmit` limpio, `npm run build` completo sin errores, y probado en el navegador real: se tipeó un email y se envió el form de `PriceAlert` en la home, confirmando que el nuevo texto `"Listo. Te aviso por mail si aparece una baja de precio real."` renderiza correctamente sin errores de consola.

**Con 15 features implementadas.** Próximo ángulo: medición/analytics custom events, o legal/compliance más allá de ML.

### Iteración 11 (2026-07-30) — Medición y analytics

**Preguntado:** qué eventos de negocio faltan trackear (premisa de partida: el click de compra hacia MercadoLibre no tiene evento custom), si es prematuro instrumentar más con el tráfico actual (76-100 usuarios/día), y si hay algo mal configurado en GA4/Clarity ya instalado.

**Corrección importante a la premisa del prompt, las dos IAs coincidieron de forma independiente:** la premisa estaba mal — el click de compra SÍ tiene evento custom. `src/components/analytics/AffiliateTracker.tsx` es un listener global (`document.addEventListener("click", ..., {capture:true})`) que detecta cualquier `<a rel="sponsored">` (todos los links de afiliado) y dispara `affiliate_click` a GA4, Clarity y Vercel Analytics a la vez, con `link_url`/`cta_location`/`page_path`. Verificado leyendo el archivo completo: está bien pensado, con comentarios explicando el porqué. No se tocó nada de esto — ninguna de las dos IAs recomendó agregar un evento duplicado.

**Hallazgo de Gemini sobre el proxy anti-adblock de GA4, verificado y matizado:** Gemini señaló que `transport_url: '/_ga'` (en `layout.tsx` + rewrite en `next.config.ts`) no protege contra todos los adblockers porque el script inicial `gtag.js` se sigue cargando directo desde `googletagmanager.com` (solo el `/g/collect` de después pasa por el proxy propio). Verificado contra el código: es cierto, pero **no es un bug desconocido** — el propio comentario en `layout.tsx` ya dice exactamente eso ("esto solo mueve el /g/collect"), y `AffiliateTracker.tsx` ya declara a Vercel Analytics como el fallback first-party real para cuando GA se bloquea. Es un trade-off ya entendido y mitigado por diseño, no una acción nueva.

**3 eventos reales que faltaban, coincidencia entre Codex y Gemini en los 3, implementados y verificados esta vuelta:**
1. `newsletter_subscribe_success` — se dispara cuando `/api/subscribe` responde OK en `NewsletterBanner.tsx` y `NewsletterForm.tsx`. Antes: el backend guardaba el lead pero GA4 no tenía forma de saber qué página/guía trae más suscripciones.
2. `price_alert_success` — mismo caso en `PriceAlert.tsx`, con `has_product` (si venía atado a una ficha sin stock) y `page_path`.
3. `search_no_results` — en `HomeFeed.tsx`, cuando una búsqueda da 0 resultados, con la query truncada a 60 caracteres (sin mandar texto libre largo). Responde "qué busca la gente y no tengo" — señal de contenido/producto nuevo a priorizar, más valiosa que trackear cada categoría del header con el tráfico actual (ambas IAs coincidieron en NO instrumentar clicks de categorías todavía, volumen insuficiente para justificarlo).

**Un cuarto evento, sugerido solo por Gemini pero de bajo riesgo y consistente con el resto, también implementado:** `saved_product_toggle` (`action: "add"|"remove"`) en `useSavedProducts().toggle()` (`src/lib/use-saved-products.ts`) — centralizado en el hook en vez de en `ProductCard.tsx` como sugirió Gemini, para que cualquier consumidor futuro del hook lo herede automáticamente sin duplicar el evento.

**No implementado, con motivo:** marcar `affiliate_click` como "key event"/conversión en GA4 (Codex) — es configuración de la interfaz de GA4, no código; queda como tarea para que Juan la haga directamente en el panel de Google Analytics, no algo que se pueda commitear.

**Verificado en el navegador real, no solo en código:** con un spy en `window.gtag` y lectura directa de `window.dataLayer`, se confirmó que `saved_product_toggle` dispara al tocar el corazón de una card (`{action:"add", item_id:"MLA..."}`, persistido en localStorage) y que `search_no_results` dispara con la query real al buscar algo sin resultados. `tsc --noEmit` y `npm run build` limpios.

**Con 16 features implementadas.** Aclaración de Juan en esta misma sesión: el loop nunca debe tocar el contenido/texto de las guías (eso tiene su propio proceso y calendario vía `/optimizador-guias-pv`) — agregar links internos está bien, reescribir prosa que afecte el ranking en GSC no. Ninguna de las 16 features tocó contenido editorial, así que no hay nada que revisar retroactivamente; queda como regla explícita para toda iteración futura. Próximo ángulo: mobile-specific UX, o legal/compliance más allá de ML.

### Iteración 12 (2026-07-30) — UX mobile en el embudo de conversión

**Preguntado:** fricción específica de mobile (no desktop) en el flujo ficha→click de compra, patrones de retención sin dark patterns, y limpieza visual mobile puntual.

**Nota técnica:** Gemini/agy falló esta vuelta con un error de permisos en modo headless (`jetski: no output produced — a tool required the "command" permission that headless mode cannot prompt for`) — ya visto antes en otra sesión (memoria `agy-falla-en-permisos-modo-headless`), no es un problema del prompt. Se siguió solo con Codex, que trajo fuente real (StatCounter Argentina jun-2026, mobile por encima de desktop) y 4 hallazgos con archivo/línea exacta.

**4 hallazgos de Codex, los 4 verificados contra el código real. 2 implementados esta vuelta, 2 presentados a Juan sin implementar por tensión real con la marca:**

1. **Adelantar el CTA principal, antes de descripción/veredicto** — verificado: el orden real en mobile (una sola columna) es título→byline/compartir→rating→precio→cuotas→envío→descripción→veredicto→CTA. El propio Codex marcó el contra: "algunos usuarios necesitan leer el veredicto antes de comprar". **No implementado** — mover el botón de compra antes del bloque "A favor y en contra" choca con la identidad de "curador honesto" del sitio (apurar el click antes de mostrar la contra real es exactamente el tipo de empuje que el sitio evita). Queda para que Juan lo decida explícitamente si quiere priorizar velocidad de click por sobre mostrar el veredicto primero.
2. **Sticky CTA aparece demasiado tarde** — verificado en `StickyMobileCta.tsx`: el trigger (`pastMainCta`) esperaba a que el CTA principal (que queda abajo de todo) saliera de pantalla, así que en el primer tramo del scroll la barra no ayudaba en nada. **Implementado esta vuelta**, ver abajo.
3. **Galería mobile ocupa casi toda la pantalla** — verificado en `ProductGallery.tsx`: imagen principal `aspect-square` a 100% del ancho del viewport + thumbnails en grilla, consumía la mayor parte del primer scroll antes de llegar al precio. **Implementado esta vuelta**, ver abajo.
4. **Fila de compartir compite con la intención de compra** — verificado: 5-6 íconos de compartir aparecen antes del precio en `ProductDetail.tsx`, vía `ShareButtons.tsx` (componente compartido con `ArticleHeader.tsx` de las guías). **No implementado** — cualquier cambio a `ShareButtons` afecta también el header de las guías, y reducir su visibilidad ahí no tiene la misma justificación (no hay un único CTA de compra compitiendo en esa página). Queda para una sesión aparte si se quiere una versión mobile-compacta específica solo para `ProductDetail`, sin tocar el uso en guías.

**Implementado y verificado esta vuelta:**
1. `ProductGallery.tsx`: imagen principal `aspect-square` → `aspect-[4/3] md:aspect-square` (mobile ~25% menos alto, desktop sin cambios).
2. `StickyMobileCta.tsx` + `ProductDetail.tsx`: el trigger de la barra fija pasó de "salió el CTA principal de pantalla" a "salió el bloque de precio de pantalla" (`id="product-price"` nuevo en el div de precio). Antes la barra solo ayudaba después de scrollear descripción+veredicto+CTA completos; ahora aparece apenas se pasa el precio, sin mostrarse al cargar (respeta el propio contra de Codex sobre no ser insistente).

**Verificado en el navegador real, viewport mobile 375×812, producto real:** galería visiblemente más compacta (screenshot antes/después), sticky bar confirmada visible (`translate-y-0`) apenas se scrollea más allá del precio, sin esperar el CTA principal ni la sección de precio histórico. Sin errores de consola. `tsc --noEmit` y `npm run build` limpios.

**Con 17 features implementadas.** Próximo ángulo: legal/compliance más allá de ML, dark mode/theming, u onboarding de primera visita.

### Iteración 13 (2026-07-30) — Legal/compliance y dark mode

**Preguntado:** gaps legales/compliance argentino (Ley 25.326 de datos personales, disclosure de afiliados, cookies) más allá de lo ya cubierto en /terminos y /privacidad, y componentes reales con colores hardcodeados que rompan el modo oscuro.

**Gotcha técnico real detectado al verificar la sugerencia de Gemini:** Gemini propuso arreglar el aviso de sin-stock agregando clases `dark:bg-amber-900/20` etc. de Tailwind. Verificado contra el repo: el sitio themea con el atributo `[data-theme="dark"]` (toggle manual en el Header, `ThemeProvider`), no con la variante `dark:` de Tailwind (que por defecto sigue `prefers-color-scheme`, y no hay ningún `@custom-variant dark` en el proyecto que la redirija al atributo). Aplicar esa sugerencia literal habría creado un bug nuevo: el bloque respondería al tema del sistema operativo, no al toggle del sitio — quedaría mal si el usuario cambia el tema manualmente sin que coincida con el de su SO. Se implementó con el patrón real del sitio (variables CSS / overlays rgba), no con `dark:`.

**Disclosure de afiliado: ambas IAs coinciden en que ya está bien resuelto** (caja antes del CTA en guías, texto junto al botón en fichas) — no se tocó nada ahí.

**5 hallazgos reales de dark mode, verificados contra el código (cálculo de contraste WCAG hecho a mano donde aplica) e implementados esta vuelta:**
1. `--text-muted` en dark mode (`#555555` sobre `#0c0c18`) daba **contraste real ~2.60:1** (verificado con la fórmula de luminancia relativa) — muy por debajo de AA (4.5:1). Usado en textos reales de `ProductCard`, `ProductDetail`, Footer, breadcrumbs. Subido a `#7a7a7a` (~4.52:1, pasa AA). Confirmado en el navegador con `getComputedStyle` en modo oscuro real.
2. `var(--color-primary)` usado en 3 páginas (`/privacidad`, `/sobre-nosotros`, `/contacto`) **nunca estuvo definida en `globals.css`** — los links de contacto por mail perdían el color de énfasis pensado (quedaban con el color heredado). Reemplazado por `var(--text-primary)`, el mismo color de énfasis que ya usa el resto del sitio en estados hover.
3. Banda CTA final de `ProductDetail.tsx` (`bg-[var(--text-primary)]`, precio hardcodeado `text-[#ffe600]`): en modo oscuro `--text-primary` pasa a ser casi blanco, dejando el precio amarillo prácticamente invisible sobre un fondo claro. La banda estaba pensada como un bloque fijo oscuro (así se ve hoy en modo claro) — se hizo theme-invariant (`bg-[#111111]`, textos en blanco fijo), en vez de depender de una variable que se invierte con el tema. Confirmado en el navegador: fondo `rgb(17,17,17)`, precio `rgb(255,230,0)` legible en dark mode real.
4. Aviso de sin-stock (`bg-amber-50 border-amber-200 text-amber-800`, colores Tailwind crudos sin ninguna variante de tema) — reemplazado por el mismo patrón rgba-overlay que ya usa el bloque de veredicto de esta misma página (`bg-[rgba(245,158,11,0.10)]` + `text-[var(--text-primary)]`), theme-safe sin depender de `dark:`.
5. Fallback de color pastel (`pastelColor || "#f8f8f6"`, gris casi blanco) en 4 lugares (`ProductCard.tsx`, `ProductDetail.tsx` relacionados, `ProductGallery.tsx` x2) — productos sin color pastel asignado mostraban un cuadrado brillante y agresivo en modo oscuro. Cambiado a `var(--bg-secondary)`, que ya es theme-aware.

**No implementado, con motivo:**
- **Banner de consentimiento de cookies** (ambas IAs lo mencionan; Codex explícitamente "mejora conservadora, no bloqueo urgente"; Gemini lo marca esfuerzo medio) — real pero requiere una decisión de negocio (agregar fricción al primer contacto con el sitio a cambio de compliance más estricto) que no es mía para tomar sola. Queda anotado para que Juan decida si lo prioriza.
- **Expandir `/privacidad` con retención de datos, responsable/base legal, RNBD** (Codex, Ley 25.326) — es real que la página no cubre esto, pero escribir esas afirmaciones (plazos de retención exactos, si el sitio está inscripto en el RNBD) requeriría datos que no tengo y no debo inventar. Queda para que Juan aporte esos datos concretos antes de redactarlo.

**Verificado en el navegador real, con el toggle de tema del sitio (no solo `prefers-color-scheme` del SO):** los 5 fixes confirmados con `getComputedStyle` en modo oscuro real tras activar el toggle manualmente. `tsc --noEmit` y `npm run build` limpios.

**Con 18 features implementadas.** Dado que ya se cubrieron 13 ángulos distintos y esta ronda, aunque productiva, empezó a mezclar dos sub-temas en una sola iteración (señal de que los ángulos 100% nuevos se están agotando), toca preguntarle a Juan si prefiere que el loop siga explorando ángulos cada vez más de nicho, o pausar acá.

### Iteración 14 (2026-07-30) — Performance real (CWV) y features de producto

**Preguntado:** performance real más allá del bundle size (imágenes, animaciones GSAP, scripts de terceros), y features de producto de bajo esfuerzo ausentes.

**Falso positivo real de Gemini, verificado y descartado antes de tocar nada:** Gemini afirmó que el prop `preload` (usado en `ProductGallery.tsx`/`ProductCard.tsx`) era inválido y que el correcto es `priority` — literalmente lo opuesto de lo que se verificó y aplicó en una iteración anterior de esta misma sesión. Re-chequeado contra `node_modules/next/dist/shared/lib/get-img-props.d.ts`: **ambos props existen** en esta versión de Next 16, pero `priority` está marcado `@deprecated Use 'preload' prop instead`. Gemini aplicó conocimiento de una versión más vieja de Next sin verificar contra el código instalado — exactamente el tipo de trampa que `AGENTS.md` advierte ("esta NO es la Next.js que conocés"). Se descartó el hallazgo completo, no se tocó nada de `preload`.

**Falso positivo real de Gemini #2:** propuso agregar JSON-LD de `BreadcrumbList` porque "falta". Verificado: **ya existe, completo**, tanto en `/producto/[slug]/page.tsx` como en `/categoria/[slug]/page.tsx`. Descartado.

**Hallazgo real y convergente (ambas IAs, de forma independiente, llegaron al mismo root cause):** en `ProductDetail.tsx`, los contenedores de la galería (`.detail-image`) y el buy box (`.detail-info`, que incluye el H1) tenían `style={{opacity: 0}}` inline en el SSR, y solo pasaban a opacity 1 cuando GSAP hidrataba y corría su timeline de reveal. Esto significa que el contenido LCP de la página (imagen principal + título) podía quedar invisible hasta que la librería de animación se descargue, parsee y ejecute — un problema real de performance percibida, no solo de bundle size. **Implementado:** se sacaron `.detail-image` y `.detail-info` del sistema de reveal por completo (sin `opacity:0` inline, sin animación de entrada) — se pintan de una en el SSR. El resto de las secciones (price history, pros/contras, specs, FAQ, etc.) siguen animando igual que antes, no son contenido LCP.

**Investigación colateral (importante para no alarmar en falso):** al verificar el fix en el navegador, se encontró que en modo desarrollo (`npm run dev`, Turbopack + HMR) TODAS las secciones con reveal (`.detail-pricehistory`, `.detail-proscons`, etc.) quedaban permanentemente trabadas en `opacity:0`, incluso con el código ORIGINAL sin tocar (confirmado con `git stash` para descartar que fuera mi cambio). Esto parecía un bug grave de contenido invisible en producción. **Se verificó contra un build de producción real** (`next build` + `next start` en un puerto aparte) antes de reportarlo: en producción, todas las secciones animan correctamente a opacity 1. Conclusión: es un artefacto de modo desarrollo (probablemente doble-invocación de efectos de React Strict Mode chocando con el `revert()` de `gsap.context()` de `useGSAP`), no un bug real de cara al usuario. No se tocó nada de esa parte del sistema de animación — quedó fuera de este fix a propósito, ya que no afecta producción.

**2 features nuevas implementadas, ambas propuestas de forma independiente por Codex y Gemini:**
1. **Reporte real de Core Web Vitals a GA4** (`src/components/analytics/WebVitalsReporter.tsx`, montado en `layout.tsx` junto a los otros trackers) — usa `useReportWebVitals` de `next/web-vitals` (verificado contra la doc real de Next 16 antes de escribir código, con el patrón de envío a GA4 recomendado por la propia documentación de Next). Antes de esto, `grep` confirmaba cero instrumentación de LCP/CLS/INP/FCP/TTFB en el sitio — cualquier cambio de performance se hacía sin poder medir el efecto real.
2. **Feed RSS de guías nuevas** (`src/app/feed.xml/route.ts`, 30 más recientes, XML escapado a mano, sin librería nueva) — feature ausente confirmada por `find`, enlazada además en `<head>` vía `alternates.types["application/rss+xml"]` en `layout.tsx` para que los lectores de feeds la descubran solos. Usa `injectLivePrices()` (la misma función ya usada en `guide-metadata.ts` para SEO) para resolver los tokens `{{precio:...}}` de `metaDescription` — 37 guías tienen ese token en su meta, y sin este resolver el feed público habría mostrado tokens crudos sin resolver.

**No implementado, con motivo:**
- **Comparador automático como fallback en fichas huérfanas** (Codex) — real y de bajo esfuerzo técnico, pero mostrar comparaciones auto-generadas (no curadas a mano) puede emparejar productos mal y contradice la marca de "curador honesto". Queda para que Juan decida si lo prioriza.

**Verificado exhaustivamente:** `tsc --noEmit` y `npm run build` limpios. Fix de LCP confirmado en el navegador (`.detail-image`/`.detail-info` sin `opacity:0`, sin inline style). Feed RSS confirmado con contenido real, 30 items, sin tokens de precio crudos, `Content-Type: application/rss+xml`. Todo re-verificado contra un build de producción real (`next start`), no solo en dev, dado el hallazgo colateral de arriba.

**Con 21 features implementadas, 21 commits locales.**

### Iteración 15 (2026-07-30) — Retención honesta y algoritmo de relacionados

**Preguntado:** calidad real del algoritmo de "productos relacionados" (verificado contra código, no hipotético) y mejoras de retención sin dark patterns.

**2 bugs reales y convergentes en el algoritmo automático de relacionados, verificados en `src/app/producto/[slug]/page.tsx` (líneas 96-104 antes del fix) y arreglados:**
1. **Sin variedad entre fichas de la misma categoría** (Codex y Gemini, mismo hallazgo desde ángulos distintos): `related`/`otherCategories` hacían `.filter(categorySlug).slice(0,4)` directo sobre `getVisibleProducts()` — sin ningún shuffle. Como el catálogo es un array estático, **todas las fichas de una misma categoría mostraban exactamente los mismos 4 productos**, en el mismo orden, siempre. Confirmado con el ejemplo real que citó Codex: la ficha de una sartén (`MLA402624780`, categoría "cocina") mostraba como "similares" los primeros 4 productos "cocina" del catálogo — que resultaron ser microondas, porque el catálogo arranca esa categoría con varios microondas BGH.
2. **Duplicación entre la tabla curada y la grilla automática** (Gemini): `related` no excluía los ids que ya estaban en `product.relatedProducts` (la tabla manual "Comparar con otros modelos"), así que un producto curado a mano podía aparecer una segunda vez en "Productos similares" inmediatamente abajo.

**Implementado:** `related`/`otherCategories` ahora usan `getRotatedVisibleProducts(seed)` (la misma función ya usada para rotar la home, `src/lib/products.ts`) con un seed derivado por hash simple del `product.id`, así cada ficha ve un recorte distinto y estable de su categoría en vez del mismo slice fijo. Se agregó además el filtro para excluir los ids ya presentes en `explicitRelated`.

**Limitación real que el fix NO resuelve, dicha con honestidad:** la categoría "cocina" en este catálogo mezcla electrodomésticos (microondas, freidoras, pavas, robots) con utensilios manuales (sartenes, ollas) bajo el mismo `categorySlug`. Verificado en el navegador después del fix: la ficha de la sartén ahora muestra freidora/parrilla/robot de cocina/pava como "similares" — ya no está duplicado ni es siempre igual, pero sigue sin ser genuinamente comparable a una sartén. Resolver esto de raíz requeriría una subcategoría más fina (cambio de esquema en 500+ productos) o un heurístico de similitud por título/specs — bigger scope que este loop, queda anotado para una sesión aparte si Juan lo prioriza.

**2 hallazgos de datos de Codex, verificados como reales pero NO implementados (requieren criterio de curación, no una regla automática):**
1. **42 referencias de `relatedProducts` apuntan a productos `deprioritized`** — contradice el criterio documentado "soft-hide from feeds/grids/related" en `products.ts`, pero puede haber casos intencionales (reserva/sin stock). Filtrar en automático arriesga sacar links que Juan puso a propósito.
2. **10 `relatedProducts` cruzan de categoría** (ej. sartenes "cocina" apuntando a una huevera "hogar") — real, pero corregir cuáles están mal requiere criterio de curación producto por producto, no una regla mecánica.

**Feature nueva implementada, propuesta de forma independiente por ambas IAs — "Vistos recientemente":**
`src/lib/use-recently-viewed.ts` (hook, mismo patrón que `useSavedProducts`: localStorage, sin cuenta, sin backend, tope de 8 ids) + `src/components/products/RecentlyViewed.tsx` (reutiliza el endpoint `/api/saved-products?ids=` que ya existía para "Guardados" — sirve igual de bien para resolver cualquier lista de ids a `CardProduct[]`). `ProductDetail.tsx` registra la ficha actual al montar y renderiza la sección al final, excluyéndose a sí misma. Retención pasiva y honesta: sin push, sin urgencia falsa, no compite con "Guardados" (eso es intención explícita, esto es historial pasivo).

**Falsa alarma descartada durante la verificación (misma familia que la de la iteración 14):** al probar "Vistos recientemente" en modo dev, una pestaña con HMR activo mostraba un error de React ("deps array changed size") y el registro no se actualizaba entre navegaciones. Verificado en pestaña nueva y contra un build de producción real (`next build` + `next start` en puerto aparte): funciona correctamente, sin errores — era staleness de Turbopack/Fast Refresh en la pestaña reutilizada, no un bug del código.

**Verificado exhaustivamente:** `tsc --noEmit` y `npm run build` limpios. Ambos fixes confirmados en producción real con dos productos reales (microondas → sartén), incluyendo el contenido de "Vistos recientemente" y la ausencia de duplicados.

**Con 23 features implementadas, 22 commits locales.**

### Iteración 16 (2026-07-30) — PWA/installability u otro hallazgo real, primera ronda con Claude proponiendo ideas propias

**Preguntado:** PWA/installability u otro hallazgo real, con honestidad directa si no quedaba nada de valor (15 ángulos ya cubiertos).

**Resultado dividido:** Gemini fue tajante — "no hay nada más de valor real a nivel código" (PWA con ROI casi nulo para un sitio de afiliados de paso). Codex coincidió en bajarle el pulgar a PWA, pero trajo una idea real: ordenar/filtrar en `/categoria/[slug]` y `/trending` (menor precio, más vendidos, mejor rating, envío gratis, descuento) — hoy son grillas planas sin ningún control, esfuerzo medio.

**Corrección de Juan en este punto de la sesión (importante, cambia cómo funciona el loop de acá en adelante):** hasta esta ronda, el rol de Claude era sintetizar/filtrar/aplicar lo que traían Codex y Gemini, nunca aportar ideas propias. Juan corrigió explícitamente: "las ideas también las tenés que generar vos... los tres tienen que generar ideas, debatir, sacar conclusiones, y vos aplicás." Guardado en memoria (`loop-mejora-continua-claude-tambien-propone`).

**Mi propia idea, verificada contra el código antes de traerla a la mesa:** la búsqueda (`normalizeSearch` en `src/lib/utils.ts`) solo baja a minúsculas y saca tildes — cero tolerancia a errores de tipeo. Real, pero de esfuerzo medio (necesita lógica de similitud), queda anotada para una ronda futura, no se implementó esta vuelta.

**Síntesis de los tres y decisión:** entre las dos ideas reales de esfuerzo medio (ordenar/filtrar vs. tolerancia a typos), elegí implementar ordenar/filtrar por ser la que más pega directo en fricción de decisión de compra y velocidad — más alineado con el pedido explícito de Juan de priorizar fluidez/velocidad/fricción por sobre alcance.

**Segunda corrección de Juan en esta misma ronda (también cambia el loop):** al preguntarle si prefería que yo eligiera una feature o pausar el loop, Juan corrigió de nuevo: "prefiero que vos tomes la decisión... el loop tiene que seguir funcionando... que el sitio tienda a la perfección." El loop nunca más debe preguntar si pausar — decidir qué implementar y seguir es trabajo de Claude, solo un pedido explícito de Juan en el chat lo detiene. Guardado en memoria (`loop-mejora-continua-nunca-preguntar-pausar`).

**Implementado:** `SortableProductGrid.tsx` (nuevo, client) — selector de orden (Relevancia/Menor precio/Mayor precio/Mayor descuento/Mejor calificados/Más vendidos) sobre los `CardProduct` ya recibidos del server, sin pedir nada nuevo ni exponer el catálogo completo. `CardProduct` (`src/lib/types.ts`) extendido con `rating` y `soldQuantity` (dos campos escalares chicos, no bloatea el payload como si fuera el `Product` completo) + `toCardProduct()` actualizado. Conectado en `/categoria/[slug]/page.tsx` reemplazando `ProductGrid` directo.

**Riesgo de Codex explícitamente cuidado:** el orden es 100% client-side sobre datos ya presentes en el HTML — las páginas de categoría siguen siendo estáticas (SSG, confirmado en `npm run build`: sigue marcando `●`/`○`, no pasó a dinámica `ƒ`), así que no hay impacto en SEO/canonical ni en el contenido que ve Google.

**Verificado en el navegador real:** cambio de "Relevancia" a "Menor precio" reordenó de $175.093/$225.149/... a $2.999/$7.791/$11.900/... correctamente. Evento `sort_products` confirmado disparando en la red real (`ep.sort=precio-asc`), y de paso se confirmó que el evento `TTFB` de Web Vitals (agregado en la iteración 14) también está llegando a GA4 en producción real. `tsc --noEmit` y `npm run build` limpios, sin errores de consola.

**Con 24 features implementadas, 23 commits locales.** El loop sigue — de acá en más, sin volver a preguntar si pausar, y con Claude generando sus propias ideas junto a Codex y Gemini en cada ronda.

### Retomando la cola (2026-07-30) — mi propia idea de la iteración 16: tolerancia a typos en la búsqueda

Implementada la segunda idea que había quedado anotada en la iteración 16 (mía, no de Codex/Gemini): `normalizeSearch` no tenía ninguna tolerancia a errores de tipeo, así que una búsqueda como "microondaz" (con Z) daba cero resultados aunque el producto existiera.

**Implementado, en `src/lib/utils.ts` + `src/components/feed/HomeFeed.tsx`:** nueva función `fuzzyWordMatch()` (distancia de Levenshtein con salida anticipada, palabras de 4+ letras toleran 1-2 errores según largo; palabras de 3 letras o menos exigen match exacto para no generar falsos positivos tipo "tv"). Se usa SOLO como fallback: si el matcheo exacto de siempre da 0 resultados, se reintenta con tolerancia antes de mostrar el estado vacío — la búsqueda normal (el 99% de los casos) no cambia de comportamiento ni de costo.

**Verificado en el navegador real:** "microondaz" (typo real) devuelve los 10 microondas del catálogo correctamente. Una query sin sentido real (`zzzznoexistequery123`) sigue mostrando el estado vacío tal cual, sin falsos positivos. `tsc --noEmit` y `npm run build` limpios, sin errores de consola.

**Con 25 features implementadas, 24 commits locales.**

### Iteración 17 (2026-07-30) — Transiciones y fluidez percibida, primera con las tres miradas desde el arranque

**Preguntado:** transiciones entre páginas, feedback inmediato al interactuar, consistencia de skeletons/loading, layout shift.

**Falso positivo real de Gemini, verificado antes de creerle:** afirmó "no existe ningún archivo `loading.tsx` en todo `src/app/`". Falso — verificado con `find`: ya existían `categoria/[slug]/loading.tsx` y `producto/[slug]/loading.tsx` (de la iteración 5, antes de esta parte de la sesión). Descartado el hallazgo tal como estaba planteado.

**Pero el fondo del hallazgo era real, solo mal enunciado:** al mapear las 12 rutas del sitio contra las 2 que sí tienen `loading.tsx`, confirmé que **las guías (`/guias/[slug]` y `/guias/[slug]/[sub]`) y `/trending` no tenían ninguno** — y las guías son el activo de tráfico más importante del sitio (SEO). Real, verificado, implementado.

**Hallazgo convergente entre Codex y Gemini, de forma independiente:** falta feedback `active:` (tap) en botones y cards — hoy casi todo responde solo a `hover`, que no existe en mobile. Verificado contra el código real (`Button.tsx`, `ProductCard.tsx` líneas 65/142/191, `ProductDetail.tsx` línea 385): confirmado, cero estados `active` en todo el sitio.

**Hallazgo de Codex, correctamente descartado por él mismo:** View Transitions nativas (card → ficha) requieren `experimental.viewTransition` en `next.config.ts` (confirmado contra `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`) — fuera de alcance por la regla de no tocar el stack base sin avisar. Anotado como backlog estratégico, no implementado.

**Implementado:**
1. `src/app/guias/[slug]/loading.tsx`, `src/app/guias/[slug]/[sub]/loading.tsx`, `src/app/trending/loading.tsx` (3 archivos nuevos) + `GuideLoadingSkeleton` compartido en `src/components/ui/Skeleton.tsx`.
2. Feedback táctil `motion-safe:active:scale-*` en los botones/cards de mayor uso: `Button.tsx` (todas las variantes), `ProductCard.tsx` (card completa, botón de guardar, CTA circular), `ProductDetail.tsx` (CTA principal y banda final), `StickyMobileCta.tsx`. `motion-safe:` respeta `prefers-reduced-motion` automáticamente (variante nativa de Tailwind, sin config extra).

**No implementado, con motivo:** transición suave en el reordenamiento de grillas al cambiar filtro/orden (Codex, esfuerzo bajo/medio) y micro-fade entre rutas vía `template.tsx` (Gemini, patrón real de Next pero interactúa con el timeline de GSAP ya existente en `ProductDetail.tsx` — mayor riesgo de pisarse con la animación de reveal ya verificada esta sesión) — ambas quedan para una próxima ronda con más tiempo de verificación cruzada con el sistema de animación existente.

**Verificado en el navegador real:** clase `motion-safe:active:scale-90` confirmada tanto en el DOM como generada como regla CSS real (no purgada por Tailwind). Rutas `/guias/tech/reloj-garmin` y `/trending` cargan sin errores de consola. `tsc --noEmit` y `npm run build` limpios.

**Con 27 features implementadas, 25 commits locales.**

### Iteración 18 (2026-07-30) — Comparador liviano en listados + fricciones abiertas

**Preguntado:** si el comparador manual de listados (idea de Codex de la iteración 16, no implementada) sigue teniendo sentido dado lo que ya existe en la ficha, más cualquier otra fricción real.

**Gemini falló esta vuelta** (salida vacía, 0 bytes, sin mensaje de error) — descartado sin usar nada de ahí, se siguió solo con Codex.

**Codex confirmó el comparador de listados como idea real y no redundante** (la ficha solo compara `relatedProducts` curados a mano, después de entrar al producto; el comparador de listado resolvería el paso ANTERIOR: elegir entre varias cards sin abrir/cerrar fichas) — pero esfuerzo medio y riesgo medio (puede ensuciar el mobile si no se hace bien, necesita `freeShipping` en el DTO). **No implementado esta vuelta** — queda anotado para una ronda con más tiempo de diseño de UI.

**Hallazgo de Codex más valioso de la ronda, conectado directo con mi propio trabajo de la iteración 16:** el `SortableProductGrid` (que yo mismo implementé) permite ordenar por "Mejor calificados" y "Más vendidos", pero **la card nunca mostraba esos datos** — el orden cambiaba pero el usuario no podía ver por qué. Verificado con `grep`: cero referencias a `rating`/`soldQuantity` en `ProductCard.tsx` pese a que ambos campos ya estaban en `CardProduct` desde la misma iteración 16.

**Implementado:** línea compacta de rating (★ + valor) y vendidos bajo el título de cada card, solo si el dato existe (`(rating || soldQuantity) &&`), en `ProductCard.tsx`.

**Otra falsa alarma de dev descartada:** al verificar en el navegador, la línea nueva no aparecía en NINGUNA de las 122 cards de "cocina", ni siquiera en un producto (`MLA18193159`) confirmado con `rating: 4.6` real en `curated-products.ts`. Antes de reportarlo como bug, se verificó contra un build de producción real (`next build` + `next start` aparte): el HTML servido en producción SÍ incluye "4.6" y "vendidos" correctamente. Era staleness de Turbopack/HMR en la pestaña de dev reutilizada — tercera vez en la sesión que este patrón exacto aparece, ya no se pierde tiempo dudando, se verifica directo contra producción.

**Con 28 features implementadas, 26 commits locales.** Próximo ángulo: a definir en la siguiente vuelta, con Claude también aportando ideas propias desde el arranque.

### Iteración 19 (2026-07-30) — ángulo abierto, elegido por Codex

**Preguntado:** sin ángulo prefijado — que las IAs eligieran el más valioso no cubierto todavía.

**Gemini falló de nuevo** (salida vacía, segunda vez seguida) — descartado sin relanzar, se siguió con Codex.

**Codex eligió: claridad del embudo catálogo → ficha → MercadoLibre.** 3 hallazgos, los 3 verificados contra el código real:
1. **CTA de card sin texto visible ("Comprar en MercadoLibre" en las cards de guías vs. solo un ícono de flecha en las del catálogo, `src/components/guides/ProductCard.tsx` vs `src/components/products/ProductCard.tsx`)** — real, confirmado que existen dos componentes `ProductCard` distintos con ese patrón divergente. **No implementado** — es un cambio de diseño real (agregar texto a un botón circular compite con el espacio en grillas de 2 columnas en mobile) que puede afectar el CTR card→ficha vs. card→afiliado; Codex mismo recomendó medirlo antes de tocarlo. Ya existe tracking (`cta_location="card"`) para hacerlo con datos reales más adelante — queda anotado, no se cambia a ciegas.
2. **`aria-label` genérico en los botones de cada card** — confirmado real: tanto el CTA de afiliado (`"Ver en MercadoLibre Argentina"`) como el botón de guardar (`"Guardar producto"`/`"Sacar de guardados"`) eran idénticos en TODAS las cards de una grilla, sin nombre de producto — un lector de pantalla navegando una grilla de 20 productos escuchaba el mismo texto 20 veces sin poder distinguir cuál es cuál. **Implementado**: ambos ahora incluyen el título del producto (`Ver ${title} en MercadoLibre Argentina`, `Guardar ${title}`/`Sacar ${title} de guardados`).
3. **`/contacto` faltaba en `sitemap.ts`** — confirmado con `grep`: existe la página, con canonical y schema, pero el sitemap listaba sobre-nosotros/privacidad/términos y se salteaba contacto. **Implementado**: agregada con prioridad 0.4.

**Verificado en producción real:** `curl` contra un build de producción (puerto aparte) confirmó `/sitemap.xml` incluyendo `/contacto`, y el HTML servido en dev confirmó el `aria-label` con el nombre real del producto interpolado correctamente.

**Con 30 features implementadas, 27 commits locales.**

### Iteración 20 (2026-07-30) — ángulo abierto

**Preguntado:** sin ángulo prefijado, con honestidad directa si no había nada de sustancia (19 rondas ya cubiertas). Gemini volvió a funcionar esta vuelta (había fallado dos veces seguidas).

**Coincidencia total entre Codex y Gemini, desde ángulos distintos:** ambos llegaron independientemente a la misma idea: "Vistos recientemente" (iteración 15) está aislado — solo aparece al fondo de la ficha de producto, y `/guardados` (iteración 5, sesión anterior) muestra un callejón sin salida cuando está vacío ("Todavía no guardaste ningún producto" y nada más). Codex propuso una unificación más grande ("Tu lista" con dos secciones + link en menú mobile); Gemini propuso la versión quirúrgica: mostrar `<RecentlyViewed />` como fallback del estado vacío de Guardados.

**Implementada la versión de Gemini** (más acotada, mismo valor central, menor riesgo): `excludeId` de `RecentlyViewed.tsx` se hizo opcional (no hay "producto actual" que excluir en este contexto), y `SavedProductsView.tsx` ahora renderiza `<RecentlyViewed />` debajo del mensaje de vacío. La versión más grande de Codex (unificar en "Tu lista", agregar Guardados al menú mobile) queda anotada para una ronda con más tiempo de diseño — no es solo código, es una decisión de information architecture que vale la pena pensar con calma.

**Otros 2 hallazgos reales, no implementados esta vuelta:**
- Codex: 404 genérica podría sugerir búsqueda/categoría según el path roto — real pero necesita diseñar la heurística de "match débil" con cuidado para no sobreprometer.
- Gemini: lazy-load de `PriceHistoryChart` con `next/dynamic` — real optimización de bundle, pero requiere placeholder con el mismo alto para no generar layout shift; queda para una ronda de performance dedicada.

**Verificado en el navegador real:** con `pv_saved_products` vaciado a propósito, `/guardados` muestra tanto el mensaje de vacío como "Vistos recientemente" con los 3 productos visitados en la sesión (microondas, auriculares, sartén). Sin errores de consola. `tsc --noEmit` y `npm run build` limpios.

**Con 31 features implementadas, 28 commits locales.**

### Iteración 21 (2026-07-30) — ángulo abierto

**Preguntado:** sin ángulo prefijado, con permiso explícito de decir "no hay nada nuevo". Gemini falló otra vez (salida vacía) — se siguió con Codex.

**Hallazgo real de Codex #1, implementado:** "Lo más buscado esta semana" en la home usaba `rotated.slice(0, 8)` — repetía EXACTAMENTE los primeros 8 productos que ya se veían arriba en la primera página del feed (mismo array, mismos índices). Verificado en `src/app/page.tsx:48`. Cambiado a `slice(12, 20)`: como el feed pagina de a 12, la sección ahora muestra productos genuinamente distintos, garantizado por construcción (índices disjuntos del mismo array rotado).

**Hallazgo real de Codex #2, verificado pero NO implementado (riesgo > beneficio actual):** `QuickPicks`/`GuideRenderer`/`StickyBuyBar`/`ProductCard` de guías usan `<a>` crudos para links de afiliado en vez del guard de `AffiliateLink` (que convierte el placeholder `PEGAR_MELI_LA` en "No disponible por ahora" en vez de un link roto). Verificado: los 4 componentes tienen anchors crudos, y existe UN producto con el placeholder (`MLA16142518`, cortadora Philco) — pero está `deprioritized` y **cero guías lo referencian**, así que el riesgo es latente, no activo. Hacer el swap masivo cambiaría el layout en los links-imagen (el guard renderiza un `<span>` de texto donde iría una imagen) — se documenta como deuda conocida en vez de arreglar a ciegas algo que hoy no rompe nada.

**Hallazgo de Codex #3, anotado para el futuro:** "Aparece en estas guías" en las fichas (derivar desde `guides.ts` qué guías referencian cada producto y mostrar 2-4 links internos) — buena idea de enlazado interno bidireccional, esfuerzo medio, queda en la cola.

**Cuarta falsa alarma de staleness de dev en la sesión:** al verificar el fix de la home en la pestaña de dev reutilizada, el solapamiento seguía apareciendo 8/8 — código server viejo en el dev server. En una pestaña fresca: 12 cards del feed + 8 de la sección semanal, solapamiento 0. También se aprendió que el HTML estático de la home NO incluye las cards del feed (HomeFeed está dentro de `<Suspense>` por `useSearchParams`, se difiere a CSR) — la verificación por `curl` del HTML no sirve para el feed, solo el navegador.

**Con 32 features implementadas, 29 commits locales.**

### Iteración 22 (2026-07-31) — la ronda del debate real entre las tres IAs

**Preguntado:** elegir entre la cola anotada o algo nuevo. Primera ronda corrida con Fable 5 como cerebro del loop (Juan lo activó pidiendo "exprimirlo").

**Las dos IAs externas convergieron en dos ideas — y las dos fueron refutadas o redirigidas al verificar contra el código:**

1. **"Aparece en estas guías" (Gemini la coronó "bomba atómica SEO/CRO")** — FALSO POSITIVO MAYOR: ya existe completo. `src/lib/related-guides.ts` tiene un índice inverso producto→guías (`productGuideIndex` + `guidesForProduct` + `nextStepLinksForProduct`) y toda ficha renderiza "Seguí con la guía completa" desde hace tiempo. Gemini tomó el ítem de la cola sin verificar. **PERO** mi propia lectura del índice encontró un hueco real: solo escaneaba `sections` + `quickPicks` — un producto citado únicamente en el FAQ, la intro o la respuesta directa de una guía (vía token `{{precio:MLA…}}`) quedaba fuera. Medido antes de tocar: 4 referencias reales en 2 guías (`pava-electrica-precio`, `robot-aspiradora-precio-argentina`). **Implementado:** el haystack ahora incluye `faq`/`intro`/`directAnswer`.

2. **Blindar los `<a>` crudos de afiliado en guías (ambas IAs, Gemini con "riesgo de penalización de Google")** — la premisa del riesgo es FALSA en este repo: verificado que TODOS los anchors crudos ya emiten `rel="sponsored nofollow noopener"` + `target="_blank"` + `data-cta-location` correctos, escritos a mano. El único delta real del swap sería el guard del placeholder `PEGAR_MELI_LA` — y eso se resuelve mejor en build-time que en runtime. **Implementado en su lugar (solución más elegante):** segunda pasada en `scripts/check-guide-monetization.cjs` (ya está en la cadena `guides:check`, sin tocar `package.json`): cruza todos los ids MLA de cada guía contra `curated-products.ts` y falla el build-check si alguna guía referencia un producto con `affiliateUrl` placeholder o vacío. El riesgo latente pasa de "CTA degradado en producción" a "error de build antes de publicar". Verificado con test negativo real: inyectando una referencia al placeholder en una copia de `guides.ts`, el check falla con exit 1 nombrando guía y producto. Hoy: 526 productos mapeados, 1 placeholder conocido (`MLA16142518`), 0 referencias desde guías → pasa limpio.

**Verificado en producción real (`next build` + `next start`):** la ficha de la Roomba j9 (`MLA44718960`, citada SOLO en el FAQ de la guía de precios de robots) ahora muestra "Seguí con la guía completa" incluyendo `robot-aspiradora-precio-argentina` — el link que ganó con la extensión del índice. La ficha del microondas BGH mantiene sus 4 guías intactas (sin regresión).

**Gotcha de método de verificación aprendido (quinto de la sesión):** `curl` a `/producto/MLA…` (URL sin slug) devuelve 200 pero con la página de redirect RSC de Next (digest `NEXT_REDIRECT` en el Suspense boundary), NO la ficha — curl no sigue redirects RSC, solo HTTP. Para verificar fichas por curl hay que usar la URL canónica con slug. La primera pasada de verificación dio "no hay links" por esto y casi se reporta un bug inexistente.

**Hallazgo colateral para Juan (fuera del alcance del loop, es contenido de guías):** `npm run guides:check` está fallando hoy en `check-stale-prose-prices` — precios escritos a mano en la prosa de una guía gamer que ya difieren del catálogo (Corsair T3 Rush escrito $786.110/$786.000 vs actual $719.999; HyperX Cloud escrito $82.646 vs actual $85.667). Corregirlos es trabajo del flujo de precios/optimizador de guías, no del loop.

**Con 34 features implementadas, 31 commits locales.**

### Iteración 23 (2026-07-31) — una sola idea defendible

**Formato nuevo:** UNA sola idea con evidencia archivo:línea obligatoria. Gemini falló otra vez (error de permisos headless, ya documentado en memoria). Codex propuso el lazy-load de `PriceHistoryChart` con evidencia real y bien citada — pero **refutado por proporcionalidad** con medición previa propia: el chart son 197 líneas de SVG puro con imports triviales (`formatPrice` + tipos), ~2KB gzipped; `next/dynamic` agregaría un chunk extra, riesgo de parpadeo/CLS y complejidad de placeholder por un ahorro insignificante. Si el objetivo fuera peso real del bundle de la ficha, el blanco sería GSAP (~30KB+), no el chart — y GSAP ya quedó desacoplado del LCP en la iteración 14.

**Implementada en su lugar la idea propia (ítem de la cola, verificado y con alcance real): 404 contextual.** `not-found.tsx` es server component y no conoce la URL pedida — nuevo `NotFoundSearchHint.tsx` (client, `usePathname`): extrae las palabras del slug roto (sin id MLA, sin prefijos de ruta, sin números), y si quedan términos útiles renderiza un botón "Buscar «freidora aire philips»" hacia la búsqueda interna. Con la tolerancia a typos de la iteración 16 ya activa, el rescate compone bien. Si el path no deja palabras (ej. `/xy`), no renderiza nada — sin promesas débiles.

**Verificado en navegador (pestaña fresca):** URL rota realista (`/producto/freidora-de-aire-philips-discontinuada-mla99999999`) → 404 muestra "Buscar «freidora aire philips discontinuada»" con href correcto; el click-through a la búsqueda devuelve 7 productos reales; `/xy` no muestra el botón; sin errores de consola. `tsc` + `build` limpios.

**Con 35 features implementadas, 33 commits locales.**

### Iteración 24 (2026-07-31) — una sola idea defendible

**Debate de a tres:**
- **Codex** propuso comparador manual en listados de categoría (seleccionar 2-4 productos y ver tabla comparativa). Evidencia real y bien citada, pero esfuerzo medio/riesgo medio-bajo (estado client-side nuevo, UI de selección, posible confusión "guardar" vs "comparar" en mobile). Queda en la cola para una ronda con más margen, no descartada.
- **Gemini** refutó primero la cola pendiente (el link de Guardados en el menú mobile) y priorizó en su lugar `CouponBadge` interactivo: convertir el badge pasivo de cupón en un botón de un toque que copia el código al portapapeles. Evidencia archivo:línea correcta.
- **Claude (propia):** verificado en código que el ícono de Guardados en `Header.tsx:212-224` no tiene ninguna clase `hidden`/`md:` — está visible en el top bar en todos los breakpoints, mobile incluido. El claim de la cola ("falta en mobile") era parcialmente falso: lo único ausente es la entrada de *texto* en el menú hamburguesa, que sería redundante con un ícono ya siempre visible. Coincide con la refutación de Gemini — las tres posiciones convergen en descartar ese ítem de la cola.

**Implementada la idea de Gemini (verificada y de riesgo nulo): `CouponBadge` click-to-copy.** `src/components/products/CouponBadge.tsx` pasó de `<Badge>` pasivo a un `<button>` que envuelve el mismo `<Badge>`, con `navigator.clipboard.writeText(coupon.code)` y feedback visual ("Copiado ✓ pegalo en el carrito") por 2 segundos. Verificado antes de tocar: en los 3 call sites (`ProductCard.tsx:224`, `ProductDetail.tsx:324`, `guides/ProductCard.tsx:195,342`) el badge se renderiza siempre como hermano del `<a>` de afiliado, nunca anidado — sin riesgo de burbujeo de click disparando la navegación. Evento `coupon_copy` agregado a GA4. Si `navigator.clipboard` no existe (contexto no seguro), el click no hace nada y el `title` sigue mostrando el código completo — nunca peor que el badge pasivo original.

**Nota de verificación:** el único cupón activo en `src/data/coupons.ts` (`ALCOLEMELI`) venció el 2026-07-30 23:59, así que hoy no hay cupón visible en el sitio para probar el click en vivo con datos reales. Verificado en su lugar: `tsc --noEmit` limpio, `npm run build` limpio, sin errores de consola en home y en categoría gaming (páginas que renderizan `CouponBadge`). Cuando haya un cupón activo de nuevo, confirmar visualmente el copy-to-clipboard.

**Con 36 features implementadas, 34 commits locales.**

### Iteración 25 (2026-07-31) — una sola idea defendible

**Codex se colgó esta ronda:** lanzado con `model_reasoning_effort=high`, quedó ~17 minutos usando apenas 1s de CPU real (proceso vivo pero sin avanzar) — matado y descartado, sin relanzar. **Gemini/agy** devolvió basura (loop infinito repitiendo la palabra "producing" miles de veces) — descartado también, mismo protocolo del gotcha #6. Ronda resuelta solo con idea propia de Claude.

**Implementado (verificado con lectura directa, riesgo bajo, honestidad de marca):** `SavedProductsView.tsx` mostraba "Todavía no guardaste ningún producto" tanto si la lista estaba realmente vacía como si el fetch a `/api/saved-products` fallaba (red inestable, API caída) — un mensaje falso para un visitante que sí tiene guardados. Se separó el estado de error del estado de lista vacía real: ahora un fetch fallido muestra "No pudimos cargar tus guardados ahora mismo. Siguen ahí, es un problema de conexión." con botón "Reintentar", y solo la ausencia real de ids (`ids.length === 0`) muestra el mensaje de "no guardaste nada". También se sumó `res.ok` check antes de parsear el JSON (antes un 500 con body no-JSON rompía el `.then(res.json())` silenciosamente).

**Verificado en navegador (pestaña fresca):** con `pv_saved_products` vacío, el estado real de "no guardaste nada" se ve sin cambios. Simulando un id guardado + `window.fetch` parcheado para rechazar la llamada a `/api/saved-products`, aparece correctamente "No pudimos cargar tus guardados ahora mismo..." con el botón de reintentar — sin errores de consola. `tsc --noEmit` y `npm run build` limpios.

**Con 37 features implementadas, 36 commits locales.**

### Iteración 26 (2026-07-31) — una sola idea defendible

**Codex terminó bien con `model_reasoning_effort=medium`** (bajado tras el cuelgue de la ronda 25 en `high`): propuso otra vez el comparador manual (3ª ronda seguida, mismo veredicto esfuerzo medio/riesgo medio-bajo), esta vez con números de categoría — `cocina: 138, belleza: 94, hogar: 89` — que **no cerraron contra el catálogo real**: el conteo correcto por `categorySlug` da `cocina: 42, belleza: 60, hogar: 18, gaming: 53, tech: 23`. **Gemini** falló con el error de permisos headless ya documentado (gotcha #6) — descartado sin relanzar.

**Implementado (3 rondas de evidencia consistente + números corregidos, aun así justificado por belleza/gaming):** comparador manual en `/categoria/[slug]`. Botón "Comparar" en `SortableProductGrid.tsx` activa un checkbox por card (máx. 4, `ProductCard.tsx`); con 2+ seleccionados aparece `ComparisonTable.tsx` (nuevo) debajo de la grilla — imagen, precio, descuento, mínimo histórico, rating, vendidos, CTA de afiliado por fila. Tabla fuera del flujo de la grilla (no modal/overlay) para no pelear con scroll atrapado ni z-index en mobile. El checkbox de comparar y el badge de TikTok comparten esquina superior izquierda de la card: cuando ambos aplican, el badge de TikTok baja un escalón (`top-10` en vez de `top-2.5`) — afecta a 16/303 productos, verificado con grep antes de decidir la solución.

**Scoped correctamente:** `SortableProductGrid` es la única consumidora de estas props nuevas (grep confirmado); `ProductGrid` genérico (home, ficha, guardados, trending) no las recibe, así que no hay riesgo de regresión fuera de categorías.

**Verificado en navegador:** click en "Comparar" activa el modo (botón pasa a "Comparando"), selección de 3 productos muestra "3 seleccionados" y la tabla con datos reales (precios, -30%/-12%, ratings, "Mínimo histórico", links a MercadoLibre); seleccionar un 5º producto queda bloqueado (49/49 checkboxes deshabilitados con 4 seleccionados); "Limpiar" resetea todo y saca la tabla. En mobile (375px): grid de la tabla en columnas de 150px con scroll horizontal contenido dentro de su propio contenedor (`overflow-x-auto`), sin desbordar la página; checkbox de comparar (top-left) y botón de guardar (bottom-right) no se superponen dentro de la misma card. La herramienta de screenshot del navegador tuvo un glitch de captura (pantalla negra persistente) durante esta verificación — confirmado que era del tool y no del código cruzando contra el DOM real (`getComputedStyle`, `elementsFromPoint`, `innerText`) antes de seguir. `tsc --noEmit`, `npm run build` y `eslint` sobre los 4 archivos tocados, todos limpios (el único warning de `ProductCard.tsx` — `index` sin usar — ya existía antes de este cambio, confirmado con `git diff`).

**Con 38 features implementadas, 37 commits locales.**

### Iteración 27 (2026-07-31) — una sola idea defendible

**Cola vacía tras la ronda 26 (comparador manual ya implementado), les pedí ideas nuevas a los dos. Ambas fueron reales y las implementé las dos:**
- **Codex:** CTA de afiliado en la tabla "Comparar con otros modelos" de la ficha. Verificado: `ProductDetail.tsx:520` (número de línea previo a este cambio) solo tenía un `<Link>` interno hacia la ficha del producto relacionado, nunca un link a MercadoLibre — a diferencia del comparador de categoría, que sí lleva CTA afiliado (`ComparisonTable.tsx:112`).
- **Gemini:** botón de guardar ausente en la ficha de producto. Verificado: `ProductDetail.tsx` no importaba `Heart` ni `useSavedProducts` (grep confirmado, cero matches) — el único lugar del sitio donde el visitante NO puede guardar el producto es justo donde más tiempo invierte leyendo antes de decidir.

**Implementado:**
1. Botón de guardar (corazón) junto a `ShareButtons` en la ficha, misma lógica de `useSavedProducts` que ya usan `ProductCard` y el header.
2. El botón "Ver" de cada fila de la tabla comparativa pasó de `Link` interno a `AffiliateLink` (`ctaLocation="ficha-comparar"`) — el nombre/imagen de la fila sigue siendo link interno a la ficha, así que la navegación exploratoria no se pierde, solo se agrega la salida directa a MercadoLibre.

**Verificado en navegador:** confirmado con `document.elementsFromPoint`/`querySelectorAll` que el link de "Ver" en la tabla apunta a `meli.la/...` con `rel="sponsored nofollow noopener"` inyectado por `AffiliateLink`. El toggle de guardado se probó con `ref`-based click (no coordenadas manuales — un intento anterior con coordenadas leídas de un screenshot de 800x452 falló silenciosamente porque el viewport real es 1280x720, desfase de escala, no bug de la feature): `localStorage.pv_saved_products` pasa de `[]` a `["MLA..."]` al click, y el contador del header ("Tus guardados") se actualiza en vivo a través del mismo evento `pv-saved-products-change` que ya sincroniza `ProductCard`. `tsc --noEmit`, `eslint` y `npm run build`, todos limpios.

**Con 39 features implementadas, 38 commits locales.**

### Iteración 28 (2026-07-31) — una sola idea defendible

**Gemini falló otra vez** con el error de permisos headless ya documentado (gotcha #6) — descartado sin relanzar.

**Codex propuso llevar ordenar + comparar (de categorías) a los resultados de búsqueda interna.** Evidencia estructural correcta: `HomeFeed.tsx` solo importa `ProductGrid`, nunca `SortableProductGrid` (grep confirmado) — la búsqueda, que es intención explícita de compra, no tenía las herramientas de decisión que categorías sí tienen desde la ronda 26. **Pero los números que citó de nuevo no cerraron**: dijo "catálogo 526 ids, 33 deprioritized" (real: 303 ids, 3 deprioritized) y repitió el mismo patrón de conteo de categoría erróneo de la ronda 26 ("cocina 138" vs 42 real, "hogar 89" vs 18 real) — **segunda vez en tres rondas con el mismo error de conteo**, probable método de grep sistemáticamente mal armado de su lado. Los números no eran necesarios para sostener la idea (el reclamo estructural alcanza), así que se implementó de todas formas, descartando solo la evidencia numérica falsa.

**Implementado con una refactorización elegante en el camino:** en vez de duplicar la lógica de sort/comparar entre `SortableProductGrid` y `HomeFeed`, se extrajeron dos módulos compartidos — `src/lib/product-sort.ts` (`sortProducts`/`SortOption`/`SORT_LABELS`) y `src/lib/use-product-compare.ts` (hook con toda la máquina de estados del modo comparar: selección, límite de 4, eventos GA). `SortableProductGrid.tsx` pasó a consumir ambos en vez de definirlos. `HomeFeed.tsx` suma su propio toolbar "Ordenar por"/"Comparar", visible solo cuando hay búsqueda activa (`isSearching`) y 2+ resultados — la navegación normal por categorías (tabs) queda intacta, sin toolbar.

**Cuidado en el diseño (riesgo que el propio Codex señaló):** el orden se aplica sobre `filteredProducts` completo ANTES de paginar (`sortedProducts.slice(0, visibleCount)`), no solo sobre la página ya visible — ordenar solo lo cargado habría sido conceptualmente incorrecto. Cambiar de categoría o de búsqueda ahora resetea orden, paginación Y la selección de comparar (antes solo reseteaba paginación) — sin esto, una comparación armada en una búsqueda vieja quedaría con ids fantasma al buscar de nuevo (el hook filtra por `.find()`, así que no rompía nada, pero el contador de seleccionados habría quedado desincronizado del listado real).

**Verificado en navegador (pestaña fresca — la primera pestaña mostró HMR obsoleto tras varias ediciones seguidas, gotcha #3):** `/?q=monitor` → "15 productos encontrados" + toolbar "Comparar"/"Ordenar por" visible; cambiar a "Menor precio" reordena correctamente ($131.399 → $131.699 → $162.316...); activar "Comparar" y seleccionar 2 muestra la tabla con datos reales. En `/` sin búsqueda, cero rastro del botón "Comparar" (confirmado con `querySelectorAll` — la navegación por categorías no cambió). `tsc --noEmit`, `eslint` sobre los 4 archivos tocados y `npm run build`, todos limpios.

**Con 40 features implementadas, 39 commits locales.**

### Iteración 29 (2026-07-31) — una sola idea defendible

**Nota operativa:** hubo una brecha de ~1h35 entre el final de la ronda 28 y esta síntesis — el auto-despertar programado no disparó (Juan avisó que "nunca más se volvió a ejecutar el /loop"). Los outputs de Codex y Gemini de esta ronda ya habían terminado de correr y quedaron esperando en disco sin pérdida de trabajo; se retomaron apenas se reanudó la sesión.

**Primera ronda en varias donde Gemini SÍ funcionó** (sin el error de permisos headless). Las dos ideas fueron reales y se implementaron las dos:
- **Codex:** `/guardados` con 2+ productos solo devolvía `ProductGrid` plano — sin las herramientas de decisión que categorías (ronda 26) y búsqueda (ronda 28) ya tienen. Verificado: `SavedProductsView.tsx` (render final) era literalmente `<ProductGrid products={products} />`, sin sort ni comparar.
- **Gemini:** `freeShipping: boolean` existe en `Product` y ya se usa en la ficha (`ProductDetail.tsx:353`), pero `CardProduct` (el DTO liviano de las grillas) lo excluía del `Pick` — así que nunca llegaba a home/categorías/búsqueda, la señal de "sin sorpresas de envío" quedaba oculta hasta que el visitante ya había entrado a la ficha.

**Implementado:**
1. `freeShipping` sumado al `Pick` de `CardProduct` (`types.ts`) y a `toCardProduct()` (`products.ts`). `ProductCard.tsx` muestra "Envío gratis" con el mismo ícono/color que la ficha, debajo de rating/vendidos, solo cuando aplica.
2. `/guardados` con más de un producto ahora usa `SortableProductGrid` en vez de `ProductGrid` — mismo componente ya construido en la ronda 26, cero código nuevo. Con 0 o 1 guardado, el flujo actual (vacío real / error de red / grilla simple) no cambia.

**Verificado en navegador:** en categoría gaming, 50 de 53 cards muestran "Envío gratis" (coherente con la norma del nicho — casi todo en ML AR tiene envío gratis, memoria `nichos-ml-envio-no-es-contra`). Simulando 2 productos guardados, `/guardados` muestra el toolbar completo "Comparar"/"Ordenar por" junto con "Envío gratis" en las cards — ambas features funcionando en conjunto, sin conflicto. `tsc --noEmit`, `eslint` sobre los 4 archivos tocados (los 2 warnings preexistentes de `ProductCard.tsx`/`SavedProductsView.tsx` confirmados con `git diff` como anteriores a este cambio, ronda 25) y `npm run build`, todos limpios.

**Con 42 features implementadas, 41 commits locales.**
