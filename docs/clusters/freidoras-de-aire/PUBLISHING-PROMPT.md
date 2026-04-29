# Prompt para Claude Code (VS Code) — Publicación del cluster freidoras de aire

Pegá este prompt en Claude Code para que actualice las fechas de publicación de los 23 artículos y te explique cómo manejar las imágenes.

---

## PROMPT (copiar desde acá)

```
Tengo un cluster de contenido SEO de 23 artículos sobre freidoras de aire en:
/cluster-freidoras-de-aire/

Los artículos están en cuatro carpetas:
- pilar/ (1 artículo)
- reviews/ (9 artículos)
- comparativas/ (6 artículos)
- informacionales/ (7 artículos)

Publicamos 2 artículos por semana: miércoles y sábados.
El primero se publica HOY: miércoles 15 de abril de 2026.
El último se publica el miércoles 2 de julio de 2026.
Total: 11 semanas para completar el cluster.

## Tarea 1: actualizar fechas de publicación en el frontmatter

Cada artículo tiene en su frontmatter:
  publishDate: "2026-04-15"
  lastModified: "2026-04-15"

Actualizá el `publishDate` Y el `lastModified` de cada archivo según el calendario abajo.

## Calendario de publicación

| # | Día | Fecha | Artículo |
|---|-----|-------|---------|
| 1 | Miércoles | 2026-04-15 | pilar/mejores-freidoras-de-aire-argentina.md |
| 2 | Sábado | 2026-04-18 | reviews/atma-freidoras-de-aire-review.md |
| 3 | Miércoles | 2026-04-22 | reviews/peabody-freidoras-de-aire-review.md |
| 4 | Sábado | 2026-04-25 | informacionales/recetas-freidora-de-aire.md |
| 5 | Miércoles | 2026-04-29 | reviews/philips-freidoras-de-aire-review.md |
| 6 | Sábado | 2026-05-02 | informacionales/accesorios-para-freidora-de-aire.md |
| 7 | Miércoles | 2026-05-06 | reviews/oster-freidoras-de-aire-review.md |
| 8 | Sábado | 2026-05-09 | comparativas/atma-vs-peabody-freidora-de-aire.md |
| 9 | Miércoles | 2026-05-13 | informacionales/como-usar-una-freidora-de-aire.md |
| 10 | Sábado | 2026-05-16 | reviews/gadnic-freidora-review.md |
| 11 | Miércoles | 2026-05-20 | reviews/kanji-home-freidora-review.md |
| 12 | Sábado | 2026-05-23 | reviews/ninja-crispi-review.md |
| 13 | Miércoles | 2026-05-27 | comparativas/ninja-vs-philips-freidora-de-aire.md |
| 14 | Sábado | 2026-05-30 | comparativas/mejores-freidoras-de-aire-doble-canasta.md |
| 15 | Miércoles | 2026-06-03 | comparativas/freidoras-de-aire-con-grill-argentina.md |
| 16 | Sábado | 2026-06-07 | comparativas/mejores-freidoras-de-aire-economicas-argentina.md |
| 17 | Miércoles | 2026-06-11 | comparativas/freidoras-de-aire-gran-capacidad.md |
| 18 | Sábado | 2026-06-14 | informacionales/cuanto-consume-freidora-de-aire.md |
| 19 | Miércoles | 2026-06-18 | informacionales/freidora-de-aire-vs-horno.md |
| 20 | Sábado | 2026-06-21 | informacionales/vale-la-pena-comprar-freidora-de-aire.md |
| 21 | Miércoles | 2026-06-25 | reviews/powerxl-freidora-review.md |
| 22 | Sábado | 2026-06-28 | reviews/suono-airfryer-review.md |
| 23 | Miércoles | 2026-07-02 | informacionales/freidora-de-aire-desventajas.md |

## Tarea 2: instrucciones para las imágenes de productos

Las imágenes de los 20 productos deben copiarse en:
  /public/images/freidoras/

Hay un README en esa carpeta con los nombres exactos que debe tener cada archivo.
Los nombres siguen el formato: [marca]-[modelo-slug].webp

Ejemplos:
  - Foto de la Atma FR248ABP → atma-fr248abp-8l.webp
  - Foto de la Peabody PE-AFD720N → peabody-pe-afd720n-visor.webp

Pasos para las imágenes:
1. Abrí el archivo /public/images/freidoras/README.md para ver la tabla completa de nombres
2. Renombrá cada foto del producto con el nombre exacto de la tabla
3. Convertí las fotos a WebP si todavía están en JPG o PNG:
   cwebp -q 85 foto.jpg -o nombre-correcto.webp
4. Redimensioná a 800×800px si es necesario:
   convert foto.jpg -resize 800x800^ -gravity center -extent 800x800 nombre-correcto.webp
5. Copiá todos los .webp a /public/images/freidoras/

Una vez en su lugar, los artículos las muestran automáticamente porque las rutas
ya están cargadas en el frontmatter de cada artículo.

## Tarea 3: verificar que el artículo de HOY esté listo para publicar

El artículo que sale HOY es:
  pilar/mejores-freidoras-de-aire-argentina.md

Verificá:
- publishDate = 2026-04-15
- La imagen featuredImage referenciada existe en /public/images/freidoras/
- Los links internos apuntan a rutas válidas
- El slug coincide con la URL canónica del frontmatter

Reportame cualquier problema antes de publicar.
```

---

## Notas para el desarrollador

### Lógica de publicación condicional

Si tu sistema usa Next.js, Astro u otro framework, filtrá por `publishDate` para que solo aparezcan los artículos ya publicados:

```js
// Next.js / Astro
const today = new Date().toISOString().split('T')[0]
const published = allPosts.filter(post => post.publishDate <= today)
```

### GitHub Action — deploy automático miércoles y sábados

```yaml
# .github/workflows/cluster-publish.yml
name: Publicar cluster freidoras
on:
  schedule:
    - cron: '0 12 * * 3'  # Miércoles 12:00 UTC = 09:00 Argentina
    - cron: '0 12 * * 6'  # Sábados   12:00 UTC = 09:00 Argentina
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build && npm run deploy
```

### Dónde bajar las imágenes de Mercado Libre

Todos los IDs (MLA) están en `/cluster-freidoras-de-aire/INTERNAL-LINKING-MAP.md`.
Para cada producto: entrá a `mercadolibre.com.ar/p/MLA[ID]`, click derecho en la imagen principal → Guardar imagen.

### Por qué este orden de publicación

- **Pilar primero** — establece la estructura del cluster para Google desde el día 1
- **Atma y Peabody inmediato** — son las reviews con más volumen (18K y 8K/mes), interesa rankearlas rápido
- **Recetas y Accesorios temprano** — capturan tráfico informacional mientras las reviews maduran
- **Comparativas en la segunda mitad** — se publican cuando las reviews ya están indexadas y los links internos tienen destino real
- **PowerXL, Suono y Desventajas al final** — menor volumen, refuerzan autoridad temática pero no son urgentes
