---
name: new-post
description: Receta operativa para crear una guía nueva en productosvirales siguiendo el Master Structure. Usala cuando Juan pida "creá un post sobre X" o "armemos una guía nueva sobre Y".
---

# Receta para crear un post nuevo

Aplicable cuando Juan pide: "creá un post sobre X", "armemos una guía sobre Y", "vamos por el siguiente cluster", etc.

## 0. Antes de tocar nada

1. Leer [POST_MASTER_STRUCTURE.md](../../docs/POST_MASTER_STRUCTURE.md). Es la biblia editorial — sin eso, este skill no sirve.
2. Leer [CLAUDE.md](../../CLAUDE.md) (reglas core) y [ARCHITECTURE.md](../../ARCHITECTURE.md) (estructura técnica).
3. Confirmar con Juan los datos mínimos:
   - **Query principal** (la que querés rankear).
   - **Tipo de post** (ranking / review / comparativa / informacional).
   - **MLA IDs** de los productos que van a aparecer.
   - **Cluster** donde encaja (freidoras, pavas, masajeadores, perfumes-arabes, o nuevo).
4. Buscar en [CURRENT_STATE.md](../../CURRENT_STATE.md) si la guía o algo cercano ya existe.

## 1. Importar los productos

Para cada MLA ID que mencione el post:

1. Verificar si ya está en `src/data/curated-products.ts` con `grep -n "MLA<ID>" src/data/curated-products.ts`.
2. Si NO está:
   - Usar `scripts/ml-product-importer.ts` (ver README del proyecto).
   - Para clusters específicos puede haber scripts dedicados (`import-perfumes.cjs`, etc.).
   - Verificar que el producto importado trae: `image`, `images[]`, `price`, `rating`, `reviewCount`, `description`, `permalink`, `affiliateUrl`.
3. Si el producto importado tiene `seoTitle`, `metaDescription`, `articleBody` débiles, mejorarlos siguiendo las reglas del Master Structure sección 2.

Reportar a Juan: cuántos productos se importaron, cuántos ya existían.

## 2. Elegir el esqueleto

Según el tipo de post, abrir la sección 3 del Master Structure y usar el esqueleto correspondiente:
- Ranking top-N → patrón base (rankings)
- Review individual → patrón base (review)
- Comparativa A vs B → patrón base (comparativa)
- Informacional → patrón base (informacional)

NO inventar estructuras nuevas sin avisar. Si el post no encaja en ninguno, hablarlo con Juan antes.

## 3. Llenar metadata siguiendo el checklist

Tomar la sección 2 del Master Structure y completar **antes** de escribir el cuerpo:

```ts
{
  slug: "<kebab-case-en-español-sin-tildes>",
  category: "<cluster>",
  title: "<lo-que-ve-el-usuario>",
  seoTitle: "<≤60 chars, con keyword + año + Argentina>",
  metaDescription: "<150-160 chars, con nombre propio y CTA implícito>",
  ogTitle: "<distinto al seoTitle, gancho emocional>",
  ogDescription: "<distinto al meta, más emocional>",
  h1: "<largo descriptivo con número y año>",
  publishedDate: "<hoy o fecha futura>",
  updatedDate: "<igual a publishedDate al crear>",
  hasDisclosure: true,
  quickPicks: [ /* obligatorio en rankings y comparativas */ ],
  intro: [ /* 2-3 párrafos */ ],
  sections: [ /* siguiendo el esqueleto */ ],
  faq: [ /* 4-7 entradas long-tail */ ],
  internalLinks: [ /* 3-7 guías relacionadas del cluster */ ]
}
```

Validar contra el "Checklist anti-error en metadata" del Master Structure.

## 4. Escribir el cuerpo con psicología aplicada

Durante la redacción, marcar mentalmente **al menos 3 trucos psicológicos diferentes** de la sección 4 del Master Structure. Ejemplos típicos por tipo:

- **Ranking**: anchoring (precio premium) + social proof estratificado (top 3) + identification language (frases AR) + pull-quote en el #1.
- **Review individual**: authority through honesty (pros/cons) + specificity bias (números reales) + comparison framing (vs competencia).
- **Comparativa**: respuesta directa arriba (featured snippet) + tabla comparativa + identification language + "para quién es cada una".
- **Informacional**: respuesta directa arriba + loss aversion suave (errores comunes) + 2-3 product-cards al final.

**Regla 1**: cada vez que aparezca un nombre de producto en el cuerpo, debe haber un link inline o un product-card cerca. Sin excepciones.

**Regla 2 (CRÍTICA)**: el link SIEMPRE va a la ficha interna del producto, NUNCA al afiliado de MercadoLibre desde un párrafo. Usar formato canónico `/producto/<slug-titulo>-<mla-id-en-minúscula>` (no `/producto/MLA<ID>` legacy). El componente `product-card` lo hace bien automáticamente vía `productMlaId`. Ver sección 4.9 del Master Structure para el detalle completo y los porqués.

## 5. Imágenes

Seguir la sección 5 del Master Structure.

- Hero arriba: sacar de `curated-products.ts` (campo `image` del producto principal).
- Si el cluster tiene `/public/images/<cluster>/`, preferir esas si existen.
- `alt` obligatorio en todas, descriptivo (incluir marca + modelo).
- Mínimo 1 imagen cada 600-800 palabras.

## 6. Enlaces internos

Antes de cerrar:

- Mínimo 3 referencias inline en el cuerpo a otras guías del cluster.
- Bloque `internalLinks` al final con 3-7 entradas + `internalLinksTitle: "Guías relacionadas"`.
- Cualquier `/guias/<slug>` mencionada debe **existir** o estar planeada (chequear con `grep`).
- Si el post crea un nuevo "destino" que otras guías deberían linkear, anotarlo a Juan para que en la próxima ronda se agreguen.

## 7. JSON-LD / Schema (automático)

El renderer del proyecto agrega automáticamente:
- `Article` schema con `datePublished`, `dateModified`, `author`.
- `FAQPage` schema si la guía tiene `faq[]`.

No hay que escribirlo a mano. Verificar que `faq` esté en el formato correcto.

## 8. Validación final

```bash
npm run lint   # solo errores NUEVOS cuentan
npm run build  # debe pasar
npm run dev    # abrir /guias/<slug-nuevo> y revisar visualmente
```

Checklist visual en dev:
- [ ] Hero se ve OK (no truncado, alt correcto).
- [ ] Quick picks se ven arriba (si aplica).
- [ ] Todos los product-cards renderizan (no muestran "producto no encontrado").
- [ ] Pull-quotes con atribución se ven OK.
- [ ] FAQ se renderiza al final.
- [ ] Internal links se ven al pie.
- [ ] Mobile no rompe.
- [ ] Dark mode no rompe.

## 9. Cerrar la sesión

- Actualizar [CURRENT_STATE.md](../../CURRENT_STATE.md): qué guía se publicó, en qué cluster, cuántas guías quedan en el cluster.
- Si el post enlaza a guías que **todavía no existen**: agregar entrada en `docs/clusters/<cluster>/NEXT_ARTICLES.md` (o crear el archivo si no existe) con la guía planeada.
- Si descubriste un patrón nuevo que funcionó bien → entrada en [LEARNINGS.md](../../LEARNINGS.md).
- Si algo se complicó → entrada en [MISTAKES.md](../../MISTAKES.md).
- Mostrar el diff a Juan. **No commitear sin pedirlo.**

## Anti-patterns (no hacer)

- ❌ Empezar a escribir sin tener los productos importados primero (las imágenes y datos quedan colgando).
- ❌ Saltarse el Master Structure "porque este post es distinto". Si es realmente distinto, hablarlo antes.
- ❌ Copiar y modificar una guía existente sin reescribir la parte editorial. Google detecta el contenido duplicado dentro del mismo dominio.
- ❌ Inventar reviews, ratings o números. Si no los tenés del catálogo, no los pongas.
- ❌ Llenar de keywords. Una keyword bien usada > diez forzadas.
- ❌ Publicar sin probar visualmente en `dev`.
