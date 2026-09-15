# Sourcing colchones — 2026-08-16

Dos guías de un solo viaje de sourcing, las dos de ticket alto y con la curva plana todo el año.

| Guía | Keyword | Volumen | SD | Curva |
| :-- | :-- | --: | --: | :-- |
| `colchon-2-plazas` | colchón 2 plazas | **27.100/mes** | **9** | 22.200 a 33.100, plana |
| `colchon-1-plaza` | colchón 1 plaza | **22.200/mes** | **10** | 18.100 a 22.200, plana |

Las dos superan a freezer vertical (22.200, SD 11), que fue la mejor keyword de la sesión hasta acá.

**Góndola verificada** en `mas-vendidos/MLA1608` (Camas, Colchones y Accesorios): 19 productos en el
ranking, **11 son colchones**, **ninguno con bandera de última unidad**, varios con +5mil vendidos.
Categoría sana, al revés de piletas el mismo día.

**Canibalización:** el sitio solo tiene `colchon-inflable-2-plazas`, que es otra cosa (inflables de
camping y visitas). Las dos guías nuevas tienen que enlazar a esa y diferenciarse explícitamente.

## Los 9 productos, verificados y con link de afiliado

Precios leídos con `meta[itemprop="price"]` y con el `og:title`, **no** con regex sobre el texto de
la página (ver más abajo). Los `meli.la` los generó Juan y se verificaron uno por uno contra el
producto esperado.

### Guía 1: colchón 2 plazas

| # | Producto | ID | Medida | Precio | Stock | meli.la |
| --: | :-- | :-- | :-- | --: | --: | :-- |
| 1 | YOLO by Simmons | MLA22938951 | 190x140 | 441.896 | +50 | 2N1bYcv |
| 2 | Sueño Dorado Box Prime | MLA42252800 | 140x190x25 | 392.699 | 54 | 1EJ18ew |
| 3 | Sueño Dorado Box Plus **Queen** | MLA40490705 | 160x200 | 369.324 | 51 | 1D2c6Kb |
| 4 | Känn Livet Hybrid, resortes pocket | MLA54221370 | 140x200x25 | 358.899 | +50 | 24tR5jJ |

### Guía 2: colchón 1 plaza

| # | Producto | ID | Medida | Precio | Stock | meli.la |
| --: | :-- | :-- | :-- | --: | --: | :-- |
| 1 | La Espumería Freestyle Box | MLA28530883 | 100x200 | 327.762 | 15 | 16QU87i |
| 2 | Sealy Cocoon Chill Box | MLA72723907 | 090x190 | 297.999 | 21 | 2JWM2Qp |
| 3 | Calm en caja, 2 capas de espuma | MLA18635357 | 100x190 | 292.847 | +50 | 1jBuggH |
| 4 | Känn Livet KL-Eterna | MLA54967234 | 90x190x25 | 261.899 | +50 | 2h7iE5D |
| 5 | Fika Pocket en caja | MLA63548072 | 80x190x20 | 175.499 | +50 | 2RUFwjc |

Ocho marcas distintas: Simmons, Sueño Dorado, Känn Livet, La Espumería, Sealy, Calm, Fika.

## Descartado

**Multiflex Sol** (MLA34951653, sommier + colchón 2½ plazas, $306.299): quedaban **2 unidades**, el
mismo criterio con el que se descartó el Tromen Pehuen. Además no es un colchón solo sino un combo
con sommier, así que no compara contra el resto en igualdad de condiciones.

## Ángulo 1: los nombres de medida no corresponden a medidas

Este es el hallazgo que sostiene las dos guías, y sale de los títulos de las propias publicaciones.

| Nombre comercial | Medidas reales encontradas |
| :-- | :-- |
| **2 plazas** | 140x190 (Sueño Dorado) y **140x200** (Känn Livet). El YOLO figura como 190x140 |
| **1 plaza y media** | **90x190** (Känn Livet), **100x190** (Calm), **100x200** (La Espumería), **090x190** (Sealy) |
| **1 plaza** | 80x190 (Fika) |

O sea que quien busca "colchón 2 plazas" recibe productos con **10 cm de diferencia de largo**, y
quien busca "1 plaza y media" recibe cuatro combinaciones distintas de ancho y largo. Si ya tenés el
sommier, esos centímetros deciden si te entra o no, y ninguna publicación lo advierte.

Ojo con no generalizar de más: esto está verificado sobre estos nueve productos, no sobre todo el
rubro.

## Ángulo 2: el formato "en caja" se comió el ranking

**Ocho de los diez** colchones del ranking se venden comprimidos en caja: YOLO, Sueño Dorado (los
dos), Känn Livet (los dos), Calm, Sealy, Fika, La Espumería. La keyword específica "colchón en caja"
tiene solo 1.900/mes, así que **no da para guía propia, pero sí para una sección** en las dos.

Falta verificar en las reseñas las contras reales del formato: tiempo de expansión, olor inicial y
si vuelve o no a la altura declarada.

## Ángulo 3: el volumen de opiniones es enorme comparado con el resto del sitio

El YOLO by Simmons tiene **16.843 opiniones** leídas en la página renderizada. Es el número más alto
visto en todo el proyecto, muy por encima de las 1.153 del Qutral Andes o las 1.002 del Philco.

**Precaución:** los campos `reviewCount` y `ratingValue` del JSON embebido devolvieron **7932** y
**"4"** para ese mismo producto, que no coinciden con lo que muestra la página. Para las fichas hay
que tomar el número renderizado, no el del JSON.

## Cómo se leyeron los precios, y el error que casi se cuela

Sacar el precio con un regex tipo `/\$\s*[\d.]{5,}/` sobre `document.body.innerText` **no funciona**:

- En `MLA22938951` devolvió **$1.906.932** cuando el precio real es **$441.896**.
- En `MLA54221370` devolvió el precio de **otro producto** que estaba en un carrusel de recomendados
  ("colchon cannon sublime pillow 180x200").

Lo que sí funciona, y coincide entre sí y con lo que ve el comprador:

```js
document.querySelector('meta[itemprop="price"]')?.content
document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction')?.textContent
```

El `og:title` del HTML también trae el precio embebido y se puede leer con `fetch()` sin renderizar,
que es como se sacaron los nueve de una sola pasada.

## Lo que falta antes de escribir

- **Specs por producto:** densidad de la espuma, tipo de resorte, altura, garantía. Nada de esto está
  todavía verificado.
- **Reseñas con rating** de cada uno, para las contras honestas.
- **Imágenes**, verificadas con GET porque el CDN de ML responde 405 a HEAD.
- **Cruzar contra fabricante** donde exista (Simmons, Sealy y Suavestar tienen sitio propio).
- **Chequear el envío** producto por producto: en freezer vertical los seis mostraban "envío gratis
  por ser tu primera compra", que es promoción de cuenta y no atributo del producto.
