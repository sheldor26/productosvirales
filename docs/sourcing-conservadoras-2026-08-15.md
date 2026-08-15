# Sourcing conservadoras — 2026-08-15

Datos extraídos a mano de las fichas de catálogo de MercadoLibre Argentina el 2026-08-15, con
capacidades verificadas después contra las webs de los fabricantes.

**No se usó Bright Data:** su MCP pide autorización y la sesión no podía correr el OAuth. Se
navegaron las fichas una por una en Chrome.

**Gotcha nuevo de ML:** el buscador (`listado.mercadolibre.com.ar/...`) **no renderiza** en el
Chrome con automatización: el stream de React queda colgado en `<template id="B:0">` y la página
se queda con header y footer solos. Las fichas de producto (`/p/MLA...`) sí renderizan bien.
El camino que funciona para descubrir productos es **`/mas-vendidos/<categoría>`**, que también
renderiza: para conservadoras es `https://www.mercadolibre.com.ar/mas-vendidos/MLA47742`. Es
mejor fuente que el buscador porque devuelve lo que realmente se vende, no lo que ML quiere
mostrar.

---

## Lineup final: 5 productos, todos nacionales, todos con stock

| # | Producto | MLA | Precio | Rating | Reseñas | Stock | Rol en la guía |
| --: | :-- | :-- | --: | --: | --: | :-- | :-- |
| 1 | Termolar SUV 20L | MLA22505559 | $43.369 | 4.8 | 30.630 | +50 | La más vendida de la categoría |
| 2 | Termolar SUV 32L | MLA22352427 | $66.712 | 4.8 | 5.011 | +50 | El salto lógico de tamaño |
| 3 | Mor Camping 12L | MLA22352425 | $34.902 | 4.8 | 960 | +25 | La chica, para dos personas |
| 4 | Mor 75L | MLA28583015 | $113.850 | 4.8 | 764 | +5 | La grande pasiva |
| 5 | Vöhler 33L eléctrica c/ruedas | MLA61602437 | $242.499 | 4.8 | 169 | +50 | Ruedas + enchufe 12V/220V |

La Vöhler es la única con reseñas inequívocamente argentinas ("mi marido la lleva en el camión",
"para una flia de camping re va"). Es también la única eléctrica: no compite con las pasivas,
resuelve otro problema (auto, camión, viaje largo).

## Los 3 descartados y por qué

| Producto | Motivo |
| :-- | :-- |
| **Igloo Trailmate 71L** (MLA2090857969) | Compra Internacional. $884.737, cero reseñas, MLA de la serie 20xxxxxxxx. Todos sus relacionados (RTIC, Engel, Ninja, Coleman Pro) son lo mismo. Reemplazado por la Mor 75L, que es nacional, tiene 764 reseñas y sale **$113.850**, o sea 7,8 veces menos |
| **Soprano 50L c/ruedas** (MLA27646320) | 2 unidades de stock. La guía apunta a diciembre |
| **Coleman Chiller 28qt** (MLA34075252) | 2 unidades de stock, más el error de ficha más grave de la tanda (ver abajo) |

---

## Verificación de capacidades contra fabricante

Se cruzó cada spec numérica contra la web de la marca. **La ficha de ML falló en 4 de 6.**

| Producto | Lo que dice ML | Lo que dice el fabricante | Veredicto |
| :-- | :-- | :-- | :-- |
| **Coleman Chiller 28qt** | 45 L, 36 latas | **26,5 L, 19 latas** | ML está mal por casi el doble. Publicar ese 45 L habría sido un dato falso |
| **Termolar SUV 32L** | 26 latas, 4 botellas, 26x42x32 cm | **45 latas de 350 ml, 6 botellas de 2 L, 52,7x32,1x39 cm** | ML copió los números de la de 20 L. Por eso la de 20 L parecía más grande que la de 32 L: las medidas equivocadas eran las de la 32, no las de la 20 |
| **Termolar SUV 20L** | Poliéster, "Bolsa Lancheira Térmica" | **Poliestireno expandido (EPS)**, conservadora rígida | ML la etiqueta como si fuera una lonchera blanda. Las medidas (43x27x33) sí coinciden |
| **Mor 12L** | 13 latas, 7 botellas, 1,13 kg / plegable: Sí | **13 latas, 7 botellas de 600 ml, 1,13 kg**, polipropileno inyectado rígido | Números correctos. "Plegable: Sí" es falso |
| **Mor 75L** | 110 latas, 12 botellas, 6,72 kg | **110 latas, 15 botellas de 2 L**, 6,72 kg | Casi todo bien, solo las botellas quedan cortas |
| **Soprano 50L** | 68 latas (ficha) vs 72 (título) | **68 latas de 350 ml** | Acá la ficha técnica es la correcta y **el título del vendedor es el que miente** |

**Regla que sale de esto:** no alcanza con desconfiar de la ficha técnica de ML. En Coleman y
Termolar mentía la ficha; en Soprano mentía el título. Hay que cruzar las dos contra el
fabricante y, cuando no cierran, decirlo en la guía en vez de elegir un número.

Termolar, Mor, Soprano y Coleman tienen todas sitio propio con specs publicadas, así que en este
rubro la verificación siempre es posible. No hay excusa de "marca china sin fabricante".

## Las reseñas del catálogo no son todas argentinas

Las fichas de catálogo mezclan reseñas de toda la región. Se nota en el vocabulario: "nevera
portátil", "refrescos", "caixa térmica", "lancheira". Las 30.630 reseñas de la Termolar de 20 L
son un número imposible para el mercado argentino de un producto de nicho.

**Cómo se escribe entonces:** el puntaje y el conteo se usan como lo que son, la valoración del
catálogo de ML, sin atribuirles nacionalidad. Nada de "30.630 argentinos la eligieron". Cuando
se cite una reseña textual, se eligen las que están claramente escritas en argentino (la Vöhler
tiene varias) y se dejan afuera las traducidas del portugués.

## Contras reales ya detectados en las reseñas

- **Mor 75L**: no trae tapón de drenaje. "Debería tener un tapón en la parte inferior, para
  drenar el agua sin tener que sacar todo para vaciarla."
- **Mor 75L**: al menos un comprador la recibió con una sola bandeja en vez de dos.
- **Termolar 20L**: las manijas flojean con la conservadora llena. "Las asas son firmes, pero
  con el peso se vuelven un poco dudosas."
- **Termolar 20L**: se queda chica para familia. "Ideal para parejas que llevan pocas cosas,
  para una familia ya no lo recomiendo."
- **Mor 12L**: la gente compra sin dimensionar 12 L y le queda chica.
- **Vöhler**: tarda en enfriar y es voluminosa. "Tarda un rato pero mantiene bien el frío",
  "es algo armatoste".

## Lo único que falta

**Los links de afiliado meli.la.** Los genera Juan. Sin eso no se escribe la guía, por la regla
de pedir los canónicos antes de armar nada.
