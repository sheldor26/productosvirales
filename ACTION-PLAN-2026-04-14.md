# Action Plan — productosvirales.com.ar
**Score actual:** 83/100 → **Meta 4 semanas:** 92/100

Prioridades: **Crítico** (esta semana) > **Alto** (2 semanas) > **Medio** (1 mes) > **Bajo** (backlog)

---

## 🔴 CRÍTICO (hacer esta semana)

### 1. Crear página /sobre-nosotros
**Impacto:** +3-5 puntos. Crítico post-update diciembre 2025 (E-E-A-T).

**Acción:** Crear `src/app/sobre-nosotros/page.tsx` con:
- Quién está detrás del sitio (nombre real o pseudónimo consistente)
- Por qué existe ProductosVirales
- Metodología de selección de productos
- Disclosure de afiliados (transparencia)
- Cómo contactar

Agregar link en footer + en sitemap.ts (static page, priority 0.7).

### 2. Crear /privacy-policy y /terms
**Impacto:** +2 puntos. Requisito legal para sitios afiliados + señal de trust.

**Acción:** Usar un generador (termly.io, privacypolicygenerator.info). Agregar al footer y al sitemap.

### 3. Cambiar Author de Organization a Person en guías
**Impacto:** +2-3 puntos en E-E-A-T y rich results.

**Acción:** En `src/app/guias/[slug]/page.tsx`, modificar el `articleLd`:

```ts
author: {
  "@type": "Person",
  name: "Tu Nombre Real",
  url: "https://productosvirales.com.ar/sobre-nosotros",
  // opcional pero ideal:
  sameAs: [
    "https://twitter.com/tu_handle",
    "https://linkedin.com/in/tu_perfil"
  ]
}
```

---

## 🟠 ALTO (próximas 2 semanas)

### 4. Generar OG images únicas por guía
**Impacto:** +1-2 puntos + mejora drásticamente CTR de shares en redes.

**Acción:** Crear `src/app/guias/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { getPublishedGuides } from "@/data/guides";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const guide = getPublishedGuides().find(g => g.slug === params.slug);
  if (!guide) return new Response("Not found", { status: 404 });
  
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "linear-gradient(135deg, #f97316, #ec4899)",
        color: "white",
        fontFamily: "sans-serif"
      }}>
        <div style={{ fontSize: 32, opacity: 0.9 }}>ProductosVirales.com.ar</div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
          {guide.ogTitle || guide.title}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>
          Guía actualizada · {guide.updatedDate}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

Actualizar `openGraph.images` y `twitter.images` en generateMetadata para que apunten a la ruta local dinámica.

### 5. Mostrar fecha de última actualización visible en guías
**Impacto:** +1 punto GEO + señal de freshness para Google.

**Acción:** En `GuideRenderer.tsx`, agregar debajo del H1:

```tsx
<p className="text-sm text-[var(--text-muted)] mt-2">
  Publicado el {formatDate(guide.publishedDate)} · 
  Actualizado el {formatDate(guide.updatedDate)}
</p>
```

### 6. Agregar CollectionPage + ItemList en categorías
**Impacto:** +2 puntos schema + mejor rich results.

**Acción:** En `src/app/categoria/[slug]/page.tsx`, agregar un segundo JSON-LD:

```ts
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: category.h1,
  description: category.description,
  url: `https://productosvirales.com.ar/categoria/${slug}`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://productosvirales.com.ar/producto/${p.id}`,
      name: p.title
    }))
  }
}
```

### 7. Remover límite de 50 en generateStaticParams de productos
**Impacto:** +2 puntos indexación + performance.

**Acción:** En `src/app/producto/[id]/page.tsx`, línea 13-17. Actualmente:
```ts
.slice(0, 50)
```
Cambiar a pre-renderizar todos los no-deprioritized, o aumentar a 150. Con 109 productos, es trivial pre-renderizar todos.

### 8. Primera guía nueva de contenido (cluster vacío)
**Impacto:** +1 punto contenido + traction keyword.

**Acción:** Crear "Mejores proyectores portátiles en MercadoLibre 2026" (cluster tech). Seguir template de las guías de pavas (2000+ palabras, FAQ, tabla comparativa, 3-5 productos enlazados).

---

## 🟡 MEDIO (próximo mes)

### 9. Completar Organization.sameAs con redes sociales
Cuando crees cuentas de Instagram / Twitter para el sitio, agregarlas a `sameAs` en el Organization schema en `page.tsx`.

### 10. Agregar priceValidUntil en Product.offers
**Impacto:** Mejora Merchant Center eligibility.

Por ejemplo `priceValidUntil: new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10)` (precio válido 7 días).

### 11. Expandir llms.txt con el inventario actual
Agregar sección "Guías publicadas" con slugs, y sección "Categorías" con URLs canonical.

### 12. Crear 3 guías más en clusters vacíos
- Tech: "Mejores auriculares bluetooth MercadoLibre"
- Belleza: "Masajeador facial: cuál comprar en Argentina"
- Hogar: "Aspiradora robot: cuál comprar en MercadoLibre"

### 13. Crear sección /comparar
Primera comparativa: "Pava Philips vs Atma" — Consolidar contenido ya escrito en las guías individuales.

### 14. H1 audit en homepage
Verificar en `<HeroBanner>` que haya un H1 real y semántico, con keyword primaria.

### 15. Breadcrumbs visuales en UI
Agregar componente `<Breadcrumbs>` que renderice visualmente (arriba del H1) lo que ya tenés en JSON-LD. Mejora UX y refuerza el schema.

---

## 🔵 BAJO (backlog)

### 16. PWA manifest (`manifest.json`)
Para instalación como app. Impacto SEO mínimo pero mejora engagement.

### 17. Imágenes originales en guías
Fotografiar productos que efectivamente tenés en casa. Refuerza E-E-A-T (Experience). Costoso en tiempo, alta recompensa a largo plazo.

### 18. Review schema en productos
Cuando habilites reviews de usuarios, agregar AggregateRating y Review schema.

### 19. Hreflang si agregás ES-ES
Solo aplica si expandís a otros mercados hispanos.

### 20. Service Worker para offline
Mejora performance y PWA score.

---

## Resumen de esfuerzo

| Prioridad | # tasks | Tiempo estimado | Impacto en score |
|-----------|---------|-----------------|-------------------|
| Crítico (1-3) | 3 | 4-6 horas | +7-10 puntos |
| Alto (4-8) | 5 | 8-12 horas | +6-8 puntos |
| Medio (9-15) | 7 | 15-20 horas | +3-5 puntos |
| Bajo (16-20) | 5 | variable | +1-2 puntos |

**Proyección a 4 semanas (crítico + alto completos):** **92/100** 🎯

**Próxima auditoría sugerida:** una vez completados los items críticos 1-3, idealmente en 7-10 días.

---

## Wins que no necesitan código (hacerlos hoy)

1. **Indexing API push:** En GSC → URL Inspection → solicitar indexación manual para las 13 guías y 4 categorías principales.
2. **Redes sociales:** Crear cuentas Instagram + TikTok + Twitter (consistent handle `@productosvirales`). Esto desbloquea `sameAs` en Organization.
3. **Primera participación en Reddit:** r/argentina — responder a una pregunta "qué comprar" con link genuino a tu guía.
4. **Analizar competencia real:** usar Google Search Console Performance (3 meses después de indexación) para ver qué queries te traen impresiones.
