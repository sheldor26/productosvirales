---
name: feature
description: Receta para construir una feature nueva en productosvirales. Úsala cuando Juan pida algo más grande que un edit chico.
---

# Receta para una feature nueva

Aplicable cuando: hay que tocar más de un archivo, agregar una ruta, una sección nueva, o un cambio de UI/contenido no trivial.

## 0. Antes de tocar código

1. Releer reglas de oro en [CLAUDE.md](../../CLAUDE.md).
2. Si la feature huele a que necesita una librería nueva → **parar y preguntarle a Juan.**
3. Revisar [CURRENT_STATE.md](../../CURRENT_STATE.md) — ¿esto ya existe parcialmente?
4. Revisar [MISTAKES.md](../../MISTAKES.md) — ¿pisamos esto antes?

## 1. Diseñar antes de escribir

Explicar en 3-5 bullets a Juan, en lenguaje no técnico:

- Qué va a ver el usuario que hoy no ve.
- Qué archivos toca el cambio.
- Si hay trade-offs, cuáles.
- Cuánto tarda (estimación gruesa).

Si Juan dice "dale", arrancar. Si no contesta y la feature es chica + reversible, seguir.

## 2. Implementar — checklist

- **Tipos primero.** Si la feature introduce datos nuevos, extender `src/lib/types.ts`. El compilador empuja al resto.
- **Contenido en `src/data/*.ts`.** Productos en `curated-products.ts`, guías en `guides.ts`. Nada de hardcodear en componentes.
- **Componentes reutilizables en `src/components/<area>/`.** No crear carpeta nueva si encaja en `feed/`, `products/`, `guides/`, `layout/`, `ui/`, `widgets/`, `affiliate/`.
- **Rutas nuevas: App Router.** Crear carpeta en `src/app/<ruta>/page.tsx`. Si necesita metadata dinámica, exportar `generateMetadata`. Si hay parámetros, recordar que `params` y `searchParams` son `Promise` en Next 16.
- **Imágenes:** `next/image`, no `<img>`. Si el dominio es nuevo, agregar en `next.config.ts > images.remotePatterns` (y avisar a Juan que cambió config).
- **Estilos:** clases Tailwind. Variables CSS personalizadas viven en `globals.css` (`--color-*`, `--font-*`).
- **Sin comentarios decorativos.** Solo comentar el "por qué" cuando no es obvio del código.
- **Links de afiliado:** usar el componente `AffiliateLink` o el campo `affiliateUrl` del producto, no hardcodear `meli.la/...`.

## 3. SEO si la feature toca contenido

- Si es página nueva visible: agregar al `sitemap.ts`.
- Definir `metadata` (title, description, canonical, OG).
- Si es producto: completar `seoTitle`, `metaDescription`, `h1`, `articleBody`, `faq`, `specs`, `structuredData`.
- Si es guía: respetar el formato de `Guide` (ver `docs/ARTICLE_CREATION_WORKFLOW.md`).

## 4. Verificar antes de cerrar

```bash
npm run lint
npm run build
```

Si la feature es UI:

```bash
npm run dev
# abrir http://localhost:3000 y probar
# - el camino feliz
# - 1 caso borde (input vacío, sin resultados, mobile)
# - ver que no rompió la home
```

No declarar "listo" sin haber abierto el navegador. Si no se puede probar visualmente, decirlo explícito.

## 5. Cerrar la sesión

- Actualizar [CURRENT_STATE.md](../../CURRENT_STATE.md): qué cambió, qué quedó pendiente.
- Si algo salió mal → entrada en [MISTAKES.md](../../MISTAKES.md).
- Si encontraste un patrón reutilizable → entrada en [LEARNINGS.md](../../LEARNINGS.md).
- Mostrar el diff a Juan. **No commitear sin pedirlo.**

## Anti-patterns (no hacer)

- ❌ Instalar una dep nueva sin preguntar.
- ❌ Crear un componente nuevo cuando ya hay uno parecido en `components/ui` o `components/widgets`.
- ❌ Tocar `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, layout raíz, CSP, sitemap o robots sin avisar.
- ❌ Borrar productos o guías. Marcarlos `visibility: "deprioritized"`.
- ❌ "Refactorizar de paso" código no relacionado.
- ❌ Asumir convenciones de Next ≤15. Esta es Next 16.
