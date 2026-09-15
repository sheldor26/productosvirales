# guias.md — Sistema de diseño y plantilla oficial de las guías

> **Plantilla VISUAL y ESTRUCTURAL oficial de TODAS las guías de ProductosVirales.**
> Toda guía nueva —y las que se rehagan— sigue este diseño. Sin excepciones salvo que Juan lo pida explícito.
> Validado y refinado con auditoría CRO/SEO/UX/copy sobre el pilar `pava-electrica` (jun 2026).
>
> Complementa, no reemplaza:
> - [`ARTICLE_CREATION_WORKFLOW.md`](ARTICLE_CREATION_WORKFLOW.md) → cómo se guarda técnicamente (objeto `Guide`).
> - [`POST_MASTER_STRUCTURE.md`](POST_MASTER_STRUCTURE.md) → psicología y copy editorial.
> - **`guias.md` (este)** → cómo se ve, qué bloques lleva y cómo convierte.
>
> **Referencia visual maestra (renderizable):** `docs/clusters/pavas-electricas/preview-pava-electrica-v3-CRO.html`. Ese archivo es la verdad del diseño; las versiones v1/v2 quedaron obsoletas.

---

## 1. Principios de diseño

1. **La guía ES un embudo de conversión.** Lo único que monetiza es el click al botón de afiliado de MercadoLibre. **Regla de oro: el ojo del lector tiene que terminar SOLO en el botón.** Todo lo que compita visualmente con el botón es un defecto a corregir.
2. **Estilo "best of" tipo TechRadar, adaptado a la marca.** Limpio, escaneable. El lector decide en 10 segundos (caja de arriba) o lee todo (cuerpo).
3. **Datos siempre reales.** Precios verificados por la API oficial de ML, ratings y reseñas reales. Nada inventado.
4. **Honestidad como diferenciador y como conversión.** Cada producto lleva contras reales; las citas son textuales con fuente. La honestidad genera la confianza que destraba el click.
5. **NO usar fotos de compradores** (derechos del autor). Solo imágenes del listado oficial.

---

## 2. Reglas de conversión / CTA (lo más importante)

Salen de la auditoría CRO/UX/copy de jun 2026. Son obligatorias.

1. **El amarillo ML (`#FFE600`) es EXCLUSIVO del botón de compra.** Ningún otro elemento de la página puede ser amarillo ni ámbar: las estrellas van en dorado apagado (`#A8842E`), los badges en pasteles desaturados o gris, el chip de categoría en gris. Si el amarillo aparece en 15 lugares, deja de señalar "acá se hace clic".
2. **Un solo CTA dominante por bloque.** El producto #1 lleva el botón amarillo lleno; los demás, **botón secundario neutro** (`.ghost`: fondo blanco, borde gris, texto negro). Nada de 4 botones amarillos iguales (parálisis de decisión / ley de Hick).
3. **Precio adentro del botón** siempre que se conozca: "Comprar a $45.900 →" / "Ver a $45.900 →". Mata la duda "¿cuánto sale?" justo antes del click.
4. **Verbo de acción.** CTA primario: **"Comprar en MercadoLibre →"**. Secundarios: "Ver a $X →". Nunca "ML" abreviado: siempre **"MercadoLibre"** completo (reconocimiento + confianza).
5. **Unidad precio→botón aislada.** La fila de compra contiene SOLO precio + botón, con aire alrededor. El link "ver ficha y opiniones" va **debajo, chico y gris** — nunca al lado del botón (es una fuga del embudo).
6. **Siempre un botón a la vista.** CTA arriba (above the fold, antes de la intro larga) + repetición a lo largo del scroll + **barra sticky de compra en mobile** (precio + botón, mínimo 44px de alto, solo celular). El lector nunca debe quedar en una pantalla sin un botón a tiro.
7. **Respuesta directa arriba** (caja destacada): "Para la mayoría conviene X; si [caso], Y." Sirve al lector apurado y a que la IA (AI Overviews) te cite.
8. **Prueba social pegada al botón, honesta.** "✓ La más elegida · 5.454 calificaciones". Usar **"calificaciones/opiniones", nunca "compras"** (son ratings). `✓` para prueba social; `★` solo para el rating.
9. **Links de afiliado:** `rel="sponsored nofollow noopener"` + `target="_blank"`. Links internos: `next/link` normal.
10. **Escalar contenido, no botones.** Para evitar "thin affiliate": desarrollar la ficha de cada producto del ranking y variar el texto de los links; no multiplicar botones clonados sobre contenido fino.

---

## 3. Design tokens

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#ffffff` | Fondo del artículo (blanco puro) |
| `--bg2` | `#f7f7f5` | Fondo de página / cajas suaves |
| `--text` | `#111111` | Texto principal |
| `--text2` | `#5f5f5f` | Texto secundario |
| `--muted` | `#9a9a9a` | Metadatos, captions, "ver ficha" |
| `--border` | `#e8e8e6` | Bordes |
| **`--cta`** | **`#FFE600`** / texto `#111` | **Botón de afiliado — el ÚNICO amarillo de la página** |
| `--star` | `#A8842E` | Estrellas (dorado apagado, NO compite con el CTA) |
| Pastel verde | `#e3efe0` / texto `#2f5d2f` | "Mejor elección general" |
| Pastel azul | `#e2edf5` / `#1f4d75` | "Mejor para X" / marca |
| Pastel violeta | `#ece4f2` / `#5a3a72` | "Mejor acero" / premium |
| Gris (slate) | `#eef1f5` / `#4a5568` | "Más económica" y chip de categoría (sin ámbar) |
| Radios | card `16px` · botón `24px` · badge `8px` | El radio pill (24px) ayuda a leer "esto es botón" |
| Fuente display | **Plus Jakarta Sans** (600/700/800) | Títulos, precios, labels, botón |
| Fuente body | **DM Sans** | Texto |

> Nota: los tokens viejos en `globals.css` usan `--editorial-accent: #A67B3B` (marrón) y fondo crema `#FAFAF5`. **Eso es lo que hay que reemplazar** por este set (botón amarillo, fondo blanco) al implementar el paquete CRO.

---

## 4. Anatomía de una guía (orden de bloques)

1. **Chip de categoría** (gris) + **H1** (keyword + año) + **standfirst (dek)**.
2. **Byline**: "Por el Equipo de Productos Virales · Actualizado [mes año] · X min".
3. **CTA above-the-fold**: caja con "Nuestra recomendación para el 90%" + producto #1 (estrellas + calificaciones) + **botón amarillo con precio**. Antes del scroll.
4. **Imagen hero** (`imageSize:"hero"`, `object-fit:contain` sobre blanco; NUNCA `cover`).
5. **Disclosure** de afiliado (línea fina, gris).
6. **Respuesta directa** (caja destacada): la recomendación en 1-2 frases.
7. **Intro** (1-2 párrafos cortos).
8. **quickPicks** (4): 1 dominante (botón amarillo) + 3 secundarias (botón `.ghost`). Badge desaturado, estrellas apagadas, precio, tagline de beneficio.
9. **trust-block** ("Cómo comparamos" + "verificamos precios automáticamente contra ML").
10. **Ranking** (`id:"ranking"`): por producto → kicker beneficio + `h3` numerado + `product-card` (ribbon + estrellas + descripción beneficio-first + prueba social ✓ + **unidad precio→botón** + "ver ficha" debajo gris) + 1-2 párrafos + `pull-quote` real (al menos #1 y #2).
11. **Tabla comparativa**: precio + features + **"Ideal para"** + link neutro "Ver a $X →" por fila (NO botón amarillo, para no diluir).
12. **Cómo elegir** (`h3` cortos; en pilares delega a hijas).
13. **Cuánto cuesta [mes año]** (lista de franjas; en pilares delega a la guía de precios).
14. **Veredicto** (caja negra): botón **primario amarillo** (recomendado) + **secundario `.ghost`**.
15. **FAQ** (5-7; la 1ª `open` para AI Overviews).
16. **Firma del equipo** (autor footer).
17. **internalLinks** (hub-and-spoke; ancla = keyword de cada hija).
18. **Sticky de compra mobile** (fijo abajo, solo celular).

---

## 5. Componentes (spec)

- **Índice scroll-spy:** barra "En esta guía" fija izquierda (≥1040px), resalta la sección activa. (Acento del activo en gris/neutro, no amarillo.)
- **quickPicks:** 1 card "win" (borde negro 2px + botón amarillo) + 3 cards con botón `.ghost`. Badges desaturados. Estrellas apagadas.
- **product-card:** cinta de premio full-width (pastel desaturado) + estrellas apagadas + descripción **beneficio-first** + línea de prueba social `✓` + unidad `.buy` (precio grande + botón amarillo aislados) + "ver ficha y opiniones" debajo, gris.
- **NORMA (Clarity 05-jul): la imagen y el título del producto SIEMPRE son links al `affiliateUrl`** (`rel="sponsored nofollow noopener"`, `target="_blank"`, `data-cta-location="card-image"` / `"card-title"`). Motivo: 11,7% de clics fallidos porque la gente toca foto/nombre esperando abrir el producto (hábito MercadoLibre/Instagram). Ya implementado en `ProductCard.tsx` (variantes default y compact); cualquier componente nuevo que muestre un producto con foto o nombre debe cumplirla.
- **NORMA (auditoría 2026-07): en toda tabla comparativa (`type: "table"`) cuya primera columna sea un producto (header "Modelo"/"Producto"), el nombre en cada fila TIENE que ser un link markdown al afiliado** — `[Nombre del modelo](https://meli.la/...)`, nunca texto plano. La tabla ya soporta esto (`parseInlineLinks` en cada celda, agrega `rel="sponsored"` solo); es un problema de contenido, no de código. Motivo: se encontraron 18 guías con tablas de puro texto, sin un solo link — el lector no puede hacer clic en ningún lado. Lo valida `scripts/check-table-product-links.cjs` (parte de `npm run guides:check`).
- **Estrellas:** fraccionadas, color `--star` (apagado). Relleno **`--p = rating/5×100%`** (4.6→92%, 4.9→98%). Siempre con el número al lado.
- **Botón:** amarillo `#FFE600` + texto negro + sombra (`0 3px 10px rgba(180,150,0,.30)`) + borde sutil para recortar sobre blanco. Pill 24px. Flecha `→`.
- **Botón secundario `.ghost`:** blanco, borde gris, texto negro. Sin amarillo.
- **pull-quote / callout / verdict / tabla / autor:** ver preview v3.

---

## 6. Reglas de contenido

- Precios/ratings de la API, frescos. Citas textuales con fuente y fecha; nunca inventadas.
- Sin fotos de compradores.
- **Imagen hero: nunca `-R.webp`.** Ese sufijo del CDN de ML es una miniatura (a veces <1 KB) y se ve borrosa/pixelada ampliada a hero. Usar `-F.webp` u `-O.webp` (foto completa). Antes de guardar la URL, verificar con un `HEAD` que el tamaño real sea bastante mayor al de `-R` (ver detalle y el gotcha del prefijo `D_Q_NP_` vs `D_NQ_NP_` en `docs/fichas.md`).
- **Pilares (anti-canibalización):** el pilar explica breve y delega a las hijas con ancla = keyword exacta; canónico self-referencing; `seoTitle` del pilar diferenciado.
- **Productos:** solo en stock (no `deprioritized`). Si falta uno, importarlo (ver `fichas.md`), no inventarlo.

### 6.0 Cadencia de re-optimización (acordada con Juan, 2026-07-09)

El disparador principal es el dato (reporte de los lunes en `docs/seo-reports/`), el calendario es la red de seguridad:

| Tier | Revisar cada |
|---|---|
| Pilares y top de clicks de afiliado (GA4) | 45 días |
| Publicadas con impresiones significativas | 90 días |
| Satélites de cola larga | 150 días |

Disparadores que pisan el calendario: caída fuerte en `alerts`, pick sin stock, ventana estacional próxima (estufas abr-may, ventiladores/aires sep-oct — siempre ANTES del pico) y el refresh de títulos `[año]` en enero. Al re-optimizar: los precios ya se actualizan solos por tokens — lo que envejece es stock, modelos nuevos y contras de reseñas. **Nunca tocar `updatedDate` sin un cambio real de contenido.**

### 6.1 Reglas OBLIGATORIAS (bloquean la publicación) — auditoría 2026-07

Nacieron de una auditoría que encontró 18 guías publicadas sin ningún botón de
compra (1.521 impresiones / 23 clicks en 28 días sin poder convertir un peso) y
24 precios tipeados a mano ya desactualizados (hasta 35% por debajo del precio
real). Antes de publicar o mergear cualquier guía nueva u optimizada, correr:

```bash
npm run guides:check
```

Este comando corre, en orden, y para en el primero que falle:

1. **`check-price-tokens.cjs`** — todo `{{precio:ID}}` y `{{preciodif:A:B}}` tiene
   que apuntar a un producto real con precio en `curated-products.ts`.
2. **`check-stale-prose-prices.cjs`** — ningún precio tipeado a mano en la prosa
   puede estar más de 3% desviado del precio actual del producto que menciona.
   **Regla de escritura:** nunca tipear un precio absoluto a mano si el producto
   tiene ficha — usar `{{precio:ID}}` (exacto, ideal en tablas/product-cards) o
   `{{precio:ID:k}}` (redondeado, para prosa tipo "alrededor de $X"). Para
   **claims comparativos** ("es $X más cara que...", "$X más barata") usar
   `{{preciodif:ID_A:ID_B}}` (ver `src/lib/price-token.ts`) — nunca tipear la
   diferencia a mano, se desactualiza en cuanto cambia CUALQUIERA de los dos
   precios. Si el producto de comparación no tiene ficha propia en el catálogo
   (una marca competidora solo mencionada, no vendida), no inventar un precio
   exacto: usar un marco aproximado y no numérico ("bastante más cara", "en un
   rango similar") en vez de un monto que nadie va a actualizar nunca.
   **La prueba social sigue la misma regla que el precio.** Una nota y una
   cantidad de reseñas envejecen igual de rápido: en agosto 2026 la guía de
   teclados decía "4.486 opiniones" cuando el catálogo ya iba en 4.585. Usar
   `{{reviews:ID}}` (cantidad de opiniones) y `{{rating:ID}}` (estrellas, un
   decimal). Van casi siempre de a dos, porque el patrón de la casa es
   "{{rating:ID}} estrellas en {{reviews:ID}} opiniones". La palabra la escribe
   el editor; el token resuelve solo el número.

   Dos salvedades:
   - **Los aproximados se dejan a mano.** "Más de 4.100 opiniones" sigue siendo
     verdad cuando el conteo sube, que es lo único que hace un conteo de
     reseñas. Meterle el token exacto ahí no arregla nada y empeora la prosa
     ("más de 4.137 opiniones"). El token es para el número exacto.
   - **Verificar de QUÉ producto es el número, no cuál está más cerca.** En una
     frase comparativa ("5.0 con 3 opiniones (Netmak) no pesa igual que un 4.8
     con 4.486") hay dos productos: cada número lleva el ID del suyo. Atribuirle
     el conteo de un producto a otro es un error de honestidad, no de formato.
     Ojo con las frases donde el número queda pegado al producto equivocado: en
     la guía de termos, "el Lumilagro tiene más del cuádruple de calificaciones
     que el Stanley (26.780)" tenía el conteo del **Lumilagro** escrito al lado
     del Stanley. El más cercano no es el dueño.

   El conteo no siempre va pegado a la palabra "opiniones". Estas cuatro formas
   son la misma deuda y también van tokenizadas:

   ```
   Qué dicen los 7.137 compradores        → los {{reviews:ID}} compradores
   68 opiniones contra 3.846              → {{reviews:A}} opiniones contra {{reviews:B}}
   las 6.131 de la Escorial               → las {{reviews:ID}} de la Escorial
   muy por debajo de la SX37 (8.606)      → muy por debajo de la SX37 ({{reviews:ID}})
   ```

   Las cuatro las frena `check-hardcoded-reviews.cjs`. Las dos últimas piden
   además una palabra de reseñas cerca, porque la forma sola es ambigua: "las
   300 del Känn Livet" son kilos y "las 980 del álbum" son figuritas. Si escribís
   una comparación de reseñas sin nombrarlas, el trinquete no la va a ver.

   **Los títulos `h2`/`h3` NO resuelven tokens.** `GuideRenderer` renderiza
   `section.title` crudo y `slug.ts` arma el ancla con ese texto, así que un
   `{{reviews:ID}}` en un título sale literal y ensucia el ancla y el índice.
   En un título, usar el aproximado: "Qué dicen los más de 10.000 compradores".
3. **`check-guide-monetization.cjs`** — toda guía tiene que tener al menos un
   `product-card`, un `quickPicks`, o un link de afiliado/ficha real. Sin
   excepciones: incluso una guía informativa ("cómo funciona", "ventajas y
   desventajas") tiene que enlazar a la guía pilar o a una ficha concreta. Una
   guía que rankea pero no tiene nada clickeable no genera ni un peso.

---

## 7. Estado de implementación (IMPORTANTE)

**Estructura ya implementada** en los componentes (`GuideRenderer`, `ProductCard`, `QuickPicks`, `Stars`, `ArticleFooter`, `TableOfContents`): quickPicks, product-card con ribbon, estrellas fraccionadas, scroll-spy, footer, tabla, FAQ, schema.

**Paquete CRO v3 — PENDIENTE de implementar** (los componentes hoy renderizan el estilo viejo: fondo crema + botón marrón `--editorial-accent`):
- [ ] Botón a **amarillo ML `#FFE600`** + texto negro (reemplazar `--editorial-accent` en el CTA) y fondo a **blanco** (`globals.css` scope `.editorial-article`). *(Tocar `globals.css` → avisar a Juan, regla 4.)*
- [ ] **Amarillo exclusivo:** estrellas a `--star`; badges "económica"/chip fuera del ámbar; links de tabla a neutro.
- [ ] **Un CTA dominante por bloque:** quickPicks #1 amarillo, resto `.ghost`; veredicto primario+secundario.
- [ ] **Unidad precio→botón** aislada + "ver ficha" degradado a link gris debajo.
- [x] **CTA above-the-fold** (`AboveFoldCta`) + **respuesta directa** (campo `directAnswer` del `Guide`, caja "Respuesta rápida" antes de la intro — implementado 2026-07-09, cargado en las 20 pilares; falta redactarlo en las satélite, priorizando por datos de GSC) + **sticky de compra mobile** (`StickyBuyBar`).
- [ ] **Precio dentro del botón** + verbo "Comprar" + microcopy "MercadoLibre" completo unificado.
- [ ] Prueba social "calificaciones" (no "compras"); `rel="sponsored"`; hero `next/image`; FAQ 1ª abierta.

---

## 8. CSS de referencia (v3 — canónico)

> Set completo y renderizable en `docs/clusters/pavas-electricas/preview-pava-electrica-v3-CRO.html`. Extracto clave:

```css
:root{
  --bg:#fff; --bg2:#f7f7f5; --text:#111; --text2:#5f5f5f; --muted:#9a9a9a; --border:#e8e8e6;
  --cta:#FFE600; --cta-text:#111;     /* ÚNICO amarillo = botón */
  --star:#A8842E;                      /* estrellas apagadas */
  --rcard:16px; --rbtn:24px;
}
/* Botón afiliado (el único amarillo, con peso) */
.btn{display:inline-flex;align-items:center;gap:7px;background:var(--cta);color:var(--cta-text);
  font-weight:800;font-size:14.5px;padding:12px 20px;border-radius:var(--rbtn);
  border:1px solid rgba(0,0,0,.18);box-shadow:0 3px 10px rgba(180,150,0,.30)}
/* Botón secundario neutro (sin amarillo) */
.ghost{background:#fff;color:var(--text);font-weight:700;padding:9px 14px;border-radius:var(--rbtn);border:1.5px solid var(--border)}
/* Estrellas apagadas: --p = rating/5*100% */
.stars::before{content:"★★★★★";color:#e0e0dc}
.stars::after{content:"★★★★★";color:var(--star);position:absolute;left:0;top:0;width:var(--p);overflow:hidden;white-space:nowrap}
/* Unidad precio->botón aislada */
.buy{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--bg2);border-radius:12px;padding:12px 14px}
.buy .pr .big{font-family:"Plus Jakarta Sans";font-weight:800;font-size:22px;display:block}
/* Sticky de compra mobile */
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:50;background:#fff;border-top:1px solid var(--border);display:flex;align-items:center;gap:11px;padding:9px 14px}
.sticky .btn{min-height:44px}
@media(min-width:620px){ .sticky{display:none} } /* solo mobile */
```

---

## 9. Checklist al crear/rehacer una guía

- [ ] Estructura del §4 completa y en orden.
- [ ] **Amarillo SOLO en el botón** (estrellas apagadas, badges sin ámbar).
- [ ] **Un CTA dominante por bloque** (resto `.ghost`).
- [ ] Precio dentro del botón + verbo "Comprar" + "MercadoLibre" completo.
- [ ] Unidad precio→botón aislada; "ver ficha" debajo, gris.
- [ ] CTA above-the-fold + respuesta directa + sticky mobile.
- [ ] Prueba social "calificaciones" (no "compras"); `✓` social, `★` rating.
- [ ] quickPicks (4) + ranking con fichas reales + ≥2 pull-quotes reales.
- [ ] Tabla con "Ideal para" + links neutros.
- [ ] FAQ (5-7, 1ª abierta) + veredicto (primario+secundario) + firma + internalLinks.
- [ ] Pilar: anti-canibalización (delegar a hijas).
- [ ] Solo productos en stock; si falta, importar (ver `fichas.md`).
- [ ] Imagen hero verificada en `-F`/`-O` (nunca `-R.webp`; ver regla en §6).
- [ ] `rel="sponsored nofollow noopener"` en afiliados; `npm run lint && npm run build` en verde.
- [ ] **`npm run guides:check` en verde** (ver §6.1): tokens de precio válidos, sin precios hardcodeados stale, y al menos un camino de compra real. No negociable.
