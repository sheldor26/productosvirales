@AGENTS.md

# ProductosVirales — Identidad y reglas

Sitio de contenido + curación de productos virales de MercadoLibre Argentina.
Founder: Juan (no técnico). Monetización: links de afiliado MercadoLibre (`meli.la/...`).

## Stack en una línea
Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript. Sin DB: contenido en `src/data/*.ts`. Hosting: Vercel. Detalles en [ARCHITECTURE.md](ARCHITECTURE.md).

## Reglas de oro (no negociables)

1. **No introducir librerías nuevas sin preguntar.** Si pensás que hace falta una dep nueva, parar y preguntar antes de instalar.
2. **Simple > complejo, siempre.** Si hay dos formas de hacer algo, hacelo de la forma más obvia. No abstraer "por si en el futuro".
3. **Explicar en lenguaje simple.** Juan es founder no técnico. Cuando expliques una decisión técnica, traducirla a qué cambia para el negocio o el usuario.
4. **No tocar el stack base sin avisar.** Cambios a `next.config.ts`, `tsconfig.json`, `package.json`, headers, CSP, sitemap, robots, layout raíz → avisar primero qué y por qué.
5. **Esta NO es la Next.js que conocés.** Versión 16.2.3 tiene breaking changes. Antes de tocar rutas, metadata o App Router, leer `node_modules/next/dist/docs/` (ver `AGENTS.md`).
6. **Contenido = código.** Productos y guías viven en `src/data/curated-products.ts` y `src/data/guides.ts`. Cambiar contenido es un commit como cualquier otro.
7. **El contenido editorial es el activo.** No borrar productos ni guías sin razón clara; preferir `visibility: "deprioritized"` antes que eliminar.

## Estructura de la memoria del proyecto

- `CLAUDE.md` (este archivo) — identidad + reglas core, corto.
- [ARCHITECTURE.md](ARCHITECTURE.md) — stack, decisiones técnicas, convenciones.
- [CURRENT_STATE.md](CURRENT_STATE.md) — qué hay hoy: productos, guías, clusters, pendientes. Se actualiza al final de cada sesión.
- [MISTAKES.md](MISTAKES.md) — cada vez que algo sale mal, queda anotado acá.
- [LEARNINGS.md](LEARNINGS.md) — cada vez que algo funciona bien, queda anotado acá.
- `AGENTS.md` — aviso obligatorio sobre Next 16.
- `docs/ARTICLE_CREATION_WORKFLOW.md` — cómo agregar un artículo nuevo (lado técnico).
- **`docs/guias.md` — sistema de diseño y plantilla OFICIAL de todas las guías. Toda guía nueva sigue ESTE diseño (estilo TechRadar best-of). Leer SIEMPRE antes de escribir o rediseñar una guía.**
- `docs/clusters/<cluster>/` — borradores editoriales por cluster (perfumes-arabes, freidoras-de-aire, etc.).

## Comandos

```bash
npm run dev                                  # next dev (verificación visual)
npm run build                                # next build — ESTO es el test: chequea tipos. No hay framework de tests.
npm run lint                                 # eslint (no es `next lint`)
npm run prices:check  -- --match <slug>      # dry-run de precios desde ML
npm run prices:update -- --match <slug>      # aplica precios a curated-products.ts
```

No existe `npm test`: la verificación es `npm run build` (tipos) + revisar en `npm run dev`.

## Cómo trabajar en este repo

- Cambios chicos: editar el archivo y `npm run lint && npm run build` antes de cerrar.
- Features nuevas: seguir `.claude/skills/feature.md`.
- Artículos nuevos: seguir `docs/guias.md` (diseño y estructura, OBLIGATORIO) + `docs/ARTICLE_CREATION_WORKFLOW.md` (cómo guardar el objeto `Guide` en `src/data/guides.ts`).
- Productos nuevos: editar `src/data/curated-products.ts` (o usar `scripts/ml-product-importer.ts` para importar de MercadoLibre).
- Precios: `npm run prices:check -- --match <slug>` (dry-run) o `npm run prices:update -- --match <slug>` (escribe).

## Antes de cerrar una sesión

1. Verificar `npm run build` pasa.
2. Actualizar [CURRENT_STATE.md](CURRENT_STATE.md) con lo que cambió.
3. Si algo salió mal → entrada en [MISTAKES.md](MISTAKES.md).
4. Si algo funcionó muy bien → entrada en [LEARNINGS.md](LEARNINGS.md).
5. Si Juan no pidió commit, no commitear. Mostrar el diff y esperar instrucción.

## Qué NO hacer

- No correr `git push`, `--force`, ni borrar branches sin pedirlo explícito.
- No agregar emojis a código ni a archivos salvo que Juan lo pida.
- No crear archivos `.md` nuevos en la raíz sin que estén pedidos.
- No "limpiar" código ajeno a la tarea actual.
- No mockear comportamiento que se puede testear con datos reales.
- No commitear `.env`, archivos en `.cache/`, ni `pending-price-results.json` (ya están en `.gitignore`).
