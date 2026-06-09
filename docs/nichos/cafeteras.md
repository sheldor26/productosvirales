# Nicho: Cafeteras

> Doc maestro. Creado 09-jun-2026. Método calcado de `aspiradoras-robot.md`.
> Research completo en outputs de la sesión 09-jun (`proximo-cluster-research.md`).

## Keywords validadas (Ubersuggest, locId 2032, es-AR)

| Keyword | Vol/mes | SD | Intent | Target |
|---|---|---|---|---|
| cafetera | 40.500 | 74 | — | NO target directo (head muy duro) |
| **cafetera express** | **22.200** | **11** | Commercial | Guía PILAR |
| **cafetera oster** | **14.800** | **9** | Transactional | Guía marca + 2 fichas Oster |
| cafetera dolce gusto | 8.100 | 13 | Transactional | Guía cápsulas + ficha Piccolo XS |
| cafetera peabody | 5.400 | 14 | Navigational | Guía marca + 2 fichas Peabody |
| cafetera de filtro | 2.900 | 11 | Transactional | Guía tipo + 6 fichas filtro |
| cafetera smartlife | 2.400 | 7 | Navigational | Guía marca + 3 fichas Smartlife |
| cafetera liliana | 1.000 | 10 | Commercial | Guía marca + 4 fichas Liliana |
| mejor cafetera express | 140 | 17 | Transactional | Decisión (secundaria en pilar) |
| olla electrica | 8.100 | 11 | Transactional | (futuro mini-cluster, mismo molde) |

Estacionalidad: pico mayo-julio (cafetera express llegó a 40.500 en mayo), piso nov-feb (~12-15K). Evergreen real, sin el colapso de calefacción.

## Catálogo (18 fichas, importadas 09-jun)

| # | MLA | Producto | Precio | Rating | Reviews | Tier |
|---|---|---|---|---|---|---|
| 1 | MLA37650751 | Atma CA8131 filtro | $45.000 | — | 0 | Filtro entrada |
| 2 | MLA14735678 | Atma CA8133 semi aut. | $47.567 | 4.6 | 879 | Filtro entrada |
| 3 | MLA15109525 | Ultracomb CA-2205 | $40.756 | 4.4 | 631 | Filtro entrada |
| 4 | MLA72187457 | Electrolux ECM25 | $69.999 | — | 0 | Filtro entrada |
| 5 | MLA15297115 | Smartlife SL-CM1095 | $79.999 | 4.7 | 94 | Filtro entrada |
| 6 | MLA62786317 | Liliana AC935 filtro digital | $112.767 | 4.8 | 42 | Filtro premium |
| 7 | MLA36409137 | Ultracomb CE-6108 espresso | $133.999 | 4.6 | 211 | Express económica |
| 8 | MLA62547964 | Liliana 2en1 20bar | $174.521 | 4.7 | 49 | Express económica |
| 9 | MLA18562154 | Smartlife SL-EC8501 | $194.111 | 4.6 | 1.656 | Express económica |
| 10 | MLA70273936 | Liliana Prosteam AC987 | $222.995 | — | 0 | Express económica |
| 11 | MLA70275635 | Liliana Latesense AC991 | $272.544 | — | 0 | Express económica |
| 12 | MLA15705813 | Moulinex Dolce Gusto Piccolo XS | $155.132 | 4.8 | 8.392 | Cápsulas |
| 13 | MLA23385666 | Nespresso Inissia crema | $350.000 | — | 0 | Cápsulas |
| 14 | MLA28314113 | Smartlife 3en1 cápsulas+molido | $528.131 | 4.7 | 1.654 | Cápsulas |
| 15 | MLA23909880 | Oster BVSTEM5501B espresso | $289.999 | 4.7 | 402 | Media/alta |
| 16 | MLA47077888 | Peabody PE-CE5010N c/molinillo | $520.336 | 4.6 | 237 | Media/alta |
| 17 | MLA48828162 | Oster Perfect Brew EM7301 | $838.899 | 4.9 | 110 | Tope |
| 18 | MLA53370426 | Peabody PE-CE5023IX automática | $981.818 | 4.8 | 75 | Tope |

Todas con `affiliateUrl` meli.la verificado (09-jun). Reviews crudas en cache de sesión (`/tmp/cafreviews.json`, regenerable con la API).

## Orden de enriquecimiento por ROI (keyword × data disponible)

1. **Piccolo XS** — kw 8.100 + 8.392 reviews. La estrella del cluster.
2. **Oster BVSTEM5501B** — kw 14.800 SD 9, 402 reviews.
3. **Smartlife SL-EC8501** — kw 2.400 SD 7, 1.656 reviews, corazón del pilar express.
4. **Smartlife 3en1** — 1.654 reviews, producto único (3 sistemas).
5. **Oster Perfect Brew EM7301** — cierra `cafetera oster`, 4.9★.
6. **Peabody 5010N** → 7. **Peabody 5023IX** — cierran `cafetera peabody`.
8. **Atma CA8133** → 9. **Ultracomb CA-2205** → 10. **CE-6108** — filtro/express entrada.
11-13. Liliana 2en1, SL-CM1095, AC935.
14-18. Sin reviews (CA8131, ECM25, Prosteam, Latesense, Inissia): manejo honesto "modelo nuevo / pocas opiniones" como la Atma Smart de aspiradoras.

## Checklist por ficha (heredado de aspiradoras — funcionó 18/18)

- seoTitle/metaDescription/ogTitle/ogDescription/h1 con keyword validada.
- `articleBody` 7 H2 con ángulo diferenciador + honestidad fuerte (contras del panorama de reviews).
- `specs` 15-20 de la ficha técnica de ML.
- `faq` 8-9 (→ FAQPage).
- `customerReviews` 7-9 reales del panorama, incluyendo críticas (1-3★) cuando existan.
- `structuredData` Product+Offer+AggregateRating completo.
- 4-5 links internos a fichas hermanas (diferenciar, no canibalizar).
- Texto pasado por humanizer.

## Guías del cluster (después de fichas, cadencia 3 días)

1. PILAR: `cafetera-express` (22.200) — tipo ranking/hub.
2. `cafetera-oster` (14.800, SD 9) — marca.
3. `cafetera-dolce-gusto` (8.100) — cápsulas/marca.
4. `cafetera-peabody` (5.400) — marca.
5. `cafetera-de-filtro` (2.900) — tipo.
6. `cafetera-smartlife` (2.400, SD 7) — marca.
7. Comparativa decisión: express vs cápsulas vs filtro ("qué cafetera comprar").
8. `cafetera-liliana` (1.000) — marca.
