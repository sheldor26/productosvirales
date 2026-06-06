# Bitácora de sesiones

> Historial de qué se hizo en cada sesión con Claude.
> Cada sesión appendea una entrada **arriba** (más nueva primero).
> Esto se actualiza automáticamente al cerrar la sesión (hook Stop).

<!-- Plantilla para nuevas entradas:

## YYYY-MM-DD — Título corto de la sesión

**Qué se hizo:**
- ...
- ...

**Archivos tocados:** ruta1, ruta2

**Estado al cerrar:** (commiteado / sin commitear / parcial)

**Decisiones pendientes para Juan:**
- ...

**Próximo paso sugerido:**
- ...

---
-->

## 2026-06-06 — Nicho aspiradoras robot completo + scraper arreglado + API oficial de ML validada

**Qué se hizo:**
- **Fixes de render**: links markdown en `intro`/`standfirst` no se parseaban (se veían `[texto](url)` literal) → ahora usan `parseInlineLinks`. Además el parser ahora soporta links anidados en bold (`**[x](url)**`). Hero de guías pasó de `object-cover` a `object-contain` (imágenes verticales como pavas/perfumes ya no se recortan). Arregladas 12 imágenes hero rotas en guías de freidoras (apuntaban a `/images/freidoras/` inexistentes → URLs del CDN de ML).
- **6 productos Panini Mundial 2026** importados (categoría nueva `coleccionables`).
- **Scraper/importador de ML auditado y arreglado** (workflow de análisis, sin deps nuevas): shim `__name` que arregla el importer `.ts` vía tsx, parser de precios usa solo `__fraction` + redondeo (elimina centavos basura tipo `$121.339,23`), User-Agents solo Chrome, backoff+reintento ante CAPTCHA, perfil persistente por default, delays 8-20s. Mismo fix replicado en `update-prices-from-ml.cjs`.
- **API oficial de ML VALIDADA** (OAuth client_credentials): token sin login, `/products/{id}` da metadata + imágenes, `/products/{id}/items` da precio. **Importa sin bloqueos ni CAPTCHA.** Credenciales en `.env` local (gitignored). Ver memoria `ml-api-oficial-funciona`.
- **10 aspiradoras robot importadas** vía API oficial (Atma x3, Samsung Jetbot + POWERbot, Kärcher, Xiaomi x4). Más 8 que ya estaban = 18 en total.
- **Precios de 8 aspiradoras robot** actualizados con el scraper (5 headless + 3 headful por CAPTCHA).
- **Red de 7 guías de aspiradoras robot** (categoría nueva `aspiradoras-robot`), escritas con workflow de 14 agentes: HUB pilar (3.673 palabras) + trapeadora + precios + Xiaomi + Gadnic + mapeo láser + cómo funciona. 33 product-cards, 186 links meli.la (afiliados reales verificados), cross-links internos entre las 7. HUB completado a la spec PARTE 3 (sección trapeado, sección precios + trust-block pricing, bloque verdict).
- **Doc maestro del nicho** guardado en `docs/nichos/aspiradoras-robot.md`.

**Archivos tocados:**
- `src/components/guides/ArticleHeader.tsx`, `GuideRenderer.tsx`, `src/lib/parse-inline-links.tsx` (render fixes).
- `src/lib/scraper.ts`, `scripts/update-prices-from-ml.cjs` (scraper fixes).
- `src/data/curated-products.ts` (6 Panini + 10 robots + precios).
- `src/data/guides.ts` (7 guías + categoría `aspiradoras-robot` en guideCategories), `src/lib/guide-thumbnail.ts`.
- `docs/nichos/aspiradoras-robot.md` (nuevo). `.env`/`.env.example` (credenciales ML, gitignored).

**Estado al cerrar:** todo commiteado y pusheado. Working tree con cambios en los 4 .md de estado.

**Decisiones pendientes para Juan:**
- Construir un **importador/actualizador por API oficial reusable** (`scripts/`) que reemplace al scraper Puppeteer para precios — elimina los bloqueos de raíz. Anotado en memoria.
- Eventual: escribir las fichas individuales (`articleBody`, pros/cons) de las 10 aspiradoras nuevas (hoy tienen datos base, no review largo).
- Samsung VR05R5050WK (MLAU) quedó afuera: la API no expone su imagen. Se reemplazó por el POWERbot E de catálogo.

**Próximo paso sugerido:**
- Medir SEO de la red de aspiradoras robot a partir del ~27-jun (3 semanas).
- Pedir reindexación en GSC de los 7 slugs nuevos + las 10 fichas.

---

## 2026-05-26 (tarde-noche) — Fase 2 perfumes árabes completa + cambio de regla de afiliados

**Qué se hizo:**
- **8 guías nuevas de fase 2 perfumes árabes** escritas y publicadas siguiendo el Master Structure, con cadencia de 3 días entre cada una:
  1. `perfumes-arabes-originales` (26-may) — borrador previo convertido a Guide.
  2. `donde-comprar-perfumes-arabes-argentina` (26-may) — escrita desde cero, captura "perfumes árabes en argentina" 1.300/mes dif 8.
  3. `lattafa-guia-marca` (29-may) — captura 10.800/mes consolidado.
  4. `perfumes-arabes-por-color` (1-jun) — **artículo nuevo descubierto con Ubersuggest**, captura 7.500/mes consolidado de búsquedas por color del envase.
  5. `perfumes-arabes-dupes` (4-jun) — dupes vs originales occidentales.
  6. `perfumes-arabes-mas-vendidos-argentina` (7-jun) — ranking basado en reseñas reales del catálogo.
  7. `lattafa-asad-comparativa` (10-jun) — descubrió y explicitó que Asad Bourbon/Negro del catálogo AR son "genéricos", no oficiales.
  8. `donde-comprar-perfumes-arabes-buenos-aires` (13-jun) — local SEO CABA/GBA.
- Cluster perfumes árabes pasa de 6 a 14 guías. Targeting consolidado ~40-50.000 búsquedas/mes con dificultad mayoritariamente baja.
- **Fixes urgentes en 4 guías agendadas pre-existentes**:
  - `pava-electrica-pequena`: CTA de Liliana AP992B revisado (después revertido a meli.la por cambio de regla).
  - `freidora-de-aire-desventajas`: seoTitle 73→58c, ogTitle/ogDescription agregados, bloque `internalLinks` agregado.
  - `mejores-freidoras-de-aire-economicas-argentina`: seoTitle 70→60c, ogTitle/ogDescription.
  - `powerxl-freidora-review`: seoTitle 69→49c, ogTitle/ogDescription.
- **CAMBIO DE REGLA IMPORTANTE — links de afiliado**:
  - Decisión de Juan: los links inline a productos en el cuerpo de un guide van **directo a meli.la** (afiliado), no a la ficha interna. Prioriza conversión sobre SEO interno.
  - El SEO interno se sigue construyendo vía cross-links entre guías (`/guias/...`).
  - El componente `product-card` ya estaba bien (CTA principal va a ML, secundario a ficha).
  - Master Structure sección 4.9 reescrita con la regla nueva.
  - `.claude/skills/new-post.md` regla 2 alineada.
  - **40 links inline `/producto/...` reemplazados por meli.la** en los 8 guides nuevos. Antes de la corrección, 3 guides tenían 0 links inline a ML (todos los productos solo en cards) — la corrección agregó 26 links inline directos a ML repartidos en las menciones de texto prominentes.
- **Auditoría de cola** (21 artículos agendados): 6 son de fase 2 perfumes árabes (escritos por nosotros), 15 son pre-existentes (freidoras + pavas). Identificados patrones: ningún artículo histórico tiene `product-card` ni `quickPicks`. 12 sin ogTitle/ogDescription. 3 con seoTitle truncado.
- **Chips flageados para sesiones futuras**:
  - Limpieza de 41 errores ESLint preexistentes.
  - Conversión de ~112 links inline `/producto/...` históricos a meli.la (regla nueva).
  - Upgrade de ogTitle/ogDescription en 11 guías agendadas (deuda metadata).
- **12 ideas exploradas para mejora del sitio** (sticky CTA mobile, hero featured, price drop alerts, comparador side-by-side, quiz, TikTok embeds, etc.) — Juan eligió no implementar todavía, quedan en el roadmap.

**Archivos tocados:**
- `src/data/guides.ts`: 8 guides nuevos + 4 fixes en cola + 40 reemplazos de links a meli.la.
- `docs/POST_MASTER_STRUCTURE.md`: sección 4.9 reescrita.
- `.claude/skills/new-post.md`: regla 2 alineada.
- `.claude/hooks/finalize-session.sh`: prompt de cierre mejorado (pide SESSION_LOG explícito).
- `.claude/skills/onboarding.md`: nueva skill creada.
- `README.md`: reescrito como puerta de entrada útil.
- `SESSION_LOG.md` (este archivo).

**Estado al cerrar:** commiteado y pusheado. Working tree clean. Commits:
- `54385ca` perfumes-arabes-originales
- `ae9191e` donde-comprar-perfumes-arabes-argentina + diversificación de heros
- `192902e` chore(prices): 19 precios stale actualizados
- `94aec75` 6 guías de fase 2 + diversificación de heros fallback
- `2641861` docs: actualizar regla de links de afiliado en Master Structure

**Decisiones pendientes para Juan:**
- Pedir reindexación en GSC de las 2 URLs que ya salen hoy: `/guias/perfumes-arabes-originales` y `/guias/donde-comprar-perfumes-arabes-argentina`.
- Las otras 6 se reindexan automáticamente al salir en sus fechas (29-may, 1-jun, 4-jun, 7-jun, 10-jun, 13-jun).
- Decidir si arrancar con las 12 ideas exploradas para mejora del sitio (top 3 recomendadas: sticky CTA mobile, hero featured, price drop alerts).
- Decidir el próximo cluster temático cuando perfumes árabes esté cerrado (limpiavidrios fue mencionado en un commit reciente como posible).

**Próximo paso sugerido:**
- Esperar 2-3 semanas para medir impacto SEO de fase 2 (volver a exportar XLSX de GSC el ~16-jun).
- Mientras tanto: cerrar la deuda técnica con cualquiera de los 3 chips flageados o arrancar el siguiente cluster.
- Considerar implementar el #1 sticky CTA mobile en cuanto haya tiempo — es el de mayor impacto/esfuerzo del análisis.

---

## 2026-05-26 — Auditoría inicial, optimización SEO de 4 guías, rediseño de /guias y Master Structure

**Qué se hizo:**
- Auditoría completa del proyecto. Creados desde cero: `CLAUDE.md`, `ARCHITECTURE.md`, `CURRENT_STATE.md`, `MISTAKES.md`, `LEARNINGS.md`, `.claude/skills/{feature,review,onboarding,new-post}.md`, `.claude/settings.json` con hook Stop, `.claude/hooks/finalize-session.sh`.
- Análisis de Google Search Console: identificadas 4 guías con problemas SEO concretos. Generados prompts para Claude VSCode con valores exactos:
  1. `philips-freidoras-de-aire-review` (CTR 0.49% sobre 618 imp): nuevo seoTitle, metaDescription, h1, ogTitle, ogDescription, sección de respuesta directa al inicio. Producto `MLA47275624` (pava Peabody PE-DK2200N): seoTitle y meta con modelo explícito.
  2. `atma-vs-peabody-freidora-de-aire` (pos 4.96): metadata mejorada + respuesta directa.
  3. `masajeador-cervical` (pos 26.58 query genérica): metaDescription acortada + respuesta directa.
  4. `perfumes-arabes-mujer` (pos 14.89): ogTitle/ogDescription diferenciados + respuesta directa.
- Rediseño de página `/guias`: pills sticky por categoría + cards con thumbnail + tiempo relativo + reading time + badge "Recién actualizada". Prompt para Claude VSCode armado.
- Imágenes hero para 15 guías sin imagen (masajeadores + pavas eléctricas) usando URLs del CDN de MercadoLibre.
- **Master Structure**: creado `docs/POST_MASTER_STRUCTURE.md` (biblia editorial agnóstica al cluster con 12 trucos psicológicos catalogados, 4 esqueletos por tipo de post, checklist SEO).
- `.claude/skills/new-post.md` (receta operativa para Claude).
- README.md reescrito como puerta de entrada útil (antes era el default de Next).
- Template obsoleto `docs/clusters/perfumes-arabes/TEMPLATE_ARTICULO.md` reemplazado por puntero al Master.

**Insight clave para fase 2 — datos de Ubersuggest (perfumes árabes en AR):**
- Volúmenes enormes con SEO difficulty bajísima en este nicho (oportunidad rara).
- Top keywords: "perfume arabe" 40.500/mes dif 12; "perfumes árabes mujer" 22.200 dif 6; "perfume arabe hombre" 18.100 dif 7.
- **Gap nuevo descubierto**: la gente busca perfumes árabes por COLOR del envase (rosa, dorado, blanco, rojo, azul, naranja, celeste, marrón). Consolidado ~7.500/mes con dif <20 mayoritariamente. **Artículo nuevo no planeado**: `perfumes-arabes-por-color`.
- **Lattafa como marca**: 10.800/mes consolidado. `lattafa-guia-marca` debería subir de #6 a #3 en el calendario.
- **"perfumes arabes en argentina"** 1.300/mes con dif 8 → `donde-comprar-perfumes-arabes-argentina` debería ser **#1**, no #2.
- Productos con dif muy baja y volumen interesante: erba pura (1.300, dif 11), violeta (1.000, dif 5), 9pm (390, dif 12), bharara (390, dif 11), badee al oud (210, dif 8). Mini-reviews al backlog.
- Yara: ampliar `yara-lattafa-guia-completa` con sección por color/versión para capturar 2.900+ adicionales.

**Archivos tocados:**
- Raíz: `CLAUDE.md`, `ARCHITECTURE.md`, `CURRENT_STATE.md`, `MISTAKES.md`, `LEARNINGS.md`, `README.md`, `SESSION_LOG.md` (este).
- `.claude/`: `settings.json`, `hooks/finalize-session.sh`, `skills/{feature,review,onboarding,new-post}.md`.
- `docs/`: `POST_MASTER_STRUCTURE.md`, `ARTICLE_CREATION_WORKFLOW.md` (header agregado), `clusters/perfumes-arabes/TEMPLATE_ARTICULO.md` (reemplazado).

**Estado al cerrar:** parcial — Juan iba a commitear todo. Los 4 prompts SEO + el rediseño de /guias + las imágenes hero los aplica Claude VSCode (no este Claude).

**Decisiones pendientes para Juan:**
- Pedir reindexación en GSC de las 5 URLs modificadas (lista entregada).
- Aplicar prompts en Claude VSCode en orden: SEO 4 guías → rediseño /guias + imágenes hero.

**Próximo paso sugerido:**
- Arrancar **Fase 2 del cluster perfumes árabes** aplicando los insights de Ubersuggest (nuevo orden: 1. donde-comprar-argentina, 2. originales [borrador ya listo], 3. lattafa-guia-marca, 4. perfumes-arabes-por-color [nuevo], 5. dupes, 6. más vendidos, 7. asad comparativa, 8. buenos-aires).
- Primer artículo a convertir: `donde-comprar-perfumes-arabes-argentina` o `perfumes-arabes-originales` (este tiene borrador en docs/).
