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
