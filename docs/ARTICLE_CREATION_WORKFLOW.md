# Workflow técnico para crear nuevos artículos

> Este documento cubre la parte **técnica**: cómo se guarda un artículo en `src/data/guides.ts`, qué campos tiene un `Guide`, cómo se renderiza.
>
> Para la parte **editorial y psicológica** (qué estructura usar, cómo escribir con SEO + persuasión, trucos de copy) ver [POST_MASTER_STRUCTURE.md](POST_MASTER_STRUCTURE.md) — esa es la biblia editorial.
>
> Si sos Claude y te piden crear un post nuevo, seguí la receta operativa en [.claude/skills/new-post.md](../.claude/skills/new-post.md).

Este proyecto publica artículos desde `src/data/guides.ts`. Los Markdown en `docs/clusters/` funcionan como fuente editorial o borrador, pero el sitio no los lee directamente en runtime.

## Como funciona hoy

1. El articulo final debe existir como objeto `Guide` dentro del array `guides` en `src/data/guides.ts`.
2. La ruta publica es `/guias/[slug]`.
3. Solo se muestran articulos con `publishedDate <= hoy`, mediante `getPublishedGuides()`.
4. La pagina de detalle esta en `src/app/guias/[slug]/page.tsx`.
5. El render visual lo hace `src/components/guides/GuideRenderer.tsx`.

## Campos minimos de una guia

```ts
{
  slug: "mi-slug",
  category: "perfumes-arabes",
  title: "Titulo visible",
  seoTitle: "Titulo SEO",
  metaDescription: "Descripcion SEO de 150-160 caracteres.",
  ogTitle: "Titulo para compartir",
  ogDescription: "Descripcion para compartir",
  h1: "H1 del articulo",
  publishedDate: "2026-05-27",
  updatedDate: "2026-05-27",
  hasDisclosure: true,
  intro: [
    "Primer parrafo.",
    "Segundo parrafo."
  ],
  sections: [
    { type: "h2", title: "Primer subtitulo" },
    { type: "p", content: "Texto con [link interno](/guias/perfumes-arabes)." }
  ],
  faq: [
    {
      question: "Pregunta frecuente",
      answer: "Respuesta breve y directa."
    }
  ]
}
```

## Tipos de bloque disponibles

- `p`: parrafo.
- `h2` / `h3`: subtitulos.
- `table`: tabla con `headers` y `rows`.
- `list`: lista con `items`.
- `image`: imagen individual, idealmente con `alt`.
- `image-grid`: grilla de imagenes.
- `product-card`: tarjeta conectada a un producto por `productMlaId`.
- `callout`: nota, advertencia, tip o actualizacion.
- `trust-block`: bloque de metodologia, credenciales o precios.
- `pull-quote`: cita destacada.
- `verdict`: conclusion editorial.

## Roles AI-OS para guias

- **Claude/Kogod = cerebro principal y redactor/implementador.** Por costo y capacidad disponible en el plan Max, Claude debe escribir, reescribir y aplicar la mayor parte de los cambios largos de una guia.
- **Codex/GPT = auditor editorial/SEO y de repo.** Codex no debe gastar tokens escribiendo guias largas salvo emergencia: revisa estrategia, detecta riesgos, cruza opiniones, revisa diffs, valida checks y sugiere mejoras concretas para que Claude las aplique. Claude puede consultarlo con `scripts/ai-os/ask-codex.sh`.
- **Gemini = auditor Google/SERP/AIO y multimedia.** Gemini revisa intencion de busqueda, cobertura semantica, canibalizacion, utilidad para AI Overviews/Gemini, hero, imagenes, manuales, screenshots, alt text, OG/Pinterest y oportunidades visuales.

## Flujo recomendado para un articulo nuevo

1. Crear el borrador en `docs/clusters/<cluster>/`.
2. Usar el formato del convertidor existente si el cluster ya tiene script.
3. Confirmar que el slug no exista en `src/data/guides.ts`.
4. Delegar a Claude la escritura/optimizacion pesada con `scripts/ai-os/claude-guide-task.sh <slug> <brief.md>`.
5. Claude agrega imagenes en `public/images/...` o `public/guias/...` si corresponde, convierte/carga el articulo en `src/data/guides.ts` y respeta `docs/guias.md`, `docs/fichas.md` y la regla de honestidad.
6. Codex revisa el diff de Claude y hace una primera auditoria propia: enlaces internos, monetizacion, metadata, tokens de precio, voz, canibalizacion y riesgos de implementacion.
7. Claude o Codex consultan a Gemini con `scripts/ai-os/review-guide.sh <slug>` como auditor externo Google/SERP/AIO/multimedia.
8. Claude puede consultar a Codex en cualquier punto con `scripts/ai-os/ask-codex.sh review-guide <slug>` para pedir auditoria editorial/SEO/de repo sin que Codex escriba la guia completa.
9. Si Codex o Gemini proponen mejoras sensatas de SEO, conversion, datos, enlaces internos, multimedia, imagenes, OG/Pinterest o canibalizacion, Claude las aplica.
10. Claude vuelve a pedir auditoria externa despues del ajuste si hubo cambios relevantes.
11. Solo se puede pushear/publicar cuando Claude aplico los cambios, Gemini no marca bloqueantes y Codex coincide en que la guia esta lista para indexar.
12. Ejecutar:

```bash
npm run lint
npm run build
```

## Nota importante sobre Next.js

Este proyecto usa Next `16.2.3`. Antes de tocar rutas, metadata, rendering o convenciones de App Router, leer la guia relevante en `node_modules/next/dist/docs/`, como indica `AGENTS.md`.
