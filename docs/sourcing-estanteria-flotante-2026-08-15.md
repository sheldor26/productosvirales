# Sourcing estantería flotante — 2026-08-15

Keyword objetivo: **estantería flotante**, 12.100 búsquedas/mes (Keyword Planner). SERP verificado
el 2026-08-15 como 🟢: 100% retail (ML x3, Frávega, Coppel, Ciudad Muebles, SKLUM). Cero
comparadores editoriales, argentinos o extranjeros.

Sourcing por `https://www.mercadolibre.com.ar/mas-vendidos/MLA431779` (categoría Estanterías).
El `category_id` salió del payload `CategoryListItem` del hub de Hogar, Muebles y Jardín, no del
breadcrumb. El buscador de ML sigue sin renderizar bajo automatización, y `curl` directo devuelve
la página de tráfico sospechoso de ML: el único camino que funciona es el navegador real sobre
`/mas-vendidos`.

## Lo primero que muestra el ranking: la categoría es otra cosa

De los 20 más vendidos de "Estanterías", **14 son racks metálicos de 5 niveles** para garaje,
depósito o cocina. Los estantes flotantes son 6, y aparecen intercalados entre los racks.

Es una separación de intención, no un detalle: quien busca "estantería flotante" quiere una
repisa que parezca pegada a la pared, y el ranking de ML le devuelve mayoritariamente estructuras
de caño galvanizado. La guía tiene que resolver eso en la primera pantalla.

## Los 6 candidatos

| # | Producto | ID | Precio | $/estante | Rating | Reseñas | Vendidos | Stock |
| --: | :-- | :-- | --: | --: | --: | --: | :-- | :-- |
| 1 | Exahome kit x3, 60x20, blanco | MLA35809709 | $42.725 | $14.242 | 4.6 | 3.846 | +10mil | +10 |
| 2 | Mamut Deco kit x3, 60x20, blanco | MLAU828916072 | $31.349 | $10.450 | 4.7 | 68 | +1000 | +50 |
| 3 | Urbana Fábrica kit x3, 60x20, negro | MLAU3891560042 | $38.120 | $12.707 | 4.8 | 40 | +100 | +50 |
| 4 | SAJO kit 3 repisas + perchero, natural | MLA27777242 | $26.999 | — | 4.8 | 131 | +1000 | +50 |
| 5 | SAJO kit 40/60/80 + perchero, negra | MLA36299841 | $28.599 | — | 4.5 | 727 | +500 | +50 |
| 6 | Exahome individual 40x20, blanco | MLA29565555 | $8.071 | $8.071 | 4.5 | 593 | +5mil | +50 |

Ninguno es compra internacional. Los seis son de fabricación nacional.

## El eje de la guía: los 10 kg no son del estante, son de tu pared

**Este es el hallazgo que ordena todo.** Tres de los seis declaran "Peso máximo soportado: 10 kg"
en la ficha de ML, presentado como una propiedad del producto. La web de Mamut Deco, fabricante
del #2, lo dice de otra manera: soporta **aproximadamente hasta 10 kg con pared firme e
instalación correcta**, y aclara que la capacidad **depende de la firmeza del muro, la fijación y
la distribución de la carga**.

O sea: el número que ML publica como spec del estante es en realidad una spec del conjunto
estante + ménsula + tarugo + pared. En un país donde media construcción nueva es durlock, la
diferencia no es teórica.

Ninguna de las seis fichas de ML menciona la palabra durlock, ni distingue entre pared de ladrillo
y placa de yeso. Es el dato que decide si el producto funciona o se te viene abajo, y no está.

## El segundo dato que nadie publica: qué mecha necesitás

La ménsula invisible se fija con un tarugo grueso, y el diámetro **cambia según la marca y no
está en ninguna ficha de ML**:

- **Mamut Deco** (web del fabricante): recomienda **mecha de 10 mm**, dos ménsulas invisibles de hierro.
- **Exahome**: no lo publica. Los compradores lo descubren al abrir la caja, y lo cuentan:
  *"necesitas mecha del 12, que parece que es difícil de conseguir"*, *"tuve que comprar tarugos
  n14 y el agujero es grandísimo, tuve que agregarle enduido a la pared"*.

Una reseña resume el problema mejor que cualquier ficha técnica: *"me parece exagerado la
necesidad de semejante taco para una repisa tan pequeña... al tener que hacer semejante
perforación para poner el taco, cuando pones la repisa se puede notar, y más aún si la pared no es
muy buena que digamos"*.

La guía debería abrir con esto: **antes de elegir el estante, fijate qué mecha tenés.**

## Verificación contra fabricante

Igual que en conservadoras y mesa ratona, la ficha de ML falla:

| Producto | Lo que declara ML | Qué dice el fabricante |
| :-- | :-- | :-- |
| **Exahome** (ambas) | "Largo x Altura x Profundidad: 60 cm x **18 cm** x 20 cm" y "Espesor: 1,8 cm" en la misma ficha | Los dos números son el mismo dato mal cargado. La descripción del propio vendedor dice **"ESPESOR: 18MM"**, y la web de Exahome vende melamina de **18 mm**. La "altura" de 18 cm es el espesor multiplicado por 10 |
| **Mamut Deco** | "Formato de venta: **Unidad**" en una publicación titulada "3 Estantes Flotantes" | La descripción dice **"PRECIO POR COMBO"** y "Kit 3 Estantes Flotantes". Son 3. El campo de la ficha está mal, y si alguien lo lee sin bajar a la descripción, calcula mal el precio por estante |
| **SAJO natural** | "Peso máximo soportado: 8 kg" | **La web de SAJO no documenta el peso soportado en ningún producto.** El 8 kg no está verificado por el fabricante y así se declara en la ficha del sitio |
| **SAJO** (ambas) | "Material: Madera" | La web del fabricante especifica **pino macizo**. Una reseña lo confirma: *"Es pino común pero te lo dan pintado"* |
| **Urbana Fábrica** | "Fabricante: Urbana.Fabrica" | **Sin presencia web verificable.** No hay sitio del fabricante ni ficha oficial que cruzar. Es el único de los seis donde la verificación no se pudo cerrar |

## El dato de SAJO que no está en la ficha

La descripción del vendedor, no la ficha técnica, avisa: **"Los productos son teñidos, exceptuado
el natural que se envía sin teñir. Se recomienda barnizar."** Confirmado en la web de SAJO, que
agrega "lijar finamente".

O sea que el kit natural (#4), el más barato de los seis, **llega en madera cruda y hay que
barnizarlo**. No aparece en ningún campo de la ficha de ML, solo en el texto largo. Es el mismo
tipo de dato que "no trae tornillos" en mesa ratona: cambia el trabajo real de la compra.

## Los dos formatos son productos distintos

No es un ranking de seis cosas iguales. Hay dos familias:

- **Melamina flotante plana** (#1, #2, #3, #6): 20 cm de profundidad, 18 mm de espesor, ménsula
  invisible de hierro, hasta 10 kg. Es la repisa que "flota" de verdad.
- **Pino macizo con perfil** (#4, #5): 12 a 12,7 cm de profundidad y 9 a 16 cm de alto, o sea que
  tienen borde. Vienen de a tres medidas (40/60/80) más un perchero. Más decorativas, más chicas,
  y no entra un libro apoyado de plano.

La profundidad es lo que separa un uso del otro: 20 cm aguanta un libro o un parlante; 12,7 cm es
para plantas, frascos y adornos.

## La comparación que nadie publicó

Los tres kits de melamina de 60x20 son el mismo producto en specs (18 mm, ménsula invisible,
10 kg declarados) a tres precios distintos:

| Producto | Precio | $/estante | Reseñas | Diferencia vs el más barato |
| :-- | --: | --: | --: | --: |
| Mamut Deco | $31.349 | $10.450 | 68 | — |
| Urbana Fábrica (negro) | $38.120 | $12.707 | 40 | +22% |
| Exahome | $42.725 | $14.242 | 3.846 | **+36%** |

Exahome sale 36% más caro que Mamut por la misma spec. Lo que compra esa diferencia es respaldo:
**3.846 opiniones contra 68**. No es una estafa ni un chollo, es un intercambio real y la guía
tiene que plantearlo así, sin empujar a ninguno de los dos lados.

## Contras reales detectados en las reseñas

- **Exahome kit x3**: la instalación es la queja dominante. Mecha del 12 difícil de conseguir,
  tarugos n14, agujero grande que hay que tapar con enduido, tornillos que vienen torcidos
  (*"los tornillos vienen un poco chuecos, y hay que hacerlos enderezar"*), y unidades que llegan
  con las perforaciones sin terminar. Aun así mantiene 4.6 con 3.846 opiniones: el producto gusta,
  el montaje no.
- **Exahome individual 40 cm**: el mismo tarugo enorme para un estante mucho más chico, y
  *"algunos detalles de terminación"*.
- **Mamut Deco**: *"algo truchotos los pernos pero tenía otros"*. Base de 68 opiniones, chica al
  lado de Exahome.
- **Urbana Fábrica**: solo 40 opiniones y +100 vendidos. Las reseñas son buenas y varias destacan
  que quedan firmes, pero es el respaldo estadístico más flojo de los seis y el único fabricante
  que no se pudo verificar.
- **SAJO natural**: hay que barnizarlo (arriba), y el perchero *"hay que armarlo, así que
  paciencia"*.
- **SAJO negra**: la mejor reseña del grupo también marca el límite del producto: *"Es pino común
  pero te lo dan pintado, con tornillos y tarugos más las perforaciones. Para deco me parece
  excelente"*. Para deco. No para carga.

## Lo que falta

- **Los links meli.la de los seis.** Los genera Juan; sin eso no se escribe la guía.
- Confirmar si alguna de las publicaciones está excluida del Programa de Afiliados, cosa que solo
  se detecta al generar el meli.la.
