# Workflow para crear nuevos articulos

Este proyecto publica articulos desde `src/data/guides.ts`. Los Markdown en `docs/clusters/` funcionan como fuente editorial o borrador, pero el sitio no los lee directamente en runtime.

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

## Flujo recomendado para un articulo nuevo

1. Crear el borrador en `docs/clusters/<cluster>/`.
2. Usar el formato del convertidor existente si el cluster ya tiene script.
3. Confirmar que el slug no exista en `src/data/guides.ts`.
4. Agregar imagenes en `public/images/...` si corresponde.
5. Convertir o copiar el articulo a un objeto `Guide`.
6. Revisar enlaces internos: todo `/guias/...` debe apuntar a un slug existente o a un articulo planificado.
7. Ejecutar:

```bash
npm run lint
npm run build
```

## Nota importante sobre Next.js

Este proyecto usa Next `16.2.3`. Antes de tocar rutas, metadata, rendering o convenciones de App Router, leer la guia relevante en `node_modules/next/dist/docs/`, como indica `AGENTS.md`.

