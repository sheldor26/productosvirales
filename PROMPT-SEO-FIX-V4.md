# Prompt: Fix SEO V4 — ProductosVirales (83 → 92/100)

Copiá este prompt en Claude de VS Code para ejecutar los fixes de la auditoría #5 (14 abril 2026).

---

## PROMPT

Necesito que ejecutes los fixes SEO críticos y de alta prioridad del ACTION-PLAN-2026-04-14.md. El sitio está en 83/100 y queremos llegar a 92/100 en 4 semanas.

**IMPORTANTE antes de empezar:**
1. Leé `AGENTS.md` y `GSAP_MIGRATION.md` antes de tocar código.
2. Leé la guía relevante de Next.js 16 en `node_modules/next/dist/docs/` antes de usar cualquier API nueva.
3. No toques nada que no esté listado abajo. El sitio ya funciona.
4. Después de cada paso corré `npm run build` para verificar que compila.
5. Al final hacé un commit descriptivo.

---

## PASO 1 [CRÍTICO]: Crear página /sobre-nosotros

**Por qué:** Post Google core update diciembre 2025, sitios de afiliados sin About page cayeron 71%. Es el fix de mayor impacto para E-E-A-T.

### 1.1 Crear `src/app/sobre-nosotros/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Somos ProductosVirales: un curador independiente de productos virales y trending de MercadoLibre Argentina. Conocé nuestra metodología, cómo ganamos dinero y por qué podés confiar en nuestras recomendaciones.",
  alternates: {
    canonical: "https://productosvirales.com.ar/sobre-nosotros",
  },
  openGraph: {
    title: "Sobre ProductosVirales — El curador independiente de MercadoLibre",
    description:
      "Conocé quiénes estamos detrás del sitio, nuestra metodología y cómo funcionamos.",
    url: "https://productosvirales.com.ar/sobre-nosotros",
  },
};

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Sobre ProductosVirales",
            url: "https://productosvirales.com.ar/sobre-nosotros",
            mainEntity: {
              "@type": "Organization",
              name: "ProductosVirales",
              url: "https://productosvirales.com.ar",
              description:
                "Curador independiente de productos virales y trending de MercadoLibre Argentina",
            },
          }),
        }}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Sobre ProductosVirales
      </h1>

      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        ProductosVirales.com.ar es un curador independiente de productos
        trending y virales disponibles en MercadoLibre Argentina. No vendemos
        nada. No somos una tienda. Somos la guía que te dice qué comprar, por
        qué, y si realmente vale la pena.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo seleccionamos los productos
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Revisamos cientos de productos en MercadoLibre Argentina cada semana.
        Priorizamos los que cumplen tres criterios: (1) alta rotación de ventas
        en el marketplace, (2) buena calidad-precio comparada con alternativas,
        y (3) vendedores con reputación sólida. Probamos muchos nosotros
        mismos y escribimos sobre lo que funciona.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo ganamos dinero (transparencia)
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Si comprás un producto usando nuestros links, MercadoLibre nos paga una
        pequeña comisión. Vos no pagás nada extra. Esa comisión no influye en
        nuestras recomendaciones: si un producto no nos convence, lo decimos,
        aunque podamos ganar plata vendiéndolo.
      </p>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Todas nuestras guías incluyen un disclosure visible cuando contienen
        links de afiliados.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Nuestro compromiso
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-base text-[var(--text-secondary)]">
        <li>No recomendamos productos que no compraríamos nosotros mismos.</li>
        <li>
          Actualizamos los precios y la información cada vez que detectamos
          cambios relevantes.
        </li>
        <li>
          Si nos equivocamos, corregimos. Las guías viejas se actualizan, no se
          esconden.
        </li>
        <li>
          No aceptamos pagos para rankear productos. Nuestras opiniones son
          independientes.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contacto
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        ¿Tenés una sugerencia, encontraste un error, o querés que revisemos un
        producto? Escribinos a{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--color-primary)]"
        >
          hola@productosvirales.com.ar
        </a>
        .
      </p>
    </div>
  );
}
```

### 1.2 Agregar link en el Footer

Buscá `src/components/layout/Footer.tsx` y agregá un link a `/sobre-nosotros`. Mantené el estilo existente.

### 1.3 Agregar a sitemap.ts

En `src/app/sitemap.ts`, agregá dentro del array `staticPages`:

```ts
{ url: `${SITE_URL}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.7 },
```

---

## PASO 2 [CRÍTICO]: Author como Person en guías

**Por qué:** Google valora autor como persona real para E-E-A-T. Actualmente es Organization, reduce señal de expertise.

En `src/app/guias/[slug]/page.tsx`, en el objeto `articleLd`, reemplazá el campo `author`:

```ts
author: {
  "@type": "Person",
  name: "Equipo ProductosVirales",
  url: "https://productosvirales.com.ar/sobre-nosotros",
},
```

**Nota:** Si preferís usar tu nombre real en lugar de "Equipo ProductosVirales", cambiá el `name`. Google premia nombres reales con huella digital (cuentas sociales enlazadas), pero el equipo como Person también funciona si mantenés la URL consistente.

---

## PASO 3 [CRÍTICO]: Páginas /privacy-policy y /terms

**Por qué:** Requisito legal para afiliados + señal de trust que Google pondera para E-E-A-T.

### 3.1 Crear `src/app/privacidad/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de ProductosVirales.com.ar. Qué datos recolectamos, cómo los usamos, y cuáles son tus derechos.",
  alternates: { canonical: "https://productosvirales.com.ar/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4 text-[var(--text-secondary)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Política de privacidad
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Última actualización: 14 de abril de 2026
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Quiénes somos
      </h2>
      <p>
        ProductosVirales.com.ar es un sitio de contenido editorial operado de
        forma independiente. Este documento explica cómo manejamos tus datos.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Datos que recolectamos
      </h2>
      <p>
        No te pedimos que crees una cuenta ni que nos des datos personales.
        Usamos Vercel Analytics para entender cómo se usa el sitio, que
        recolecta métricas anónimas (país, dispositivo, páginas visitadas). No
        usamos cookies de seguimiento cross-site.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Links de afiliados
      </h2>
      <p>
        Muchos links en el sitio son links de afiliado a MercadoLibre
        Argentina. Si hacés click y comprás, recibimos una comisión sin costo
        extra para vos. MercadoLibre puede setear sus propias cookies al
        recibir tu visita — su política se aplica una vez que salís de nuestro
        sitio.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Tus derechos
      </h2>
      <p>
        Tenés derecho a solicitar qué datos tenemos sobre vos (esencialmente
        ninguno) y a pedir que los borremos. Contactanos en{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--color-primary)]"
        >
          hola@productosvirales.com.ar
        </a>
        .
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cambios a esta política
      </h2>
      <p>
        Si cambiamos esta política, actualizamos la fecha arriba. No te
        notificamos activamente porque no tenemos tu email.
      </p>
    </div>
  );
}
```

### 3.2 Crear `src/app/terminos/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos de uso de ProductosVirales.com.ar. Condiciones bajo las cuales podés usar el sitio.",
  alternates: { canonical: "https://productosvirales.com.ar/terminos" },
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4 text-[var(--text-secondary)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Términos y condiciones
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Última actualización: 14 de abril de 2026
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Aceptación
      </h2>
      <p>
        Al usar ProductosVirales.com.ar aceptás estos términos. Si no estás de
        acuerdo, no uses el sitio.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contenido editorial
      </h2>
      <p>
        Nuestro contenido es editorial e informativo. Hacemos el mejor esfuerzo
        para que sea preciso y esté actualizado, pero no garantizamos que los
        precios, stocks o características sean exactos al momento de tu
        compra. La decisión de compra es tuya.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Links de afiliados
      </h2>
      <p>
        Ganamos comisión por ventas originadas en nuestros links. Esto no
        modifica el precio que pagás ni nuestras recomendaciones editoriales.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Responsabilidad
      </h2>
      <p>
        No somos responsables por las compras que hagas en MercadoLibre ni por
        la calidad, garantía o post-venta de los productos. La relación
        comercial es entre vos y el vendedor de MercadoLibre.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Propiedad intelectual
      </h2>
      <p>
        El contenido editorial es nuestro. Las imágenes de producto pertenecen
        a MercadoLibre y a sus respectivos vendedores y se usan bajo fair use
        editorial.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contacto
      </h2>
      <p>
        Para cualquier consulta: hola@productosvirales.com.ar
      </p>
    </div>
  );
}
```

### 3.3 Agregar ambas páginas al sitemap y footer

En `sitemap.ts`, agregar al array `staticPages`:

```ts
{ url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
{ url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
```

En el `Footer.tsx`, agregar links a ambas.

---

## PASO 4 [ALTO]: OG images únicas por guía

**Por qué:** +1-2 puntos SEO + mejora drásticamente el CTR de shares en redes.

### 4.1 Crear `src/app/guias/[slug]/opengraph-image.tsx`

```tsx
import { ImageResponse } from "next/og";
import { getPublishedGuides } from "@/data/guides";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getPublishedGuides().find((g) => g.slug === params.slug);
  if (!guide) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.9, fontWeight: 600 }}>
          ProductosVirales.com.ar
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
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

### 4.2 Actualizar `generateMetadata` de guías

En `src/app/guias/[slug]/page.tsx`, en el objeto de metadata retornado, ya no necesitás especificar `images` porque Next.js toma `opengraph-image.tsx` colocado en el mismo segmento automáticamente. **Eliminá** el bloque `images: [{ url: "/opengraph-image", ... }]` de `openGraph` y el `images: ["/opengraph-image"]` de `twitter`, o dejalos si querés fallback.

---

## PASO 5 [ALTO]: Fecha de actualización visible en guías

**Por qué:** Señal de freshness visible, +1 punto GEO.

En `src/components/guides/GuideRenderer.tsx`, debajo del H1 del guide, agregá:

```tsx
<p className="text-sm text-[var(--text-muted)] mt-2">
  Publicado el{" "}
  {new Date(guide.publishedDate).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
  {guide.updatedDate !== guide.publishedDate && (
    <>
      {" · Actualizado el "}
      {new Date(guide.updatedDate).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </>
  )}
</p>
```

---

## PASO 6 [ALTO]: CollectionPage + ItemList en categorías

**Por qué:** +2 puntos en schema + mejor rich results para listados.

En `src/app/categoria/[slug]/page.tsx`, después del script de BreadcrumbList existente, agregá un segundo script:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.h1 || category.name,
      description: category.description,
      url: `https://productosvirales.com.ar/categoria/${slug}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://productosvirales.com.ar/producto/${p.id}`,
          name: p.title,
        })),
      },
    }),
  }}
/>
```

---

## PASO 7 [ALTO]: Pre-renderizar TODOS los productos

**Por qué:** 109 productos, solo 50 están pre-renderizados. Los otros 59 dependen de SSR on-demand.

En `src/app/producto/[id]/page.tsx`, línea 12-17, cambiar:

```ts
export function generateStaticParams() {
  return curatedProducts
    .filter((p) => p.visibility !== "deprioritized")
    .slice(0, 50)
    .map((p) => ({ id: p.id }));
}
```

a:

```ts
export function generateStaticParams() {
  return curatedProducts
    .filter((p) => p.visibility !== "deprioritized")
    .map((p) => ({ id: p.id }));
}
```

(Eliminar el `.slice(0, 50)`.)

---

## PASO 8 [ALTO]: Expandir llms.txt

**Por qué:** AI search (ChatGPT, Perplexity) indexa este archivo para entender tu sitio.

Reemplazar `public/llms.txt` con:

```
# ProductosVirales.com.ar

## About
ProductosVirales is a curated product discovery platform for MercadoLibre Argentina. We showcase trending and viral products, publish buying guides with honest comparisons, and help Argentine consumers find the best deals on products that are popular on TikTok and social media.

## Content Types
- Product pages: Individual product reviews with prices, pros/cons, specs, and FAQ
- Buying guides: In-depth comparisons (e.g., "Best massagers in Argentina 2026")
- Category pages: Curated collections by category (Home, Kitchen, Beauty, Tech)
- Trending page: Products currently trending on MercadoLibre and TikTok

## Categories
- Hogar: https://productosvirales.com.ar/categoria/hogar
- Cocina: https://productosvirales.com.ar/categoria/cocina
- Tech: https://productosvirales.com.ar/categoria/tech
- Belleza: https://productosvirales.com.ar/categoria/belleza

## Key Guides
- Masajeadores: https://productosvirales.com.ar/guias/mejores-masajeadores-argentina
- Pavas eléctricas: https://productosvirales.com.ar/guias/pava-electrica-mercadolibre
- Dónde comprar masajeador: https://productosvirales.com.ar/guias/masajeador-donde-comprar-argentina

## Key Topics
- Viral products from TikTok and social media available on MercadoLibre Argentina
- Product comparisons with real prices in Argentine Pesos (ARS)
- Buying guides for Argentine consumers
- Trending deals and offers on MercadoLibre

## About Our Content
- All prices in ARS, updated regularly
- Honest reviews including cons, not just pros
- Affiliate disclosure on every guide (hasDisclosure)
- First-person experiential content (we test what we recommend)

## Language
Spanish (Argentina)

## Contact
Website: https://productosvirales.com.ar
Email: hola@productosvirales.com.ar
Sitemap: https://productosvirales.com.ar/sitemap.xml
```

---

## Verificación final

```bash
npm run build
```

Si compila:
1. `npm run dev`
2. Visitar:
   - `localhost:3000/sobre-nosotros` ✅
   - `localhost:3000/privacidad` ✅
   - `localhost:3000/terminos` ✅
   - `localhost:3000/categoria/hogar` → View Source → verificar CollectionPage + ItemList
   - `localhost:3000/guias/mejores-masajeadores-argentina` → verificar fecha visible + author Person
   - `localhost:3000/guias/mejores-masajeadores-argentina/opengraph-image` → debería renderizar OG dinámica

3. Commit:
```bash
git add -A
git commit -m "SEO v4: /sobre-nosotros, /privacidad, /terminos, author Person, OG per guide, CollectionPage schema, pre-render all products"
git push
```

4. Después del deploy, en Google Search Console → URL Inspection → solicitar indexación para:
   - /sobre-nosotros
   - /privacidad
   - /terminos
   - Las 4 categorías
   - Las 13 guías

---

## Lo que NO hay que tocar

- robots.ts ✅
- sitemap.ts (solo agregar 3 URLs nuevas)
- page.tsx (home) ✅
- trending/page.tsx ✅
- layout.tsx ✅
- next.config.ts ✅
- opengraph-image.tsx (root, el default) ✅
- Todo el contenido de guías y productos ✅

## Resumen

| Paso | Prioridad | Archivo | Impacto |
|------|-----------|---------|---------|
| 1 | 🔴 | `src/app/sobre-nosotros/page.tsx` + Footer + sitemap | +3-5 |
| 2 | 🔴 | `src/app/guias/[slug]/page.tsx` (author) | +2-3 |
| 3 | 🔴 | `src/app/privacidad/`, `src/app/terminos/` + Footer + sitemap | +2 |
| 4 | 🟠 | `src/app/guias/[slug]/opengraph-image.tsx` | +1-2 |
| 5 | 🟠 | `src/components/guides/GuideRenderer.tsx` | +1 |
| 6 | 🟠 | `src/app/categoria/[slug]/page.tsx` | +2 |
| 7 | 🟠 | `src/app/producto/[id]/page.tsx` | +2 |
| 8 | 🟠 | `public/llms.txt` | +1 |

**Total: 8 pasos, score esperado 83 → 92+ / 100.**
