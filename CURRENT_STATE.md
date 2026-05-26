# Estado actual

> Snapshot del proyecto. Se actualiza al final de cada sesión.
> Última actualización: 2026-05-26 (auditoría inicial).

## Catálogo

- **170 productos** en `src/data/curated-products.ts`.
- Distribución por categoría del feed:
  - Hogar: 55
  - Cocina: 53
  - Belleza: 50 (40 + 10 entre comillas dobles/simples — convención mixta)
  - Tech: 12
- Productos featured (visibility: "featured"): TCL 43S5K (Smart TV 43" — top del catálogo).
- Precios trackeados con `priceUpdated` + `priceLastChecked` + `priceStatus` (fresh/stale/out_of_stock).

## Guías publicadas

- **46 guías** en `src/data/guides.ts` (`grep -c "slug: \""`).
- Distribución por cluster:
  - `freidoras-de-aire`: 23
  - `pavas-electricas`: 11
  - `perfumes-arabes`: 6
  - `masajeadores`: 6
- Estructura: cada guía es un objeto `Guide` con secciones tipadas (ver `lib/types.ts`).
- Render: `src/components/guides/GuideRenderer.tsx`.
- Filtro por fecha: solo se muestran guías con `publishedDate <= hoy`.

## Clusters editoriales (drafts)

Carpetas en `docs/clusters/`:

- **`freidoras-de-aire/`**
  - Subcarpetas: `pilar`, `comparativas`, `informacionales`, `reviews`.
  - Tiene `convert-to-guides.mjs` (script de conversión markdown → objeto `Guide`).
  - `INTERNAL-LINKING-MAP.md`, `PUBLISHING-PROMPT.md`, `README.md`.
- **`perfumes-arabes/`**
  - `articulos_lote_1.md` — borrador batch.
  - `perfumes-arabes-originales.md` — borrador prioridad 1 (NO publicado).
  - `TEMPLATE_ARTICULO.md` — plantilla para nuevos artículos.
  - `NEXT_ARTICLES.md` — roadmap priorizado (auditoría 2026-05-26).

## Pendientes detectados en el roadmap

De `docs/clusters/perfumes-arabes/NEXT_ARTICLES.md` (Prioridad 1):

1. `perfumes-arabes-originales` — borrador listo en docs, falta convertir a `Guide`.
2. `donde-comprar-perfumes-arabes-argentina` — sin borrador.
3. `perfumes-arabes-dupes` — sin borrador.

Prioridad 2:
- `lattafa-asad-comparativa`
- `perfumes-arabes-mas-vendidos-argentina`

## Cambios recientes (git log)

Últimos 10 commits:

- `36e50be` Ordenar guías y mostrar fecha completa en /guias.
- `91015bc` Mejora importador de MercadoLibre sin API.
- `b89a231` Cluster aspiradoras cerrado + apertura cluster limpiavidrios.
- `3534661` Editorial backfill de los 4 top robot vacuums del catálogo.
- `55456ef` Cluster perfumes árabes cerrado — cobertura SEO 30/30.
- `2c75810` Editorial backfill 7 perfumes árabes prioritarios.
- `52b165c` Editorial + olfactive backfill top 6 perfumes.
- `45c1e22` Backfill `brand` en 74 productos via whitelist.
- `de1407c` Mover carpetas `cluster-*` a `docs/clusters/`.
- `1fa6e13` Generar siblings WebP para OG cards de masajeador.

## Archivos sin commitear (working tree)

```
docs/ARTICLE_CREATION_WORKFLOW.md             (nuevo)
docs/clusters/perfumes-arabes/NEXT_ARTICLES.md (nuevo)
docs/clusters/perfumes-arabes/TEMPLATE_ARTICULO.md (nuevo)
docs/clusters/perfumes-arabes/perfumes-arabes-originales.md (nuevo, borrador)
```

Ninguno está aún en `git add`.

## Configuración

- Next.js: 16.2.3 (no es la versión que la mayoría de modelos conocen — leer docs antes de tocar App Router).
- TypeScript: estricto.
- ESLint: `next/core-web-vitals` + `next/typescript`.
- CSP estricto y headers de seguridad activos en `next.config.ts`.
- Sitemap dinámico cubre: home, /trending, /guias, categorías visibles, productos visibles, guías publicadas.
- Robots permite todo salvo `/api/`.

## Salud / riesgos conocidos

- **Convención mixta de quotes** en `curated-products.ts` (algunas entries con `'` y otras con `"`). No es bug, solo inconsistencia.
- **Sin tests automatizados.** Verificación = `npm run build` + `npm run dev` manual.
- **Scraping de ML puede pedir verificación humana** — flujo headful documentado en README.
- **`plan_editorial.json`** (31KB) en raíz — referencia editorial, no leído por el runtime.

## Próximas decisiones esperando a Juan

(Esta sección debe vaciarse a medida que Juan decide.)

- ¿Convertir y publicar `perfumes-arabes-originales` desde el borrador existente?
- ¿Empezar nuevo cluster (limpiavidrios) o seguir cerrando perfumes árabes?
