/**
 * Guard compartido de precios verificados a mano.
 *
 * Por que existe: el 2026-08-12 la corrida automatica de Bright Data piso 11
 * de 15 precios que se habian verificado a mano en MercadoLibre, devolviendolos
 * a sus valores viejos (Spica $29.099 -> $17.499, Vanta $98.000 -> $70.005).
 * Se re-verificaron dos en vivo ese mismo dia y seguian como se los habia
 * verificado: no eran bajas reales, era dato falso reescribiendose solo cada
 * 48 horas.
 *
 * `apply-brightdata-prices.cjs` ya respeta la marca `priceVerifiedAt`, pero
 * hay OTROS tres scripts que escriben `price` en el catalogo y la ignoraban:
 * update-prices-from-ml.cjs (que corre con `npm run prices:update`),
 * apply-pending-prices.cjs y apply-perfume-prices.cjs. Ninguno esta en el
 * workflow automatico, pero eran un bypass real de la proteccion.
 *
 * Este modulo centraliza la regla para que no haya cuatro copias que se
 * desincronicen. Sin dependencias: solo builtins.
 *
 * Uso tipico en un script que escribe precios:
 *
 *   const { estaProtegido, avisarProtegidos, FORCE_FLAG } = require("./lib/price-guard.cjs");
 *   const forzar = process.argv.includes(FORCE_FLAG);
 *   const protegidos = [];
 *   for (const cambio of cambios) {
 *     if (estaProtegido(bloqueDelProducto, { forzar })) {
 *       protegidos.push({ id, ... });
 *       continue;               // no escribir
 *     }
 *     // ... escribir el precio
 *   }
 *   avisarProtegidos(protegidos);
 */

/**
 * Cuantos dias vale una verificacion manual antes de caducar.
 *
 * 7 es a proposito mas que los 2-3 dias que pasan entre corridas del workflow
 * de precios: alcanza para que una verificacion sobreviva varias pasadas de un
 * dato roto, y es poco como para no congelar un precio que cambio de verdad.
 */
const PROTECCION_MANUAL_DIAS = 7;

/** Flag para pisar a proposito un precio protegido. */
const FORCE_FLAG = "--force-manual-price";

/** Dias entre una fecha YYYY-MM-DD y hoy. Infinity si no hay fecha valida. */
function diasDesde(fecha) {
  if (!fecha) return Infinity;
  const ms = Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(fecha);
  return Number.isFinite(ms) ? Math.floor(ms / 86400000) : Infinity;
}

/** Lee `priceVerifiedAt` de un bloque de texto de producto. Null si no tiene. */
function leerVerificadoAt(bloque) {
  if (typeof bloque !== "string") return null;
  const m = bloque.match(/priceVerifiedAt:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

/**
 * Devuelve el texto del bloque de un producto dentro de curated-products.ts.
 * Null si no lo encuentra.
 *
 * Corta por INDENTACION exacta (4 espacios) y no por /id:/ suelto: hay ids
 * anidados dentro de structuredData y relatedProducts, y un regex ingenuo hace
 * que un "bloque" se coma decenas de productos.
 */
function bloqueDeProducto(src, id) {
  const re = new RegExp(`^    id: ['"]${id}['"],`, "m");
  const m = re.exec(src);
  if (!m) return null;
  const desde = m.index;
  const resto = src.slice(desde + 10);
  const sig = /^    id: ['"]/m.exec(resto);
  if (sig) return src.slice(desde, desde + 10 + sig.index);
  // Ultimo producto del archivo: cortar en el cierre del objeto, no en EOF, para
  // no arrastrar lo que venga despues del array (categoryPastels y demas).
  const cierre = /^  \},/m.exec(resto);
  return cierre ? src.slice(desde, desde + 10 + cierre.index) : src.slice(desde);
}

/**
 * True si el precio de ese bloque NO se puede pisar automaticamente.
 *
 * @param {string} bloque  texto del producto en curated-products.ts
 * @param {{forzar?: boolean}} [opts]  forzar: true ignora la proteccion
 */
function estaProtegido(bloque, opts = {}) {
  if (opts.forzar) return false;
  return diasDesde(leerVerificadoAt(bloque)) <= PROTECCION_MANUAL_DIAS;
}

/**
 * Imprime el aviso de lo que se descarto. Que sea ruidoso es el punto: un
 * descarte silencioso es indistinguible de que el script no haya hecho nada.
 */
function avisarProtegidos(protegidos, nombreScript = "este script") {
  if (!protegidos || protegidos.length === 0) return;
  console.log(
    `\n${protegidos.length} precio(s) NO se tocaron: fueron verificados a mano ` +
    `hace <= ${PROTECCION_MANUAL_DIAS} dias.`
  );
  for (const p of protegidos) {
    const d = diasDesde(p.verificadoAt);
    console.log(
      `  PROTEGIDO ${p.id}  ${p.actual} -> ${p.propuesto} (descartado)  ` +
      `verificado el ${p.verificadoAt}, hace ${d}d`
    );
  }
  console.log(
    `  Si el precio nuevo es el correcto, verificalo en MercadoLibre y ` +
    `actualizalo a mano, o corre ${nombreScript} con ${FORCE_FLAG}.\n`
  );
}

module.exports = {
  PROTECCION_MANUAL_DIAS,
  FORCE_FLAG,
  diasDesde,
  leerVerificadoAt,
  bloqueDeProducto,
  estaProtegido,
  avisarProtegidos,
};
