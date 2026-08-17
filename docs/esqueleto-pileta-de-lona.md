# Esqueleto listo: guía `pileta-de-lona`

Todo el trabajo que **no depende del stock**, hecho el 2026-08-16 y guardado para retomar cuando ML
tenga góndola de primavera. Esa sesión debería ser sourcing y pegar, sin research.

**No se puede escribir todavía** porque `check-guide-monetization.cjs` bloquea guías sin
`product-card` real. Por eso esto es un doc y no un objeto en `guides.ts`.

## Cuándo retomar

**Fines de septiembre o principios de octubre de 2026.** No antes.

Chequeo de una línea para saber si ya está: entrar a la categoría y contar publicaciones sin bandera
de última unidad.

```
https://listado.mercadolibre.com.ar/hogar-muebles-jardin/jardin-aire-libre/piletas-accesorios/piletas/piletas-estructurales/
```

Con **6 o más publicaciones usables** se puede armar la guía. El 2026-08-16 había 6 en total, de las
cuales solo 3 eran piletas de verdad (las otras eran una pileta para perro, una pieza de ensamblaje y
una de chicos), y dos de esas tres estaban marcadas como última unidad.

Categoría: `MLA40384` (Piletas Estructurales). **No tiene página `/mas-vendidos/` propia**, ya se
probó y devuelve "esta página no existe". Hay que ir por el listado de arriba, que **sí renderiza**,
a diferencia del buscador.

## Por qué vale la pena esperar

| Mes | ago | sep | oct | nov | **dic** | ene | feb |
| :-- | --: | --: | --: | --: | --: | --: | --: |
| pileta de lona | 2.400 | 4.400 | 9.900 | 27.100 | **90.500** | 33.100 | 5.400 |

**14.800/mes de promedio, dificultad SEO 10**, intención transaccional. El pico de diciembre es el
número más alto que apareció en todo el barrido de keywords del sitio.

Publicando en octubre quedan noviembre y diciembre para rankear. Publicando en diciembre, tarde.

## El SERP, verificado el 2026-08-16

**Los diez resultados orgánicos son páginas de categoría de tiendas. Cero comparadores editoriales.**

| Pos | Dominio | DA |
| --: | :-- | --: |
| 2 | intex.com.ar | 20 |
| 3 | listado.mercadolibre.com.ar | 88 |
| 5 | megatone.net | 48 |
| 7 | sodimac.com.ar | 44 |
| 8 | instagram.com (un reel de stock) | 94 |
| 9 | hendel.com | 39 |
| 10 | naldo.com.ar | 44 |
| 11 | easy.com.ar | 51 |
| 14 | **pileton.com** | **14** |
| 18 | fravega.com | 57 |

`pileton.com` rankea con **DA 14**, o sea menos autoridad de la que se necesita para asustarse. Y el
#2 es la web del propio fabricante con DA 20. Una comparativa editorial de verdad no tiene contra
quién pelear acá.

El título de Hendel (#9) confirma además cuáles son las marcas que importan: *"Ofertas de Piletas de
lona Sol de Verano y Pelopincho"*.

## Canibalización: el punto que hay que resolver bien

El sitio ya tiene **tres guías de pileta publicadas el 2026-08-14**, todas en el silo `hogar-jardin`:

| Guía | Categoría | Productos | Qué cubre |
| :-- | :-- | --: | :-- |
| `pileta-pelopincho` (pilar) | piletas | 3 | Qué modelo de Pelopincho, medidas, litros, mantenimiento del agua |
| `pileta-inflable-ninos` | piletas | 3 | Inflables para chicos, por edad |
| `colchon-inflable-2-plazas` | colchones-inflables | 3 | Otra cosa, pero está en el silo |

**El riesgo es real: una Pelopincho ES una pileta de lona.** Y la guía de Pelopincho ya tiene
secciones genéricas que se pisan ("Estructural o inflable", "Cómo elegir la medida", "Cuánto sale una
pileta en Argentina", "Cómo mantener el agua limpia").

**La solución, que sale del propio SERP:** la intención de "pileta de lona" es **comparar entre
marcas**, no elegir modelo de una. Es el mismo patrón que ya funcionó en perfumes árabes: pilar
genérico multi-marca + páginas de marca.

- `pileta-de-lona` = **comparativa multi-marca**: Sol de Verano contra Pelopincho contra Namuncurá
  contra Bestway. Su razón de existir es exactamente lo que la guía de marca no puede hacer.
- `pileta-pelopincho` = sigue siendo la de marca, "qué modelo de Pelopincho".

**Reglas duras para no pisarlas:**
1. **NO repetir** "cómo mantener el agua limpia": ya está en `pileta-pelopincho`, hay que linkear ahí.
2. **NO repetir** la explicación de estructural contra inflable: idem, linkear.
3. El pilar nuevo se concentra en **qué marca**, no en qué medida.
4. Enlazado bidireccional con las tres guías existentes.
5. **No re-optimizar `pileta-pelopincho`**, que se publicó hace días. Dejarla madurar.

## Estructura propuesta

Mismo molde que las cinco guías del 2026-08-16, que cerraron con GO de Codex y de agy.

- `slug: "pileta-de-lona"`, `silo: "hogar-jardin"`, `category: "piletas"` (ya existe)
- **NO** `pillar: true` mientras `pileta-pelopincho` lo tenga. Decidir en la sesión si conviene mover
  el pilar a esta, que apunta a la keyword más gorda del rubro.
- Hero image, `directAnswer` que conteste en las 2 primeras líneas, callout de **"Respuesta rápida"**
  (agy lo marcó como lo que más ayuda a que un LLM te cite), `trust-block` de metodología.

Secciones:

1. **H2 — Las marcas de pileta de lona en Argentina.** El corazón de la guía y lo que la diferencia.
   Tabla marca por marca. Es lo único que ninguna de las tres guías existentes hace.
2. **H2 — Cuántos litros necesitás según cuántos son.** Traducir litros a personas, que es como
   piensa el comprador.
3. **H2 — Ranking**, con `product-card` por producto.
4. **H2 — Comparativa** en tabla: marca, medida, litros, precio, opiniones.
5. **H2 — Lo que no viene incluido.** Candidato fuerte al hallazgo del rubro: filtro, bomba, cobertor,
   cloro. Verificar producto por producto qué trae cada caja.
6. **H2 — Cómo elegir**, con los enlaces cruzados.
7. FAQ con 6-8 preguntas.

## Lo que hay que verificar en la sesión de sourcing

- **Litros declarados contra medidas declaradas.** En los cinco rubros de hoy apareció el mismo
  patrón: el título dice un número y la ficha otro. Acá el candidato obvio es litros contra
  largo x ancho x alto.
- **Qué incluye la caja.** Si trae filtro, bomba o cobertor, o si se venden aparte. Es el equivalente
  al kit de salida de humos de salamandra, que costaba $211.007 sin avisar.
- **Peso del agua.** Una pileta de 2.700 litros pesa 2.700 kg llena. Verificar si alguna publicación
  advierte sobre la base o el terreno. Si ninguna lo dice, es un ángulo de honestidad.
- **Reseñas con rating**, e **imágenes con GET** (el CDN de ML responde 405 a HEAD).
- **Envío**: en los cinco rubros de hoy todas las publicaciones mostraban "envío gratis por ser tu
  primera compra", que es promo de cuenta y no atributo. Chequear una por una.
- **Precio con `meta[itemprop="price"]`**, nunca con regex sobre el texto de la página: ese atajo
  falló tres veces el 2026-08-16, una de ellas devolviendo el precio de otro producto.

## Keywords hermanas para después

Si el pilar funciona, el silo da para más. Todas verificadas con Ubersuggest el 2026-08-16:

| Keyword | Volumen | SD |
| :-- | --: | --: |
| pileta pelopincho | 18.100 | 10 |
| pileta namuncurá | 18.100 | 12 |
| pileta de patio | 6.600 | 11 |
| inflables para la pileta | 4.400 | 11 |
| bombas para pileta | 3.600 | **8** |
| pileta redonda | 3.600 | 11 |
| pileta bestway | 3.600 | 12 |
| cubre pileta | 3.600 | 12 |
| pileta estructural | 880 (pico 4.400 en dic) | 11 |

**Ojo con "bombas para pileta"**: 3.600 con SD 8, pero la variante "bomba filtrante pileta" tiene
**10/mes y SD 44**. La forma exacta de la keyword cambia todo, así que verificar antes de elegir.
