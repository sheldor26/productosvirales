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
