# Threads — seguimiento de posts de bajas de precio

Log manual para encontrar qué patrón funciona (gancho, categoría, franja horaria).
Completar vistas/seguidores a las 24-48hs de publicado. Entradas nuevas arriba.

> ⚠️ **Todas las filas fechadas 2026-07-20 quedaron con precios desactualizados**:
> se armaron con un diff cacheado de ese día que se siguió reusando por error
> en mensajes de días posteriores (25/07 real). Hubo 2 corridas de precios más
> después (22/07, 24/07). Antes de publicar cualquiera de esas filas,
> confirmar el precio actual en ML — no confiar en el "antes/ahora" original.
> Columna "Stock estable" (chequeado 20/07 contra `docs/cambios-de-stock.md`,
> 2+ apariciones = historial de pausas) es una señal aparte, sigue siendo
> válida, pero no alcanza sola — ver memoria `threads-drops-chequear-stock-inestable`.

| Fecha | Producto | Categoría | Gancho | Stock estable | Vistas | Seguidores | Notas |
|---|---|---|---|---|---|---|---|
| 2026-07-16 | Copa Mundial FIFA 2026 Panini | Coleccionables | 1 (dato) | — | | | tema, no baja grande |
| 2026-07-20 | Tira LED RGB Hytoshy 5m | Hogar/decor | 1 (dato) | **NO (6 flips)** | | | precio real en ML: $16.000, confirmado mal por Juan |
| 2026-07-20 | Lattafa Yara Moi EDP 100ml | Belleza | 1 (dato) | **NO (9 flips)** | | | precio real en ML: $50.934, confirmado mal por Juan |
| 2026-07-20 | Cargador Gadnic Power Bank 20000mAh | Tecnología | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Masajeador Cervical Lumbar Gadnic | Belleza/Salud | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Microondas Grill Samsung MG23F3K3TAK | Cocina | 1 (dato) | sí (0) | | | repite gancho eléctrico (secundario) |
| 2026-07-20 | Afeitadora Wahl Travel Shaver | Cuidado Personal | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Audio-Technica ATH-M30x | Auriculares | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Aspiradora Robot Gadnic 5 Modos | Electrodomésticos/robot-aspiradora | 1 (dato) | **NO (12 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Balanza Femmto BCS15 | Salud y Bienestar | 1 (dato) | **NO (12 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Amazon Fire TV Stick 4K Select | Tecnología | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Freidora Philips Canasta Doble 9L PHNA35100 | Cocina/airfryer | 1 (dato) | sí (0) | | | gancho eléctrico (20A vs 10A) |
| 2026-07-20 | Ducha Eléctrica Lorenzetti Loren Shower Ultra | Climatización/seguridad | 1 (dato) | sí (0) | | | gancho de seguridad, no solo precio |
| 2026-07-20 | Termo Stanley Mate System Classic | Hogar/mate | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Freidora Oster Dual 7.6L Diamondforce | Cocina/airfryer | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Auriculares Logitech G733 | Gaming | 1 (dato) | **NO (12 flips)** | | | baja más grande del día (-46%), sin confirmar en ML |
| 2026-07-25 | Cepillo de Dientes Suono Premium | Cuidado Personal | 1 (dato) | sí (0) | | | verificado con Bright Data en vivo, coincide exacto |
| 2026-07-25 | Aspiradora Robot Roborock Q7 L5 | Electrodomésticos/robot-aspiradora | 1 (dato) | sí (0) | | | verificado: fecha real 24/07 + sitio en vivo coincide |
| 2026-07-25 | Google TV Streamer 4K | Tecnología | 1 (dato) | sí (0) | | | verificado: fecha real 24/07 + sitio en vivo coincide |
| 2026-07-20 | Xiaomi Vacuum X20 Max | Electrodomésticos/robot-aspiradora | 1 (dato) | sí (0) | | | premium, gancho enchufe extranjero — DESACTUALIZADO, no publicar sin reconfirmar |
| 2026-07-20 | Parlante Torre Aiwa AW-T2018R | Audio | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Dispensador de Alimentos 5 Comp. | Cocina/organización | 1 (dato) | sí (0) | | | |
| 2026-07-19 | Cámara Ezviz TY1 | Seguridad | 1 (dato) | | | |
| 2026-07-19 | Parlante JBL Charge 5 | Audio | 1 (dato) | | | corrige fila anterior (era Go Essential por error) |
| 2026-07-16 | Planchita Allure PL1010AP | Cuidado Personal | 1 (dato) | | | |
| 2026-07-16 | Mini Proyector Maxnova HY320 | Tecnología | 1 (dato) | | | |
| 2026-07-16 | Termotanque Exahome 40L | Climatización | 1 (dato) | | | |
| 2026-07-16 | Control GameSir Nova 2 Lite | Gaming | 1 (dato) | | | |
| 2026-07-16 | Proyector Oso Astronauta MTI 731 | Hogar/novedad | 1 (dato) | | | |
| 2026-07-16 | Pava Eléctrica Telefunken PE800 | Cocina/mate | 1 (dato) | | | |
| 2026-07-16 | Torre Sonido JVC XS-LA5214 | Audio | 1 (dato) | | | |
| 2026-07-16 | Auriculares Alpina F50 Pro | Audio/deporte | 1 (dato) | 8 | 1 | primer post de la cuenta |

## Ganchos (referencia)

1. **Dato** — arranca con el número de la baja o el precio.
2. **Experiencia** — arranca con "lo venía mirando / lo tenía marcado".
3. **Contra primero** — arranca con el defecto real, después el precio.

## Cómo leer el patrón (revisar cada 5-6 posts)

- ¿Qué gancho repite mejor ratio vistas/seguidor?
- ¿Categoría con más tracción (audio, gaming, hogar, perfumes)?
- ¿Franja horaria del post con más vistas tempranas?
