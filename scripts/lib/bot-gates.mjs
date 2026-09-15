/**
 * Gates de seguridad del bot social autónomo.
 *
 * Por qué existe: el bot publica solo, sin que Juan apruebe cada post. Eso
 * significa que un precio viejo, un link de afiliado excluido del programa o
 * una foto rota salen al aire sin filtro humano. La credibilidad de curador
 * honesto es el único activo del sitio, y se quema con un solo post mintiendo
 * un precio.
 *
 * Estos gates NO son "pedirle permiso a Juan" (eligió autonomía total). Son
 * "no publicar un dato que no está verificado". Un producto que no pasa los
 * cinco gates simplemente no se publica y el bot busca el siguiente.
 *
 * Mismo criterio que scripts/lib/price-guard.cjs: la regla vive en un solo
 * lugar para que no haya tres copias desincronizadas.
 *
 * Sin dependencias: solo builtins y fetch.
 */

/** Antigüedad máxima del precio, en horas. Más viejo que esto no se publica. */
export const MAX_HORAS_PRECIO = 24;

/** Días que tienen que pasar para volver a publicar el mismo producto en la misma red. */
export const DIAS_ENTRE_REPETICIONES = 30;

/** Host de las imágenes reales de MercadoLibre. Cualquier otro es sospechoso. */
const HOST_IMAGENES_ML = "http2.mlstatic.com";

/** Acortador oficial del programa de afiliados. */
const HOST_AFILIADOS = "meli.la";

/**
 * MercadoLibre devuelve 403 a un fetch sin User-Agent de navegador. Sin esto,
 * los gates en vivo rechazan TODO el catálogo por "link roto" cuando en
 * realidad los links andan perfecto (comprobado el 2026-08-16: mismo link,
 * 403 sin UA y 200 con UA).
 */
const CABECERAS_NAVEGADOR = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "accept-language": "es-AR,es;q=0.9",
};

function horasDesde(fechaIso) {
  if (!fechaIso) return Infinity;
  const t = Date.parse(fechaIso);
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / 36e5;
}

/**
 * La fecha de verificación más reciente que tenga la ficha. El catálogo usa
 * tres campos distintos según qué script escribió el precio:
 *   - priceVerifiedAt: lo puso un humano mirando la publicación
 *   - priceLastChecked / priceUpdated: los escriben los scripts de precios
 * Para el bot vale la más nueva de las tres.
 */
export function horasDesdeUltimaVerificacion(producto) {
  return Math.min(
    horasDesde(producto.priceVerifiedAt),
    horasDesde(producto.priceLastChecked),
    horasDesde(producto.priceUpdated),
  );
}

// ─── Gate 1: precio fresco ───────────────────────────────────────────────────

export function gatePrecioFresco(producto, { maxHoras = MAX_HORAS_PRECIO } = {}) {
  if (producto.priceStatus === "out_of_stock") {
    return { ok: false, motivo: "priceStatus = out_of_stock" };
  }
  if (producto.priceStatus === "stale") {
    return { ok: false, motivo: "priceStatus = stale (no se pudo verificar solo)" };
  }
  if (typeof producto.price !== "number" || producto.price <= 0) {
    return { ok: false, motivo: `precio inválido: ${producto.price}` };
  }
  const horas = horasDesdeUltimaVerificacion(producto);
  if (horas > maxHoras) {
    const txt = horas === Infinity ? "nunca" : `hace ${Math.round(horas)}h`;
    return { ok: false, motivo: `precio verificado ${txt} (tope: ${maxHoras}h)` };
  }
  return { ok: true };
}

// ─── Gate 2: link de afiliado que resuelve ───────────────────────────────────

/**
 * Chequea que el link exista, sea del acortador de afiliados, y que resuelva.
 *
 * Ojo con dos cosas aprendidas a los golpes:
 *  - Un meli.la que cae en /social/jm159 NO está roto: esa es la landing de
 *    afiliados de ML y muestra el producto igual.
 *  - Una publicación puede estar excluida del Programa de Afiliados. Eso no se
 *    detecta al sourcear, solo cuando el link deja de resolver a un producto.
 *
 * Con `verificarEnVivo: false` solo valida el formato (para tests y dry-run
 * offline, y para no golpear meli.la en cada corrida de más de la cuenta).
 */
export async function gateLinkAfiliado(producto, { verificarEnVivo = true, fetchImpl = fetch } = {}) {
  const url = producto.affiliateUrl;
  if (!url) return { ok: false, motivo: "sin affiliateUrl en la ficha" };

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, motivo: `affiliateUrl no es una URL válida: ${url}` };
  }
  if (parsed.hostname !== HOST_AFILIADOS) {
    return { ok: false, motivo: `affiliateUrl no es de ${HOST_AFILIADOS}: ${parsed.hostname}` };
  }
  if (!verificarEnVivo) return { ok: true };

  // GET, no HEAD: el CDN de ML responde 405 a HEAD (ver MISTAKES.md).
  let res;
  try {
    res = await fetchImpl(url, { redirect: "follow", headers: CABECERAS_NAVEGADOR });
  } catch (err) {
    return { ok: false, motivo: `el link no resolvió: ${err.message}` };
  }
  if (!res.ok) {
    return { ok: false, motivo: `el link devolvió HTTP ${res.status}` };
  }
  const destino = res.url || "";
  if (/\/(error|404)|pagina-no-encontrada/i.test(destino)) {
    return { ok: false, motivo: `el link cae en una página de error: ${destino}` };
  }
  return { ok: true, destino };
}

// ─── Gate 3: foto real del producto ──────────────────────────────────────────

export async function gateFoto(producto, { verificarEnVivo = true, fetchImpl = fetch } = {}) {
  const img = producto.image;
  if (!img) return { ok: false, motivo: "sin imagen en la ficha" };

  let parsed;
  try {
    parsed = new URL(img);
  } catch {
    return { ok: false, motivo: `imagen no es una URL válida: ${img}` };
  }
  if (parsed.hostname !== HOST_IMAGENES_ML) {
    return { ok: false, motivo: `la imagen no es del CDN de ML: ${parsed.hostname}` };
  }
  if (!verificarEnVivo) return { ok: true };

  // GET otra vez, por lo mismo: con HEAD el CDN miente el tamaño y una foto
  // buena parece pesar menos que su miniatura.
  let res;
  try {
    res = await fetchImpl(img, { headers: CABECERAS_NAVEGADOR });
  } catch (err) {
    return { ok: false, motivo: `la imagen no cargó: ${err.message}` };
  }
  if (!res.ok) return { ok: false, motivo: `la imagen devolvió HTTP ${res.status}` };

  const bytes = Number(res.headers.get("content-length") || 0);
  if (bytes > 0 && bytes < 3000) {
    return { ok: false, motivo: `la imagen pesa ${bytes} bytes, parece un placeholder` };
  }
  return { ok: true };
}

// ─── Gate 4: no repetir producto ─────────────────────────────────────────────

/**
 * `consultarUltimoPost(red, productId)` tiene que devolver la fecha ISO del
 * último post de ese producto en esa red, o null. Se inyecta para que este
 * módulo no dependa de la base y se pueda testear solo.
 */
export async function gateNoRepetir(producto, { red, consultarUltimoPost, dias = DIAS_ENTRE_REPETICIONES }) {
  const ultimo = await consultarUltimoPost(red, producto.id);
  if (!ultimo) return { ok: true };
  const diasPasados = horasDesde(ultimo) / 24;
  if (diasPasados < dias) {
    return { ok: false, motivo: `ya se publicó en ${red} hace ${Math.round(diasPasados)} días (mínimo: ${dias})` };
  }
  return { ok: true };
}

// ─── Gate 5: la ficha es publicable ──────────────────────────────────────────

export function gateFichaPublicable(producto) {
  if (producto.visibility === "deprioritized") {
    return { ok: false, motivo: "ficha marcada como deprioritized" };
  }
  if (!producto.title) return { ok: false, motivo: "sin título" };
  if (!producto.permalink) return { ok: false, motivo: "sin permalink de ML" };

  // Sin una contra real no se publica: el formato es "curador honesto", y un
  // post sin contra es un aviso publicitario. Ver AUDIENCE/voz del sitio.
  const contras = Array.isArray(producto.cons) ? producto.cons.filter(Boolean) : [];
  if (contras.length === 0) {
    return { ok: false, motivo: "la ficha no tiene ninguna contra cargada" };
  }
  return { ok: true };
}

// ─── Orquestador de gates ────────────────────────────────────────────────────

/**
 * Corre los cinco gates en orden de costo: primero los que no hacen red.
 * Devuelve { ok, motivos[] }.
 */
export async function correrGates(producto, opciones) {
  const { red, consultarUltimoPost, verificarEnVivo = true, maxHoras = MAX_HORAS_PRECIO } = opciones;
  const motivos = [];

  const baratos = [
    gateFichaPublicable(producto),
    gatePrecioFresco(producto, { maxHoras }),
  ];
  for (const r of baratos) if (!r.ok) motivos.push(r.motivo);
  if (motivos.length) return { ok: false, motivos };

  const repetido = await gateNoRepetir(producto, { red, consultarUltimoPost });
  if (!repetido.ok) return { ok: false, motivos: [repetido.motivo] };

  const [link, foto] = await Promise.all([
    gateLinkAfiliado(producto, { verificarEnVivo }),
    gateFoto(producto, { verificarEnVivo }),
  ]);
  if (!link.ok) motivos.push(link.motivo);
  if (!foto.ok) motivos.push(foto.motivo);

  return motivos.length ? { ok: false, motivos } : { ok: true, motivos: [] };
}
