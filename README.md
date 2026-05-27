# ProductosVirales

Sitio de contenido + curación de productos virales de MercadoLibre Argentina.
Monetización: links de afiliado (`meli.la/...`).

**Stack**: Next.js 16.2.3 (App Router) + React 19 + Tailwind v4 + TypeScript. Sin base de datos — el contenido vive como objetos TypeScript en `src/data/`. Deploy en Vercel.

---

## 🧭 Si sos nuevo en este repo (humano o agente AI)

Leé en este orden:

1. **[CLAUDE.md](CLAUDE.md)** — identidad del proyecto, reglas de oro, qué NO hacer.
2. **[AGENTS.md](AGENTS.md)** — aviso crítico: esta NO es la Next.js que conocés (versión 16 con breaking changes).
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** — stack completo, decisiones técnicas, estructura de carpetas, modelo de datos.
4. **[CURRENT_STATE.md](CURRENT_STATE.md)** — snapshot del proyecto hoy: qué hay, qué cambió, qué está pendiente.

Para tareas específicas:

| Si querés... | Leé |
|---|---|
| Crear una guía nueva | [docs/POST_MASTER_STRUCTURE.md](docs/POST_MASTER_STRUCTURE.md) (editorial) + [docs/ARTICLE_CREATION_WORKFLOW.md](docs/ARTICLE_CREATION_WORKFLOW.md) (técnico) |
| Construir una feature nueva | [.claude/skills/feature.md](.claude/skills/feature.md) |
| Hacer un review semanal del proyecto | [.claude/skills/review.md](.claude/skills/review.md) |
| Ver qué salió mal antes | [MISTAKES.md](MISTAKES.md) |
| Ver qué patrones funcionaron | [LEARNINGS.md](LEARNINGS.md) |

---

## ⚡ Comandos rápidos

```bash
npm install          # instalar deps (Node 20+, npm 10+)
npm run dev          # next dev — abre http://localhost:3000
npm run build        # next build (tiene que pasar antes de cada deploy)
npm run lint         # eslint
```

### Precios desde MercadoLibre (Puppeteer)

```bash
# Chequear sin escribir
npm run prices:check  -- --match <slug> --limit 5

# Actualizar precios en src/data/curated-products.ts
npm run prices:update -- --match <slug> --limit 5
```

Si MercadoLibre pide verificación humana, una vez con browser visible:

```bash
ML_SCRAPER_HEADFUL=true \
ML_SCRAPER_PROFILE_DIR=.cache/ml-scraper-profile \
npm run prices:update -- --match freidora --limit 5
```

---

## 📁 Mapa rápido del repo

```
src/
  app/              Rutas (App Router)
    page.tsx          → / (home)
    guias/            → /guias y /guias/[slug]
    producto/[slug]   → /producto/<slug-mla-id>
    categoria/[slug]  → /categoria/<slug>
    api/              → import, scrape, search, subscribe, trends
    sitemap.ts, robots.ts, layout.tsx
  components/       UI por área (feed/, products/, guides/, layout/, ui/, widgets/)
  data/
    curated-products.ts   ← catálogo de productos (170 entradas)
    guides.ts             ← guías publicadas
    categories.ts         ← categorías del feed
  lib/              types, helpers, scraper, mercadolibre
public/
  guias/                  imágenes de guías
  images/                 imágenes por cluster (freidoras, perfumes)
scripts/                  utilidades node (importar, scrape, optimizar)
docs/
  POST_MASTER_STRUCTURE.md     ← biblia editorial
  ARTICLE_CREATION_WORKFLOW.md ← cómo se guarda un artículo
  clusters/                    ← borradores y planes por cluster
.claude/
  settings.json         ← hooks de Claude Code
  hooks/                ← scripts ejecutables (Stop hook)
  skills/               ← recetas operativas (feature, new-post, review)
```

---

## 🔑 Reglas no negociables

1. **No introducir librerías nuevas sin preguntar.**
2. **Simple > complejo, siempre.**
3. **Antes de tocar App Router / metadata / rendering: leer `node_modules/next/dist/docs/`** (Next 16 tiene breaking changes).
4. **El contenido es código.** Editar `src/data/*.ts` es un commit como cualquiera.
5. **No borrar productos ni guías**: usar `visibility: "deprioritized"`.

Detalle completo en [CLAUDE.md](CLAUDE.md).

---

## 🌐 Variables de entorno

Ver `.env.example`. Las críticas:

- `PV_API_SECRET` — gatekeeper de `/api/*` en producción.
- `ENABLE_SCRAPE` — habilita `/api/scrape` (default `false`).
- `NEXT_PUBLIC_SITE_URL` — usado por sitemap, robots, canonicals.

---

## 🚀 Deploy

Auto-deploy en Vercel al pushear a `master`. Confirmar `npm run build` local antes.

ISR diaria en `/guias` y `/guias/[slug]` (`revalidate = 86400`) — guías agendadas con `publishedDate` futura salen automático.
