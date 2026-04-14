# Prompt: Fix SEO restante — ProductosVirales (v3)

Copiá este prompt en Claude de VS Code para ejecutar todos los fixes pendientes.

---

## PROMPT

Necesito que soluciones los problemas SEO pendientes de mi proyecto Next.js (productosvirales.com.ar). **Leé AGENTS.md y GSAP_MIGRATION.md antes de tocar código.** Leé la guía de Next.js en `node_modules/next/dist/docs/` antes de usar cualquier API de Next.js.

**CONTEXTO:** El sitio ya tiene un SEO Health Score de 72/100. El sitemap está registrado en Google Search Console (80 páginas descubiertas, status Success). El último commit bueno es `94ed6ff` ("SEO fixes: schemas, sitemap, OG image, HSTS, llms.txt"). El working directory tiene archivos truncados que hay que restaurar primero.

**IMPORTANTE:** Primero restaurá los archivos truncados desde git, verificá que compile, y después hacé los fixes SEO restantes. Al final, corré `npm run build` y verificá que compile limpio.

---

## PASO 0: Restaurar archivos truncados del working directory

Hay 14 archivos con cambios no commiteados que los truncaron. El commit `94ed6ff` tiene todo correcto. Restaurá ejecutando:

```bash
git checkout HEAD -- next.config.ts src/app/layout.tsx src/app/page.tsx src/app/trending/page.tsx "src/app/categoria/[slug]/page.tsx" "src/app/producto/[id]/page.tsx" src/app/guias/page.tsx "src/app/guias/[slug]/page.tsx" src/app/sitemap.ts src/data/curated-products.ts src/data/guides.ts src/components/products/ProductCard.tsx src/components/products/ProductDetail.tsx
```

Verificá que `npm run build` pase limpio antes de continuar. Si no compila, **no sigas** — primero arreglá lo que falle.

---

## PASO 1: Agregar contenido editorial a páginas de categoría (ANTI THIN CONTENT)

Las 4 páginas de categoría (`src/app/categoria/[slug]/page.tsx`) son thin content: solo tienen H1 + descripción corta + grid de productos. Google penaliza esto, especialmente para sitios de afiliados después del core update de diciembre 2025.

Necesitás agregar **un bloque de contenido editorial de 200+ palabras** (buyer's guide) debajo del hero de cada categoría y antes del grid de productos. Este contenido tiene que ser único por categoría.

### Opción A: Contenido dinámico desde datos (RECOMENDADA)

1. Agregá un campo `buyersGuide` al tipo `Category` en `src/lib/types.ts`:

```ts
buyersGuide?: string; // HTML string con contenido editorial
```

2. Agregá el contenido en `src/data/categories.ts` para cada categoría no especial. Escribí contenido real, útil para el comprador argentino, en español. Incluí:
   - Qué tipo de productos encontrás en esta categoría
   - Qué mirar antes de comprar (criterios de compra)
   - Rangos de precios típicos en Argentina
   - Por qué estos productos están en tendencia

**Contenido requerido por categoría:**

- **Hogar** (~250 palabras): Cubrir organización del hogar, limpieza inteligente, electrodomésticos compactos. Mencionar que los productos virales de hogar suelen resolver problemas cotidianos de forma ingeniosa. Tips para elegir entre opciones similares.

- **Cocina** (~250 palabras): Cubrir pavas eléctricas, sartenes antiadherentes, gadgets de cocina. Mencionar la tendencia de TikTok de gadgets de cocina que simplifican recetas. Qué materiales buscar, garantías.

- **Tech** (~250 palabras): Cubrir proyectores portátiles, gadgets USB, auriculares, accesorios. Mencionar la importancia de verificar compatibilidad y garantía en MercadoLibre. Diferencia entre productos premium y alternativas económicas.

- **Belleza** (~250 palabras): Cubrir skincare devices, masajeadores faciales, herramientas de cuidado personal. Mencionar la influencia de TikTok en tendencias de belleza en Argentina. Qué certificaciones buscar.

3. Renderizá el contenido en `src/app/categoria/[slug]/page.tsx`:

Después del div del hero (el que tiene el H1 y la descripción) y antes del `<ProductGrid>`, agregá:

```tsx
{category.buyersGuide && (
  <section className="prose prose-sm max-w-none text-[var(--text-secondary)]">
    <div dangerouslySetInnerHTML={{ __html: category.buyersGuide }} />
  </section>
)}
```

**NOTA:** Si el proyecto no tiene Tailwind Typography plugin (`@tailwindcss/typography`), usá clases manuales en lugar de `prose`:

```tsx
{category.buyersGuide && (
  <section className="max-w-none text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3">
    <div dangerouslySetInnerHTML={{ __html: category.buyersGuide }} />
  </section>
)}
```

---

## PASO 2: Agregar BreadcrumbList JSON-LD a Trending

En `src/app/trending/page.tsx`, agregar un BreadcrumbList schema en el JSX, justo después del `<div>` raíz de apertura:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://productosvirales.com.ar",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Trending",
          item: "https://productosvirales.com.ar/trending",
        },
      ],
    }),
  }}
/>
```

---

## PASO 3: Agregar Content-Security-Policy header

En `next.config.ts`, dentro del array de headers (la función `async headers()`), agregar el header CSP. El valor debe permitir los recursos que Next.js necesita:

```ts
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.mlstatic.com https://http2.mlstatic.com; font-src 'self' data:; connect-src 'self' https://*.mercadolibre.com.ar; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
},
```

**IMPORTANTE:** Después de agregar este header, verificá que `npm run build` pase y que el sitio funcione correctamente en `npm run dev`. Si algo se rompe por CSP, ajustá los valores (puede que necesites agregar dominios adicionales a img-src o script-src).

---

## PASO 4: Verificación final

```bash
npm run build
```

Si el build pasa limpio, verificá manualmente con `npm run dev`:

1. `localhost:3000` — verificar que carga sin errores de CSP en la consola del browser
2. `localhost:3000/trending` — verificar BreadcrumbList en View Source (buscar `"@type":"BreadcrumbList"`)
3. `localhost:3000/categoria/hogar` — verificar que aparece el contenido editorial del buyer's guide
4. `localhost:3000/categoria/cocina` — idem
5. `localhost:3000/categoria/tech` — idem
6. `localhost:3000/categoria/belleza` — idem
7. Verificar que las imágenes de MercadoLibre cargan correctamente (CSP no las bloquea)

Cuando todo compile y funcione, hacé un commit con mensaje descriptivo.

---

## Resumen de archivos a tocar

| # | Archivo | Acción |
|---|---------|--------|
| 0 | 13 archivos | `git checkout HEAD --` para restaurar truncados |
| 1a | `src/lib/types.ts` | Agregar campo `buyersGuide` a `Category` |
| 1b | `src/data/categories.ts` | Agregar contenido editorial (~250 palabras × 4 categorías) |
| 1c | `src/app/categoria/[slug]/page.tsx` | Renderizar buyer's guide |
| 2 | `src/app/trending/page.tsx` | Agregar BreadcrumbList JSON-LD |
| 3 | `next.config.ts` | Agregar Content-Security-Policy header |
| 4 | — | Build verification |

**Total: 6 archivos a modificar, 5 pasos.**

---

## Lo que NO hay que tocar (ya está resuelto)

- ✅ robots.ts — perfecto
- ✅ sitemap.ts — perfecto, /guias incluida, lastModified solo en guías reales
- ✅ Organization schema con logo — en page.tsx
- ✅ WebSite schema con SearchAction — en page.tsx
- ✅ Product schema con sku/brand/seller — en producto/[id]/page.tsx
- ✅ Article schema con image — en guias/[slug]/page.tsx
- ✅ BreadcrumbList en categorías, productos y guías
- ✅ OG images dinámicas — opengraph-image.tsx
- ✅ llms.txt — en /public/
- ✅ HSTS + security headers — en next.config.ts
- ✅ Sitemap registrado en Google Search Console (80 páginas, Success)

## Backlog (no hacer ahora, baja prioridad)

- PWA manifest (cuando se necesite)
- sameAs en Organization (cuando tengas redes sociales)
- Author como Person en guías (cuando tengas perfiles de autor)
