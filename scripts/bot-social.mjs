#!/usr/bin/env node
/**
 * Bot social autónomo — Fase 1, Instagram.
 *
 * Elige un producto del catálogo, lo pasa por los cinco gates de seguridad,
 * genera las dos imágenes del carrusel y el caption con la voz del sitio,
 * publica en Instagram y lo registra en la base. Al final avisa por Telegram
 * con el link, DESPUÉS de publicar: Juan eligió autonomía total, así que el
 * aviso es para poder borrarlo si algo salió feo, no para aprobarlo antes.
 *
 * Ver tasks/bot-social.md para el plan completo y scripts/lib/bot-gates.mjs
 * para por qué existe cada gate.
 *
 * Uso:
 *   node scripts/bot-social.mjs --dry-run          # no publica ni escribe en la base
 *   node scripts/bot-social.mjs --dry-run --offline # además no toca la red (ni gates en vivo ni Claude)
 *   node scripts/bot-social.mjs                     # publica de verdad
 *   node scripts/bot-social.mjs --producto MLA123   # fuerza un producto puntual (igual pasa los gates)
 *
 * Variables necesarias para publicar de verdad:
 *   IG_ACCESS_TOKEN, IG_BUSINESS_ACCOUNT_ID, BLOB_READ_WRITE_TOKEN  (publicación)
 *   ANTHROPIC_API_KEY                                               (copy)
 *   DATABASE_URL                                                    (memoria y kill switch)
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID                            (aviso)
 *
 * Los scripts de este repo no cargan .env solos:
 *   set -a; source .env; set +a; node scripts/bot-social.mjs --dry-run
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { correrGates } from "./lib/bot-gates.mjs";
import { generarCaption, generarBeneficios } from "./lib/bot-copy.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(DIR, "..");
const RED = "instagram";

/** Tope duro por corrida. Aunque la lógica falle, el bot no puede pasarse de acá. */
const MAX_POSTS_POR_CORRIDA = 1;

/** Descuento mínimo para que valga la pena postear. Abajo de esto no es noticia. */
const OFF_MINIMO_PCT = 15;

/**
 * Cuántos productos se chequean contra ML en vivo por corrida. Cada uno son dos
 * requests (link de afiliado + foto). ML escala bloqueos por IP rápido, y el
 * runner de GitHub sale con IP de Estados Unidos, así que este número se
 * mantiene chico a propósito.
 */
const MAX_VERIFICACIONES_EN_VIVO = 8;

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const OFFLINE = argv.includes("--offline");
const PRODUCTO_FORZADO = (() => {
  const i = argv.indexOf("--producto");
  return i >= 0 ? argv[i + 1] : null;
})();

/**
 * Tope de antigüedad del precio. El default de 24h no es arbitrario ni es un
 * número que se pueda aflojar sin costo: Bright Data corre lunes, miércoles y
 * viernes 12:07 UTC, así que el catálogo solo tiene precios de menos de 24h
 * en las horas siguientes a esas tres corridas.
 *
 * Por eso el bot está agendado pegado a la actualización de precios y no a
 * cualquier hora. Si lo corrés un martes, es esperable que no publique nada:
 * eso es el gate funcionando, no una falla.
 */
const MAX_HORAS = (() => {
  const i = argv.indexOf("--max-horas");
  return i >= 0 ? Number(argv[i + 1]) : 24;
})();

function log(...args) {
  console.log(...args);
}

// ─── Base de datos ───────────────────────────────────────────────────────────

let sqlCliente = null;
async function sql() {
  if (sqlCliente) return sqlCliente;
  if (!process.env.DATABASE_URL) return null;
  const { neon } = await import("@neondatabase/serverless");
  sqlCliente = neon(process.env.DATABASE_URL);
  return sqlCliente;
}

async function killSwitchActivo() {
  const db = await sql();
  if (!db) return null;
  const filas = await db`SELECT motivo FROM bot_kill_switch WHERE activo LIMIT 1`;
  return filas.length ? (filas[0].motivo || "sin motivo anotado") : null;
}

let avisoSinBaseDado = false;
async function consultarUltimoPost(red, productId) {
  const db = await sql();
  // Sin base no hay memoria de qué se publicó, así que no se puede garantizar
  // el gate de no repetir. Se falla cerrado: mejor no postear que spamear.
  // En dry-run se deja pasar con aviso, porque no publica nada y así el bot se
  // puede probar en local sin credenciales de Neon.
  if (!db) {
    if (DRY_RUN) {
      if (!avisoSinBaseDado) {
        avisoSinBaseDado = true;
        log("  (aviso: sin DATABASE_URL, el gate de no repetir se saltea en dry-run)");
      }
      return null;
    }
    throw new Error("Falta DATABASE_URL: sin base no se puede chequear si el producto ya se publicó.");
  }
  const filas = await db`
    SELECT posted_at FROM bot_posts
    WHERE red = ${red} AND product_id = ${productId}
    ORDER BY posted_at DESC LIMIT 1
  `;
  return filas.length ? new Date(filas[0].posted_at).toISOString() : null;
}

async function registrarPost({ producto, mediaId, caption }) {
  const db = await sql();
  if (!db) return;
  await db`
    INSERT INTO bot_posts (red, product_id, media_id, price, affiliate_url, caption)
    VALUES (${RED}, ${producto.id}, ${mediaId}, ${producto.price}, ${producto.affiliateUrl}, ${caption})
  `;
}

async function registrarCorrida({ resultado, productId = null, detalle = null }) {
  const db = await sql();
  if (!db) return;
  await db`
    INSERT INTO bot_runs (red, resultado, product_id, detalle)
    VALUES (${RED}, ${resultado}, ${productId}, ${detalle})
  `;
}

// ─── Telegram ────────────────────────────────────────────────────────────────

async function avisar(texto) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    log("(sin credenciales de Telegram, no se manda el aviso)");
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: texto, disable_web_page_preview: true }),
  });
  if (!res.ok) log(`Aviso de Telegram falló: HTTP ${res.status}`);
}

// ─── Selección de candidatos ─────────────────────────────────────────────────

function offPct(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

/**
 * Ordena candidatos por qué tan buena es la noticia: primero el descuento real,
 * después la prueba social. No mezcla un score raro: son dos criterios en orden.
 */
function ordenarCandidatos(productos) {
  return [...productos].sort((a, b) => {
    const d = offPct(b) - offPct(a);
    if (d !== 0) return d;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });
}

function preFiltrar(productos) {
  return productos.filter((p) => {
    // Estos chequeos corren SIEMPRE, incluso con --producto: son los datos
    // mínimos que arman la imagen. Forzar un producto no puede saltearlos,
    // porque sin originalPrice el cálculo de ahorro da NaN y sin specs/marca/
    // puntaje/vendidos el generador de imagen falla o publica vacío.
    // La segunda imagen necesita 4 specs de la ficha técnica.
    if (!Array.isArray(p.specs) || p.specs.length < 4) return false;
    // generar-imagen-post-threads.cjs exige marca, puntaje y vendidos, y no
    // acepta vacíos. No se inventan: si la ficha no los tiene, el producto no
    // es candidato y listo.
    if (!p.brand || !p.rating || !p.soldQuantity) return false;
    // El carrusel de precio necesita un precio anterior real para mostrar la baja.
    if (!p.originalPrice || p.originalPrice <= p.price) return false;

    if (PRODUCTO_FORZADO) return p.id === PRODUCTO_FORZADO;
    // Sin forzar, además hace falta que el descuento sea noticia.
    if (offPct(p) < OFF_MINIMO_PCT) return false;
    return true;
  });
}

// ─── Imágenes ────────────────────────────────────────────────────────────────

function fmt(n) {
  return new Intl.NumberFormat("es-AR").format(n);
}

function generarImagen(script, datos, salida) {
  execFileSync("node", [path.join(DIR, script), JSON.stringify(datos), salida], {
    stdio: "inherit",
    cwd: RAIZ,
  });
  if (!fs.existsSync(salida)) throw new Error(`${script} no escribió ${salida}`);
  return salida;
}

/**
 * El texto de la pastilla arriba a la izquierda de la imagen de precio.
 *
 * No puede repetir el descuento (el círculo naranja ya lo grita) ni meter
 * urgencia que no podemos verificar: la plantilla trae ejemplos tipo "ÚLTIMA
 * UNIDAD" que solo valen cuando alguien miró el stock a mano. Acá se usa un
 * dato que ya está en la ficha, en orden de qué tan fuerte es.
 */
function badgeDe(producto) {
  const porEtiqueta = {
    bestseller: "MÁS VENDIDO",
    viral: "SE VOLVIÓ VIRAL",
    "tiktok-viral": "VIRAL EN TIKTOK",
    trending: "EN TENDENCIA",
    "hot-deal": "BAJÓ FUERTE",
    "summer-pick": "PARA EL VERANO",
    collector: "EDICIÓN DE COLECCIÓN",
  };
  if (producto.badge && porEtiqueta[producto.badge]) return porEtiqueta[producto.badge];
  if (producto.soldQuantity >= 500) return `+${producto.soldQuantity} VENDIDOS`;
  if (producto.freeShipping) return "ENVÍO GRATIS";
  return `${producto.rating} EN MERCADO LIBRE`;
}

function armarImagenes(producto, beneficios, dirTrabajo) {
  const off = offPct(producto);
  const ahorro = producto.originalPrice - producto.price;

  const imgPrecio = generarImagen(
    "generar-imagen-post-threads.cjs",
    {
      imgUrl: producto.image,
      badge: badgeDe(producto),
      title: producto.title,
      brand: producto.brand || "",
      rating: producto.rating ? String(producto.rating) : "",
      sold: producto.soldQuantity ? `+${producto.soldQuantity} vendidos` : "",
      oldPrice: fmt(producto.originalPrice),
      newPrice: fmt(producto.price),
      offPct: String(off),
      savings: fmt(ahorro),
    },
    path.join(dirTrabajo, `${producto.id}-precio.png`),
  );

  const imgBeneficios = generarImagen(
    "generar-imagen-beneficios-threads.cjs",
    { imgUrl: producto.image, title: producto.title, benefits: beneficios },
    path.join(dirTrabajo, `${producto.id}-beneficios.png`),
  );

  return [imgPrecio, imgBeneficios];
}

// ─── Publicación ─────────────────────────────────────────────────────────────

/**
 * Reusa scripts/publicar-instagram.cjs en vez de reimplementar la Graph API:
 * ese script ya resolvió el flujo de Blob, contenedores y espera de procesado,
 * y ya está probado a mano. El bot solo lo orquesta.
 */
function publicarCarrusel(imagenes, caption) {
  const salida = execFileSync(
    "node",
    [path.join(DIR, "publicar-instagram.cjs"), "carousel", imagenes.join(","), caption],
    { encoding: "utf8", cwd: RAIZ },
  );
  process.stdout.write(salida);
  const m = salida.match(/ID:\s*(\d+)/);
  return m ? m[1] : null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  log(`Bot social — red: ${RED}${DRY_RUN ? " (DRY RUN)" : ""}${OFFLINE ? " (OFFLINE)" : ""}`);

  if (!DRY_RUN) {
    const motivo = await killSwitchActivo();
    if (motivo) {
      log(`KILL SWITCH ACTIVO: ${motivo}. No se publica nada.`);
      await registrarCorrida({ resultado: "kill-switch", detalle: motivo });
      await avisar(`Bot social frenado por kill switch: ${motivo}`);
      return;
    }
  }

  const { curatedProducts } = await import(path.join(RAIZ, "src/data/curated-products.ts"));
  log(`Catálogo: ${curatedProducts.length} productos`);

  const candidatos = ordenarCandidatos(preFiltrar(curatedProducts));
  log(`Candidatos tras el pre-filtro (>=${OFF_MINIMO_PCT}% off, 4+ specs, con marca/puntaje/vendidos): ${candidatos.length}`);

  const rechazados = [];
  let publicados = 0;
  let verificacionesEnVivo = 0;

  for (const producto of candidatos) {
    if (publicados >= MAX_POSTS_POR_CORRIDA) break;

    // Los gates en vivo pegan contra meli.la y el CDN de ML. Recorrer los 147
    // candidatos serían ~300 requests desde la IP del runner, que es
    // exactamente como ML escala bloqueos. Los gates baratos (precio, ficha,
    // no repetir) ya descartan la mayoría sin tocar la red; acá se corta por
    // las dudas para que una corrida nunca haga más de MAX_VERIFICACIONES.
    const cortoDeVerificaciones = verificacionesEnVivo >= MAX_VERIFICACIONES_EN_VIVO;
    if (cortoDeVerificaciones) {
      rechazados.push(`${producto.id}: no se verificó (se llegó al tope de ${MAX_VERIFICACIONES_EN_VIVO} chequeos en vivo)`);
      continue;
    }

    const gatesBaratos = await correrGates(producto, {
      red: RED,
      consultarUltimoPost: DRY_RUN && OFFLINE ? async () => null : consultarUltimoPost,
      verificarEnVivo: false,
      maxHoras: MAX_HORAS,
    });
    if (!gatesBaratos.ok) {
      rechazados.push(`${producto.id} ${producto.title.slice(0, 45)}: ${gatesBaratos.motivos.join("; ")}`);
      continue;
    }
    if (OFFLINE) {
      log(`\nElegido (offline, sin verificar en vivo): ${producto.id} — ${producto.title}`);
      publicados++;
      break;
    }

    verificacionesEnVivo++;
    const gates = await correrGates(producto, {
      red: RED,
      consultarUltimoPost: DRY_RUN && OFFLINE ? async () => null : consultarUltimoPost,
      verificarEnVivo: !OFFLINE,
      maxHoras: MAX_HORAS,
    });

    if (!gates.ok) {
      rechazados.push(`${producto.id} ${producto.title.slice(0, 45)}: ${gates.motivos.join("; ")}`);
      continue;
    }

    log(`\nElegido: ${producto.id} — ${producto.title}`);
    log(`  $${fmt(producto.price)} (antes $${fmt(producto.originalPrice)}, ${offPct(producto)}% off)`);

    const beneficios = await generarBeneficios(producto);
    const caption = await generarCaption(producto, { red: RED });
    log(`\n--- caption ---\n${caption}\n---------------\n`);

    const dirTrabajo = fs.mkdtempSync(path.join(os.tmpdir(), "bot-social-"));
    const imagenes = armarImagenes(producto, beneficios, dirTrabajo);
    log(`Imágenes: ${imagenes.join(", ")}`);

    if (DRY_RUN) {
      log("DRY RUN: hasta acá llega. No se publicó ni se escribió en la base.");
      publicados++;
      break;
    }

    const mediaId = publicarCarrusel(imagenes, caption);

    // Ya publicó en Instagram: de acá en más no puede tirar sin avisar. Si el
    // registro en Neon falla (timeout, base caída), el post queda vivo pero
    // el gate de no repetir no lo va a ver en la próxima corrida. Eso hay que
    // saberlo YA, no descubrirlo cuando el producto se repite en 2 días.
    let errorDeRegistro = null;
    try {
      await registrarPost({ producto, mediaId, caption });
    } catch (err) {
      errorDeRegistro = err;
    }

    if (errorDeRegistro) {
      await registrarCorrida({
        resultado: "publicado-sin-registro",
        productId: producto.id,
        detalle: `media ${mediaId}, error al registrar: ${errorDeRegistro.message}`,
      }).catch(() => {});
      await avisar(
        [
          "ALERTA: se publicó en Instagram pero el registro en la base FALLÓ.",
          "El gate de no repetir no va a ver este post en corridas futuras: anotalo a mano.",
          producto.title,
          producto.affiliateUrl,
          mediaId ? `media id: ${mediaId}` : "",
          `Error: ${errorDeRegistro.message}`,
        ].filter(Boolean).join("\n"),
      ).catch(() => {});
    } else {
      await registrarCorrida({ resultado: "publicado", productId: producto.id, detalle: `media ${mediaId}` });
      await avisar(
        [
          "Bot social publicó en Instagram:",
          producto.title,
          `$${fmt(producto.price)} (${offPct(producto)}% off)`,
          producto.affiliateUrl,
          mediaId ? `media id: ${mediaId}` : "",
          "",
          "Si algo está mal, borralo desde la app.",
        ].filter(Boolean).join("\n"),
      );
    }
    publicados++;
  }

  if (publicados === 0) {
    log(`\nNingún producto pasó los gates. Rechazados: ${rechazados.length}`);
    for (const r of rechazados.slice(0, 15)) log(`  - ${r}`);
    if (rechazados.length > 15) log(`  ... y ${rechazados.length - 15} más`);

    const todosPorPrecioViejo = rechazados.length > 0 &&
      rechazados.every((r) => r.includes("precio verificado"));
    if (todosPorPrecioViejo) {
      log(
        `\nTodos cayeron por precio viejo. Dos causas posibles, en orden:\n` +
        `  1. El PR de precios de Bright Data todavía no está mergeado. El bot lee\n` +
        `     master, así que hasta que no mergees ese PR el catálogo sigue viejo.\n` +
        `  2. Esta corrida no viene pegada a la de Bright Data (lun/mié/vie 12:07 UTC).`,
      );
    }
    if (!DRY_RUN) {
      await registrarCorrida({ resultado: "sin-candidatos", detalle: `${rechazados.length} rechazados` });
      await avisar(
        `Bot social: hoy no publicó nada, ningún producto pasó los gates (${rechazados.length} rechazados).` +
        (todosPorPrecioViejo ? "\n\nTodos por precio viejo. Fijate si quedó sin mergear el PR de precios de Bright Data." : ""),
      );
    }
  }
}

main().catch(async (err) => {
  console.error(`\nBot social falló: ${err.message}`);
  if (!DRY_RUN) {
    await registrarCorrida({ resultado: "error", detalle: err.message }).catch(() => {});
    await avisar(`Bot social falló: ${err.message}`).catch(() => {});
  }
  process.exit(1);
});
