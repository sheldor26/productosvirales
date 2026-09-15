# Sourcing cocina a gas — 2026-08-16

Tercer rubro de la tanda, distinto de colchones. Keyword **cocina a gas**: **22.200/mes**,
dificultad SEO **12**, intención transaccional, y la curva es **plana todo el año** (18.100 a
27.100). Ticket alto.

El sitio no tiene nada de cocinas: hay microondas, horno eléctrico y robot de cocina, pero ninguna
guía de cocina a gas. Entra en el silo `cocina`, donde acaba de entrar freezer vertical.

**Góndola verificada** en `mas-vendidos/MLA4344` (Cocinas): **20 productos, ninguno con bandera de
última unidad**, con nueve marcas distintas y ventas de +100 a +10mil. Es la categoría más sana de
todo el día.

## Candidatos con precio y stock verificados

Precios leídos del `og:title` vía `fetch`, método validado contra la página renderizada.

| Producto | ID | Precio | Stock | Ventas | meli.la |
| :-- | :-- | --: | --: | :-- | :-- |
| Escorial Candor S2, **gas natural** | MLA6056509 | 369.999 | +10 | **+10mil** | 2PTi6PX |
| Siam Essential 50 cm multigas | MLA61348769 | 397.669 | 100 | +1000 | 1Csosp4 |
| Usman Industrial 52 cm 4 hornallas | MLA36486302 | 429.999 | 9 | +1000 | 28merHk |
| Florencia 5518F inox 56 cm Easy Clean | MLA8791802 | 547.816 | 9 | +1000 | 1VfvUv7 |
| Drean 56 cm negra, horno 74 L, multigas | MLA63018001 | 751.999 | 58 | +500 | 1Z7fiim |
| Drean CD5617AI0 inox **con Air Fryer** | MLA48950671 | **1.440.118** | +10 | +500 | 1VEVrXH |

Fuera de la guía, verificada por las dudas: Longvie 13331GF (MLA17806801), $841.257, +10 disponibles.

**Descartados por stock bajo**, con el mismo criterio del Tromen Pehuen: Florencia Recta 5517F
(2 unidades), Sansei Essential (4), Escorial Master Classic (6).

## Ángulo 1: el más vendido del rubro no funciona con garrafa

Es el hallazgo más consecuente de toda la sesión, porque no es un matiz de ficha: es si el
electrodoméstico anda o no anda en tu casa.

La **cocina más vendida de la categoría**, con **+10mil unidades**, es la **Escorial Candor S2**, y
su propio título dice **"gas natural"**. No es multigas. En una parte enorme del país se cocina con
**garrafa**, y ahí esa cocina no sirve sin conversión.

Al lado, en el mismo ranking, hay cocinas que dicen **"multigas"** en el título (Siam Essential,
Sansei Essential, las dos Drean) y una que dice explícitamente **"gas envasado"** (Escorial Master
Classic).

O sea que el comprador que entra, ordena por más vendido y compra el primero, puede terminar con una
cocina que no puede conectar. Y la diferencia está en una palabra del título, no en un campo
destacado de la ficha.

Falta verificar producto por producto qué declara la ficha técnica en el campo de tipo de gas, y si
alguna aclara si viene con kit de conversión.

## Ángulo 2: el ancho, que decide si entra en el hueco

Los anchos del ranking son **50, 52 y 56 cm**. En una cocina de mueble a mueble, esos 6 cm deciden.
Es el mismo problema de medida que apareció en colchones y en freezer vertical.

## Ángulo 3: la air fryer adentro del horno cuesta $688.119

La **Drean CD5617AI0** trae **air fryer integrada** y sale **$1.440.118**. La Drean 56 cm sin esa
función, del mismo fabricante y con horno de 74 litros, sale **$751.999**.

**$688.119 de diferencia**, o sea que la cocina con air fryer cuesta **92% más** que su hermana sin
air fryer. Con esa diferencia se compra una freidora de aire de las que ya compara el sitio y sobra
plata. Es una cuenta que la guía tiene que hacer, y conecta directo con las guías de freidora que ya
existen.

## Lo que falta antes de escribir

- **Ficha técnica de cada uno**: tipo de gas declarado, cantidad de hornallas, capacidad del horno,
  encendido, y si trae kit de conversión.
- **Reseñas con rating** e **imágenes** verificadas con GET.
- **Chequear el envío** producto por producto, como en freezer vertical.
