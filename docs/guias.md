# guias.md — Sistema de diseño y plantilla oficial de las guías

> **Esta es la plantilla VISUAL y ESTRUCTURAL oficial de TODAS las guías de ProductosVirales.**
> Desde junio 2026, toda guía nueva —y las que se rehagan— sigue este diseño. Sin excepciones salvo que Juan lo pida explícito.
> Validado con el pilar `pava-electrica` (preview aprobado por Juan, jun 2026).
>
> Este doc **complementa**, no reemplaza:
> - [`ARTICLE_CREATION_WORKFLOW.md`](ARTICLE_CREATION_WORKFLOW.md) → cómo se guarda técnicamente (objeto `Guide` en `src/data/guides.ts`).
> - [`POST_MASTER_STRUCTURE.md`](POST_MASTER_STRUCTURE.md) → psicología y copy editorial.
> - **`guias.md` (este)** → cómo se ve y qué bloques lleva, en qué orden.
>
> Referencia viva del look: `docs/clusters/pavas-electricas/preview-pava-electrica.html` (abrir en navegador).

---

## 1. Principios de diseño

1. **Estilo "best of" tipo TechRadar, adaptado a la marca.** Limpio, escaneable, con jerarquía clara. El lector tiene que poder decidir en 10 segundos (caja de arriba) o leer todo (cuerpo).
2. **Datos siempre reales.** Precios verificados por la API oficial de ML, ratings y cantidad de reseñas reales. Nada inventado.
3. **Honestidad como diferenciador.** Cada producto lleva contras reales. Citas textuales de compradores con su fuente. Sin marketing inflado.
4. **Cada elemento empuja al click honesto.** Cintas de color, botones negros prominentes, estrellas — todo guía al CTA, pero solo recomendando lo que conviene de verdad.
5. **NO usar fotos de compradores.** El campo `media` de las reseñas existe, pero republicar la foto de un usuario tiene derechos del autor. Usar solo imágenes del listado oficial.

---

## 2. Design tokens (idénticos a `src/app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#ffffff` | Fondo del artículo |
| `--bg2` | `#f8f8f6` | Fondo de página, cajas suaves |
| `--text` | `#111111` | Texto principal |
| `--text2` | `#666666` | Texto secundario / descripciones |
| `--muted` | `#999999` | Metadatos, captions |
| `--border` | `#eeeeee` | Bordes de cards y tablas |
| `--cta` | `#111111` | Botones (fondo) / `--cta-text` `#fff` |
| Pastel verde | `#dcfce7` | "Mejor elección general" |
| Pastel azul | `#e0f2fe` | "Mejor para X" / alternativa de marca |
| Pastel violeta | `#f3e8ff` | "Mejor acero" / premium |
| Pastel ámbar | `#fef3c7` | "Más económica" |
| Pastel coral | `#ffe4e6` | "Premium" / destacado |
| Acento estrellas | `#f59e0b` | Estrellas, barra activa del índice |
| Radio card | `16px` · botón `24px` · badge `8px` | |
| Fuente display | **Plus Jakarta Sans** (600/700/800) | Títulos, precios, labels |
| Fuente body | **DM Sans** (400/500/700) | Texto |

---

## 3. Anatomía de una guía (orden de bloques)

Mapa del esqueleto "best of" sobre los tipos de bloque del `Guide` (ver workflow para el schema):

1. **Categoría (chip)** + **H1** + **standfirst (dek)**.
2. **Byline**: "Por Equipo Productos Virales · Actualizado [mes año] · X min · Contiene links de afiliado".
3. **Imagen hero** (`type:"image"`, `imageSize:"hero"`) — toma completa del producto #1, `object-fit:contain` sobre blanco (NUNCA `cover`, recorta el producto).
4. **Intro** (2-3 párrafos): contexto + el criterio que define la categoría + qué comparamos.
5. **Caja de comparación "de un vistazo"** (`quickPicks`, 4 ítems) — las recomendaciones arriba, con badge de color, estrellas, precio y botón. *Obligatoria en rankings y comparativas.*
6. **trust-block** (`trustVariant:"methodology"`) — "Cómo comparamos".
7. **H2 — Antes de comprar**: el criterio madre de la categoría (en pavas, mate sí/no), breve. Si es pilar, **delega** los temas profundos a guías hijas con link.
8. **H2 — El ranking** (`id:"ranking"`): por cada producto →
   - kicker `benefit` (beneficio en mayúsculas: "La mejor para la mayoría")
   - `h3` numerado ("1. Producto")
   - `product-card` **con cinta de premio (ribbon) de color** + estrellas reales + precio + CTA
   - 1-2 párrafos: por qué está acá + el contra honesto
   - `pull-quote` con cita real de ML (al menos en #1 y #2)
9. **H2 — Tabla comparativa** (`type:"table"`): precio + features + "para quién", con links `meli.la`.
10. **H2 — Cómo elegir** (`id:"como-elegir"`): criterios en `h3` cortos; cada uno delega a la hija si es pilar.
11. **H2 — Cuánto cuesta [mes año]** (`type:"list"`): franjas de precio breves; en pilares delega a la guía de precios.
12. **H2 — Veredicto** (`type:"verdict"`): conclusión en caja negra.
13. **FAQ** (`faq`, 5-7 preguntas long-tail).
14. **Firma del equipo** (autor footer): avatar "PV" + "Equipo de Productos Virales" + bio.
15. **internalLinks** (hub-and-spoke): en pilares, link a cada hija con ancla = keyword exacta de la hija.

Bloques de apoyo que se pueden intercalar: `callout` (tip/note/warning/update), `image`, `image-grid`, `pull-quote`.

---

## 4. Componentes (spec + cuándo usar)

### Índice lateral con scroll-spy
Barra "En esta guía" fija a la izquierda (solo escritorio ≥1040px; oculta en mobile). A medida que se scrollea, **se ilumina en ámbar** la sección activa (borde izq. + negrita + fondo degradé). Implementado con `IntersectionObserver` (ver §8). Anclas = `id` de cada H2.

### Caja de comparación "de un vistazo" (quickPicks)
4 tarjetas arriba del cuerpo. Cada una: borde superior de color (3px), badge de premio, imagen `contain`, nombre, **estrellas reales + rating·reseñas**, tagline de una línea, precio + botón "Ver precio". Hover: leve elevación.

### Product-card con cinta de premio (ribbon)
La ficha del ranking lleva una **cinta de color full-width arriba** con el premio: `★ Nº 1 · Mejor elección general`. Color según rol:
- Verde = mejor general · Azul = mejor para [uso] / alternativa de marca · Violeta = mejor acero/calidad · Ámbar = más económica · Coral = premium.
Cuerpo: imagen `contain` (160px) + nombre + estrellas + descripción + precio + CTA negro "Ver en MercadoLibre".

### Estrellas reales (ML) — REGLA
Estrellas fraccionadas que reflejan el rating exacto de ML. Fórmula del ancho de relleno: **`--p = rating / 5 × 100%`**.
Ej.: 4.6 → 92% · 4.7 → 94% · 4.8 → 96% · 4.9 → 98% · 5.0 → 100%.
Siempre acompañadas de `rating · N calificaciones en ML`. El dato sale de la API (`/reviews/item/{item_id}?catalog_product_id={MLA}`).

### Pull-quote (cita de comprador)
Cita textual real con barra izquierda negra + atribución: `— Comprador verificado en MercadoLibre, [mes año] · N personas lo encontraron útil`. Traer de la API, ordenar por `likes`. Incluir al menos una en #1 y #2; sumar una crítica honesta cuando aporte.

### Callouts
`c-tip` (verde): consejo/dato útil. `c-note` (azul): aclaración / "¿y la otra opción?". Título en negrita + texto. (warning/update existen en el schema para avisos y "actualizado el…").

### Tabla comparativa
Header gris suave, filas con hover. Primera columna = modelo con link `meli.la`. Mantener: una tabla comparativa por URL (en pilares no repetir la tabla de una hija).

### Veredicto
Caja negra, texto claro, links en ámbar. Resume a quién le conviene cada pick.

### Firma del equipo (autor footer)
Avatar circular negro "PV" + "Equipo de Productos Virales" + bio corta. Va al pie de toda guía, antes de los links relacionados.

---

## 5. Reglas de contenido (heredadas + propias del diseño)

- **Precios y ratings**: de la API, frescos. Nunca a mano salvo dato confirmado por Juan.
- **Citas**: textuales, con fuente ML y fecha. **Nunca inventar reseñas.**
- **Fotos de compradores**: no usar (derechos de autor del usuario).
- **Pilares (hub) — anti-canibalización**: el pilar explica en breve y **delega** a las hijas (precios → guía de precios; temperatura → guía de temperatura; material → guía de acero/vidrio). Enlazado hub-and-spoke con ancla = keyword de cada hija; canónico self-referencing. Diferenciar el `seoTitle` del pilar del patrón de las hijas.
- **Productos**: solo los que están en el catálogo con stock (no `deprioritized`). Si falta uno para completar el ranking, **importarlo** antes de escribir (ver workflow / `ml-product-importer.ts`), no inventarlo.

---

## 6. Estado de implementación en el sitio

El **contenido y la estructura** (§3) ya se expresan con los tipos de bloque actuales del `Guide` y los renderiza `GuideRenderer.tsx`. Lo que el sitio renderiza hoy: quickPicks, product-card, trust-block, callout, pull-quote, table, verdict, FAQ, internalLinks.

Elementos del preview que **requieren trabajo en los componentes React** para que el sitio en vivo se vea igual que el preview (avisar a Juan antes de tocar componentes, regla 4 de CLAUDE.md):
- [ ] **Índice lateral con scroll-spy** (layout de 2 columnas + IntersectionObserver en `GuideRenderer`).
- [ ] **Cinta de premio (ribbon) de color** arriba del `product-card` (hoy el card usa `label` como badge chico; falta la cinta full-width).
- [ ] **Estrellas fraccionadas** en `product-card` (verificar que ya rendericen el rating exacto; si muestran ★ llenas, ajustar).
- [ ] **Caja de comparación superior** con estrellas + borde de color (mejora del render actual de `quickPicks`).
- [ ] **Firma del equipo** (autor footer) reutilizable al pie.

Mientras esos no estén en el componente, el preview HTML es la referencia de cómo tiene que quedar.

---

## 7. CSS de referencia (canónico)

Copiar/portar desde acá al implementar en el sitio. Es el CSS del preview aprobado.

```css
:root{
  --bg:#ffffff; --bg2:#f8f8f6; --text:#111111; --text2:#666666; --muted:#999999;
  --border:#eeeeee; --cta:#111111; --cta-text:#fff;
  --green:#dcfce7; --blue:#e0f2fe; --amber:#fef3c7; --purple:#f3e8ff; --coral:#ffe4e6;
  --rcard:16px; --rbtn:24px; --rbadge:8px;
}
/* Layout: índice sticky + artículo */
.shell{display:grid;grid-template-columns:minmax(0,760px);justify-content:center;gap:34px;max-width:1060px;margin:0 auto}
@media(min-width:1040px){.shell{grid-template-columns:236px minmax(0,760px)}}
.toc{display:none}
@media(min-width:1040px){
  .toc{display:block;align-self:start;position:sticky;top:24px;font-size:14px}
  .toc a{display:block;color:var(--text2);text-decoration:none;border-left:2px solid var(--border);padding:7px 0 7px 14px;transition:all .18s}
  .toc a.active{color:var(--text);border-left-color:#f59e0b;font-weight:700;background:linear-gradient(90deg,rgba(245,158,11,.08),transparent)}
}
/* Estrellas fraccionadas: --p = rating/5*100% */
.stars{--p:100%;display:inline-block;position:relative;font-family:Arial,sans-serif;font-size:15px;line-height:1;letter-spacing:1px}
.stars::before{content:"★★★★★";color:#e5e7eb}
.stars::after{content:"★★★★★";color:#f59e0b;position:absolute;left:0;top:0;width:var(--p);overflow:hidden;white-space:nowrap}
/* Caja de comparación superior */
.qp{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.qp-card{border:1px solid var(--border);border-top-width:3px;border-radius:var(--rcard);padding:16px;display:flex;flex-direction:column;gap:8px;transition:transform .15s,box-shadow .15s}
.qp-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.06)}
.qp-card.green{border-top-color:#22c55e}.qp-card.blue{border-top-color:#0ea5e9}
.qp-card.amber{border-top-color:#f59e0b}.qp-card.purple{border-top-color:#a855f7}
/* Product-card con cinta de premio */
.pcard{border:1px solid var(--border);border-radius:var(--rcard);margin:14px 0 18px;background:var(--bg);overflow:hidden}
.ribbon{display:flex;align-items:center;gap:10px;padding:10px 18px;font-family:"Plus Jakarta Sans";font-weight:800;font-size:12.5px;letter-spacing:.07em;text-transform:uppercase}
.ribbon .rk{font-weight:800;opacity:.55}
.r-green{background:#dcfce7;color:#166534}.r-blue{background:#e0f2fe;color:#075985}
.r-amber{background:#fef3c7;color:#92400e}.r-purple{background:#f3e8ff;color:#6b21a8}.r-coral{background:#ffe4e6;color:#9f1239}
.pcard-body{padding:18px;display:grid;grid-template-columns:160px 1fr;gap:20px}
.pcard-body img{width:160px;height:160px;object-fit:contain;background:var(--bg2);border-radius:12px}
/* CTA, verdict, callouts, pull-quote, hero, autor — ver preview-pava-electrica.html para el set completo */
.btn{display:inline-block;background:var(--cta);color:#fff;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:var(--rbtn)}
.hero{width:100%;aspect-ratio:16/10;object-fit:contain;background:#fff;border:1px solid var(--border);border-radius:var(--rcard);padding:14px}
.verdict{background:#111;color:#f5f5f4;border-radius:var(--rcard);padding:24px 26px}
.author{display:flex;gap:16px;align-items:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rcard);padding:20px 22px}
.author .ava{width:52px;height:52px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
```

> El CSS completo (callouts, faq, tabla, byline, etc.) está en `docs/clusters/pavas-electricas/preview-pava-electrica.html`. Ese archivo es la **referencia maestra renderizable** del diseño.

---

## 8. Scroll-spy (JS de referencia)

```js
(function(){
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  function setActive(id){ links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+id)); }
  var sections = links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  var obs = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id); }),
    { rootMargin:'-15% 0px -70% 0px' });
  sections.forEach(s=>obs.observe(s));
})();
```

---

## 9. Checklist al crear una guía nueva

- [ ] Estructura del §3 completa y en orden.
- [ ] quickPicks (4) arriba con estrellas reales.
- [ ] Cada product-card con ribbon de color + rating real + contra honesto.
- [ ] Estrellas con `--p = rating/5*100%`.
- [ ] Al menos 2 pull-quotes reales de la API (fuente ML + fecha + útiles).
- [ ] Tabla comparativa con links `meli.la`.
- [ ] Veredicto + FAQ (5-7) + firma del equipo + internalLinks.
- [ ] Si es pilar: guardrails anti-canibalización (delegar a hijas, anclas con keyword exacta).
- [ ] Solo productos en stock; si falta, importar antes de escribir.
- [ ] `npm run lint && npm run build` en verde.
