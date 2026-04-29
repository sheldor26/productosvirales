# Mapa de enlaces internos — Cluster Freidoras de Aire

## Arquitectura de link juice

```
[PILAR] mejores-freidoras-de-aire-argentina
    │
    ├── REVIEWS (reciben más link juice)
    │   ├── atma-freidoras-de-aire-review          ← 18.1K vol
    │   ├── peabody-freidoras-de-aire-review        ← 8.1K vol
    │   ├── philips-freidoras-de-aire-review        ← 5.4K vol
    │   ├── oster-freidoras-de-aire-review          ← 2.9K vol
    │   ├── gadnic-freidora-review                  ← 1.3K vol
    │   ├── kanji-home-freidora-review              ← 1.3K vol
    │   ├── suono-airfryer-review                   ← 880 vol
    │   ├── ninja-crispi-review                     ← 260 vol
    │   └── powerxl-freidora-review                 ← 480 vol
    │
    ├── COMPARATIVAS (canalizan intención comercial)
    │   ├── atma-vs-peabody-freidora-de-aire
    │   ├── ninja-vs-philips-freidora-de-aire
    │   ├── mejores-freidoras-de-aire-doble-canasta
    │   ├── freidoras-de-aire-con-grill-argentina
    │   ├── mejores-freidoras-de-aire-economicas-argentina
    │   └── freidoras-de-aire-gran-capacidad
    │
    └── INFORMATIVOS (capturan tráfico top-of-funnel)
        ├── como-usar-una-freidora-de-aire           ← 590 vol
        ├── recetas-freidora-de-aire                 ← 8.1K vol
        ├── cuanto-consume-freidora-de-aire
        ├── freidora-de-aire-vs-horno
        ├── vale-la-pena-comprar-freidora-de-aire
        ├── accesorios-para-freidora-de-aire         ← 4.3K vol combinado [NUEVO]
        └── freidora-de-aire-desventajas             ← 720 vol [NUEVO]
```

---

## Reglas de enlace por tipo de artículo

### PILAR → enlaza a TODOS
Cada sección del pilar que mencione una marca o tema enlaza al artículo correspondiente.
- Anchor text para reviews: "[Marca] freidora de aire" o "review de la [Marca]"
- Anchor text para comparativas: "comparativa [A] vs [B]" o "mejores freidoras doble canasta"
- Anchor text para informativos: "cuánto consume", "cómo usar", "recetas"

### REVIEWS → enlazan a (mínimo 5 enlaces internos):
| Desde | Obligatorio enlazar a |
|-------|----------------------|
| Atma review | pilar · atma-vs-peabody · doble-canasta · como-usar · recetas |
| Peabody review | pilar · atma-vs-peabody · con-grill · gran-capacidad · recetas |
| Philips review | pilar · ninja-vs-philips · doble-canasta · vale-la-pena · como-usar |
| Oster review | pilar · doble-canasta · como-usar · accesorios |
| Ninja review | pilar · ninja-vs-philips · vale-la-pena · recetas |
| PowerXL review | pilar · economicas · freidora-pequeña-vs-grande · como-usar |
| Kanji review | pilar · economicas · gran-capacidad · como-usar |
| Gadnic review | pilar · economicas · atma-review · como-usar |
| Suono review | pilar · gran-capacidad · recetas · como-usar |

### COMPARATIVAS → enlazan a (mínimo 4 enlaces):
| Comparativa | Enlazar a |
|-------------|-----------|
| Atma vs Peabody | atma-review · peabody-review · pilar · doble-canasta |
| Ninja vs Philips | ninja-review · philips-review · pilar · vale-la-pena |
| Doble canasta | atma-review · philips-review · oster-review · peabody-review · pilar |
| Con grill | atma-review · peabody-review · pilar · recetas |
| Económicas | powerxl-review · kanji-review · gadnic-review · pilar |
| Gran capacidad | atma-review · suono-review · kanji-review · peabody-review · pilar |

### INFORMATIVOS → enlazan a (mínimo 4 enlaces):
| Informativo | Enlazar a |
|-------------|-----------|
| cómo usar | pilar · recetas · como-limpiar (dentro del mismo art.) · atma-review |
| recetas | pilar · como-usar · philips-review · ninja-review |
| consumo eléctrico | pilar · freidora-vs-horno · vale-la-pena |
| freidora vs horno | pilar · consumo · vale-la-pena · economicas |
| vale la pena | pilar · economicas · como-usar · recetas |
| accesorios | pilar · como-usar · recetas · atma-review · peabody-review |
| desventajas | pilar · vale-la-pena · freidora-vs-horno · economicas |

---

## Anchor texts recomendados (para no repetir siempre el mismo)

### Para el pilar:
- "mejores freidoras de aire en Argentina"
- "guía completa de freidoras de aire"
- "qué freidora de aire comprar"
- "comparativa de freidoras de aire 2026"

### Para reviews de marca:
- "review completa de la Atma" / "análisis de la Atma"
- "opiniones sobre la Peabody"
- "cuál es mejor: Philips o Ninja"

### Para informativos:
- "cómo usar tu freidora de aire"
- "cuánto gasta de luz"
- "qué podés cocinar en la freidora"
- "accesorios que necesitás"

---

## Páginas de productos (links de afiliado — siempre rel="nofollow sponsored")

| Modelo | URL afiliado | Enlazar desde |
|--------|-------------|---------------|
| Atma FR248ABP 8L | https://productosvirales.com.ar/producto/MLA39861162 | atma-review · pilar · gran-capacidad |
| Atma Pro FR60AR 6.5L | https://productosvirales.com.ar/producto/MLA27351841 | atma-review · pilar |
| Atma FR901DP Grill | https://productosvirales.com.ar/producto/MLA37004216 | atma-review · con-grill |
| Atma Pro Doble FRD248AP | https://productosvirales.com.ar/producto/MLA40161710 | atma-review · doble-canasta |
| Peabody PE-AFD650N | https://productosvirales.com.ar/producto/MLA44703897 | peabody-review · pilar · economicas |
| Peabody PE-AFD720N Visor | https://productosvirales.com.ar/producto/MLA41829394 | peabody-review |
| Peabody PE-AFDL102N 10L | https://productosvirales.com.ar/producto/MLA53776810 | peabody-review · gran-capacidad |
| Peabody PE-AFG01IX Grill | https://productosvirales.com.ar/producto/MLA23318618 | peabody-review · con-grill |
| Philips NA12000 | https://productosvirales.com.ar/producto/MLA61393261 | philips-review |
| Philips PHNA35100 Doble | https://productosvirales.com.ar/producto/MLA55779230 | philips-review · doble-canasta |
| Philips PHNA23100 13-en-1 | https://productosvirales.com.ar/producto/MLA53675940 | philips-review |
| Philips HD9280 XL | https://productosvirales.com.ar/producto/MLA19630913 | philips-review · gran-capacidad |
| Philips HD9270 | https://productosvirales.com.ar/producto/MLA19630911 | philips-review · pilar |
| Oster Dual 7.6L | https://productosvirales.com.ar/producto/MLA28709303 | oster-review · doble-canasta |
| Oster Digital Ventana 4L | https://productosvirales.com.ar/producto/MLA41041543 | oster-review |
| Ninja Crispi 5.2L | https://productosvirales.com.ar/producto/MLA62320294 | ninja-review · pilar |
| PowerXL 3.8L | https://productosvirales.com.ar/producto/MLA36974228 | powerxl-review · economicas |
| Kanji Home 8L | https://productosvirales.com.ar/producto/MLA42113760 | kanji-review · gran-capacidad |
| Gadnic 6.5L | https://productosvirales.com.ar/producto/MLA44142280 | gadnic-review · economicas |
| Suono 10L | https://productosvirales.com.ar/producto/MLA54106293 | suono-review · gran-capacidad |

---

## Sistema de imágenes

### Convención de nombres
Todas las imágenes de productos se guardan en `/public/images/freidoras/` con el formato:
`[marca]-[modelo-slug].webp`

### Imágenes necesarias por artículo

| Imagen | Nombre de archivo | Fuente (MLA ID) | Alt text SEO |
|--------|-------------------|-----------------|--------------|
| Atma FR248ABP 8L | atma-fr248abp-8l.webp | MLA39861162 | Freidora de aire Atma FR248ABP 8 litros |
| Atma Pro FR60AR | atma-pro-fr60ar-6-5l.webp | MLA27351841 | Freidora de aire Atma Pro FR60AR 6.5 litros |
| Atma FR901DP Grill | atma-fr901dp-grill.webp | MLA37004216 | Freidora de aire Atma FR901DP con grill 6.3 litros |
| Atma Pro Doble | atma-pro-doble-frd248ap.webp | MLA40161710 | Freidora de aire Atma Pro Doble canasta 8.5 litros |
| Peabody PE-AFD650N | peabody-pe-afd650n.webp | MLA44703897 | Freidora de aire Peabody PE-AFD650N 6.5 litros |
| Peabody PE-AFD720N | peabody-pe-afd720n-visor.webp | MLA41829394 | Freidora de aire Peabody con visor 360 7.2 litros |
| Peabody PE-AFDL102N | peabody-pe-afdl102n-10l.webp | MLA53776810 | Freidora de aire Peabody doble piso 10 litros |
| Peabody PE-AFG01IX | peabody-pe-afg01ix-grill.webp | MLA23318618 | Freidora de aire Peabody con grill inox 6 litros |
| Philips NA12000 | philips-na12000-4-2l.webp | MLA61393261 | Philips Airfryer NA12000 4.2 litros |
| Philips PHNA35100 | philips-phna35100-doble.webp | MLA55779230 | Philips Airfryer doble canasta 9 litros |
| Philips PHNA23100 | philips-phna23100-13en1.webp | MLA53675940 | Philips Airfryer 13 en 1 6.2 litros |
| Philips HD9280 XL | philips-hd9280-xl.webp | MLA19630913 | Philips HD9280 Essential XL |
| Philips HD9270 | philips-hd9270-6-2l.webp | MLA19630911 | Philips HD9270 Essential 6.2 litros |
| Oster Dual | oster-dual-7-6l-diamondforce.webp | MLA28709303 | Oster Dual DiamondForce 7.6 litros doble canasta |
| Oster Digital Ventana | oster-digital-ventana-4l.webp | MLA41041543 | Oster Digital con ventana 4 litros |
| Ninja Crispi | ninja-crispi-5-2l.webp | MLA62320294 | Ninja Crispi freidora de aire 5.2 litros |
| PowerXL | powerxl-af-e4001-ar-3-8l.webp | MLA36974228 | PowerXL AF-E4001-AR freidora de aire 3.8 litros |
| Kanji Home | kanji-home-kjh-1700dc-8l.webp | MLA42113760 | Kanji Home KJH-1700DC freidora de aire 8 litros |
| Gadnic | gadnic-airfryer-6-5l.webp | MLA44142280 | Gadnic Airfryer 6.5 litros 1400W |
| Suono | suono-airfryer-digital-10l.webp | MLA54106293 | Suono Airfryer Digital 10 litros |

### Cómo obtener imágenes de ML
Para cada producto, podés descargar la imagen principal desde:
`https://www.mercadolibre.com.ar/[slug-del-producto]/p/MLA[ID]`

O vía API (requiere token):
`https://api.mercadolibre.com/items/MLA[ID]` → campo `pictures[0].secure_url`

Convertir a WebP antes de subir. Tamaño recomendado: 800×800px para productos, 1200×630px para OG/featured images.

---

## Schema markup por tipo de artículo

| Tipo | Schema JSON-LD recomendado |
|------|---------------------------|
| Pilar / Guía | Article + FAQPage + BreadcrumbList |
| Review de marca | Review + ItemList + FAQPage + BreadcrumbList |
| Comparativa | Article + FAQPage + BreadcrumbList |
| Informativo | Article + FAQPage + HowTo (para cómo usar) |
| Recetas | Article + FAQPage + Recipe (para cada receta) |

---

## Breadcrumb path por artículo

Todos los artículos siguen esta estructura:
```
Inicio > Freidoras de Aire > [Categoría] > [Artículo]
```

Ejemplo para review:
```
Inicio > Freidoras de Aire > Reviews > Freidora de Aire Atma
```

Ejemplo para comparativa:
```
Inicio > Freidoras de Aire > Comparativas > Atma vs Peabody
```

---

## Checklist de publicación por artículo

- [ ] Keyword primaria en H1 (idéntica o muy cercana al slug)
- [ ] Keyword primaria en los primeros 100 caracteres del cuerpo
- [ ] Meta description: 150-160 chars, keyword + beneficio + CTA implícito
- [ ] Al menos 2 keywords secundarias en H2
- [ ] Imagen featured con alt text optimizado
- [ ] Imagen de cada producto con alt text específico (modelo + litros + marca)
- [ ] Mínimo 5 enlaces internos (según tabla de arriba)
- [ ] Enlace al pilar con anchor text variado
- [ ] Links de afiliado con rel="nofollow sponsored"
- [ ] Sección FAQ al final (5+ preguntas, respuestas <100 palabras para Featured Snippets)
- [ ] Schema JSON-LD en frontmatter
- [ ] Breadcrumb en frontmatter
- [ ] Longitud: reviews 1.800+ palabras / pilar 3.000+ / informativos 1.500+
