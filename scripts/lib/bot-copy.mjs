/**
 * Generación del copy del post con la API de Claude.
 *
 * Por qué acá y no un template fijo: un template repite la misma estructura
 * todos los días y el feed se vuelve ruido. Lo que no puede variar es el DATO
 * (precio, contra, specs): eso sale de la ficha ya verificada y se le pasa al
 * modelo como hecho cerrado, nunca se le pide que lo averigüe ni que lo estime.
 *
 * El modelo escribe, no investiga. Si un dato no está en la ficha, no va.
 *
 * No agrega dependencias: llama a la API con fetch.
 * Requiere ANTHROPIC_API_KEY (o ANTHROPIC_AUTH_TOKEN como fallback).
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const MODELO = "claude-sonnet-5";

/**
 * Cabeceras de autenticación contra la API de Claude.
 *
 * Hay dos credenciales posibles y NO son intercambiables en la misma cabecera:
 *
 *  - ANTHROPIC_API_KEY (sk-ant-api...): una API key de console.anthropic.com.
 *    Va en `x-api-key`. Es la buena para el bot: facturación propia, no rota
 *    sola y no comparte cuota con nada.
 *
 *  - ANTHROPIC_AUTH_TOKEN (sk-ant-oat...): un token OAuth de Claude Code. Va en
 *    `authorization: Bearer`. Comprobado el 2026-08-16: con `x-api-key` da 401,
 *    con `Bearer` da 429 (o sea autentica bien y lo que se agotó es la cuota).
 *    Sirve para probar, pero comparte límite con el Claude Code de Juan y estos
 *    tokens rotan, así que un bot desatendido se va a caer solo tarde o
 *    temprano. Se acepta como fallback, avisando.
 */
function cabecerasDeAuth() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) return { "x-api-key": apiKey };

  const oauth = process.env.ANTHROPIC_AUTH_TOKEN;
  if (oauth) {
    if (!avisoOauthDado) {
      avisoOauthDado = true;
      console.warn(
        "Aviso: se está usando ANTHROPIC_AUTH_TOKEN (token OAuth de Claude Code).\n" +
        "       Comparte cuota con tu Claude Code y rota solo. Para el bot desatendido,\n" +
        "       sacá una API key en console.anthropic.com y ponela en ANTHROPIC_API_KEY.",
      );
    }
    return { authorization: `Bearer ${oauth}` };
  }

  throw new Error(
    "Falta credencial de Claude: poné ANTHROPIC_API_KEY (recomendado) o ANTHROPIC_AUTH_TOKEN.",
  );
}
let avisoOauthDado = false;

/**
 * Reglas de voz del sitio. Están acá y no en un voice.md porque este repo no
 * tiene archivos de marca todavía; si algún día se crea voice.md en la raíz,
 * esto se reemplaza por una lectura de ese archivo.
 *
 * Ojo con una distinción que ya costó una corrección: el formato hype/cupón es
 * SOLO de Threads. Instagram va con la voz de curador honesto.
 */
const VOZ = `
Escribís como Juan, que cura productos de MercadoLibre Argentina y los recomienda
de verdad. No sos una marca ni un vendedor: sos el amigo que se fijó bien antes
de comprar y te cuenta qué encontró.

Reglas duras:
- Español rioplatense casual. Voseo. Nada de "tú" ni de español neutro.
- Nunca uses guiones largos.
- Sin emojis.
- Nunca digas "producto curado" ni "curamos": no es lenguaje natural argentino.
- Nunca uses la palabra "cluster".
- Nada de urgencia ni escasez inventada. No digas "últimas unidades", "se agota",
  "por tiempo limitado" ni nada parecido salvo que el dato venga en la ficha.
- Nada de jerga de marketing: "imperdible", "increíble", "no te lo pierdas".
- Siempre UNA contra real y concreta, sacada de la ficha. La contra va en el
  cuerpo, no escondida al final. Es lo que hace creíble al resto.
- No inventes specs, precios, cuotas, envíos ni comparaciones con otros modelos.
  Si no está en los datos que te paso, no existe.
- No prometas disponibilidad ni tiempo de entrega.
`.trim();

function formatearPrecio(n) {
  return new Intl.NumberFormat("es-AR").format(n);
}

/**
 * Arma el bloque de hechos verificados que el modelo puede usar. Todo lo que no
 * esté acá queda fuera del post por construcción.
 */
function hechosDelProducto(producto) {
  const lineas = [
    `Título en ML: ${producto.title}`,
    `Precio hoy: $${formatearPrecio(producto.price)}`,
  ];
  if (producto.originalPrice && producto.originalPrice > producto.price) {
    const off = Math.round((1 - producto.price / producto.originalPrice) * 100);
    lineas.push(`Precio anterior: $${formatearPrecio(producto.originalPrice)} (${off}% menos hoy)`);
  }
  if (producto.brand) lineas.push(`Marca: ${producto.brand}`);
  if (producto.category) lineas.push(`Categoría: ${producto.category}`);
  if (producto.rating) lineas.push(`Puntaje en ML: ${producto.rating}`);
  if (producto.reviewCount) lineas.push(`Reseñas en ML: ${producto.reviewCount}`);
  if (producto.soldQuantity) lineas.push(`Vendidos: ${producto.soldQuantity}`);
  if (producto.freeShipping) lineas.push("Envío gratis: sí");
  if (Array.isArray(producto.pros) && producto.pros.length) {
    lineas.push(`A favor (de la ficha): ${producto.pros.join(" | ")}`);
  }
  if (Array.isArray(producto.cons) && producto.cons.length) {
    lineas.push(`Contras reales (de la ficha, usá UNA): ${producto.cons.join(" | ")}`);
  }
  if (Array.isArray(producto.specs) && producto.specs.length) {
    const specs = producto.specs.slice(0, 8).map((s) => `${s.label}: ${s.value}`).join(" | ");
    lineas.push(`Ficha técnica: ${specs}`);
  }
  if (producto.verdict) lineas.push(`Veredicto editorial del sitio: ${producto.verdict}`);
  return lineas.join("\n");
}

const INSTRUCCIONES_INSTAGRAM = `
Escribí el caption de un post de Instagram (carrusel de 2 imágenes: precio y beneficios).

Estructura:
1. Un gancho de una línea. Puede arrancar por el número (el precio o la baja), por
   la experiencia ("lo venía mirando"), o por la contra. Elegí el que mejor le
   cierre a ESTE producto, no siempre el mismo.
2. Dos o tres líneas de qué es y para quién sirve, con un dato concreto de la ficha.
3. La contra, explícita, en su propia línea.
4. Cierre: el precio y "el link está en la bio".

Largo: entre 60 y 120 palabras. Líneas cortas, con saltos de línea entre bloques.

IMPORTANTE: el link NO va en el caption. Instagram no hace clickeables los links
en el cuerpo del post. Se manda a la bio, que apunta a productosvirales.com.ar/enlaces.

Después del caption, dejá una línea en blanco y poné exactamente 5 hashtags en
español, relevantes al producto y a Argentina. Ni uno más: Instagram limita a
5 desde diciembre 2025, de más no suma alcance y ensucia el post. Sin hashtags
genéricos de spam tipo #viral #fyp #followme.
`.trim();

const INSTRUCCIONES_POR_RED = {
  instagram: INSTRUCCIONES_INSTAGRAM,
};

/**
 * Devuelve el caption listo para publicar.
 * Lanza si falta la API key o si la API responde mal: el orquestador prefiere
 * no publicar antes que publicar un caption a medias.
 */
export async function generarCaption(producto, { red = "instagram", fetchImpl = fetch } = {}) {
  const auth = cabecerasDeAuth();

  const instrucciones = INSTRUCCIONES_POR_RED[red];
  if (!instrucciones) throw new Error(`No hay instrucciones de copy para la red "${red}".`);

  const prompt = [
    VOZ,
    "",
    "Estos son los ÚNICOS datos verificados que podés usar. No agregues ninguno más:",
    "",
    hechosDelProducto(producto),
    "",
    instrucciones,
    "",
    "Devolvé solamente el caption, sin comillas, sin encabezados y sin explicar qué hiciste.",
  ].join("\n");

  const res = await fetchImpl(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      ...auth,
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`La API de Claude falló: ${JSON.stringify(data)}`);

  const texto = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!texto) throw new Error("La API de Claude devolvió un caption vacío.");

  return validarCaption(texto, producto);
}

/**
 * Los 4 beneficios de la segunda imagen del carrusel.
 *
 * Salen SOLO de la ficha técnica real de MercadoLibre. El generador de imagen
 * (generar-imagen-beneficios-threads.cjs) ya avisa esto en su cabecera: nunca
 * inventados. Acá se fuerza por construcción, pasándole al modelo únicamente
 * las specs y rechazando la respuesta si devuelve otra cantidad.
 */
export async function generarBeneficios(producto, { fetchImpl = fetch } = {}) {
  const auth = cabecerasDeAuth();

  const specs = Array.isArray(producto.specs) ? producto.specs : [];
  if (specs.length < 4) {
    throw new Error(`La ficha tiene ${specs.length} specs, hacen falta 4 para el carrusel.`);
  }

  const prompt = [
    "Estas son las specs reales de un producto de MercadoLibre:",
    "",
    specs.map((s) => `- ${s.label}: ${s.value}`).join("\n"),
    "",
    "Elegí las 4 specs que más le importan a alguien que está por comprarlo y",
    "convertí cada una en un beneficio entendible. No inventes ninguna spec que",
    "no esté en la lista de arriba.",
    "",
    "Devolvé SOLO un array JSON de 4 objetos, sin markdown y sin explicación:",
    '[{"icon":"<un emoji>","title":"<máximo 4 palabras>","desc":"<máximo 10 palabras, español rioplatense, sin guiones largos>"}]',
  ].join("\n");

  const res = await fetchImpl(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      ...auth,
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`La API de Claude falló generando beneficios: ${JSON.stringify(data)}`);

  const texto = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const json = texto.replace(/^```(?:json)?\s*|\s*```$/g, "");

  let beneficios;
  try {
    beneficios = JSON.parse(json);
  } catch {
    throw new Error(`Los beneficios no vinieron como JSON válido: ${texto.slice(0, 200)}`);
  }
  if (!Array.isArray(beneficios) || beneficios.length !== 4) {
    throw new Error(`Se esperaban 4 beneficios, llegaron ${Array.isArray(beneficios) ? beneficios.length : "algo que no es un array"}.`);
  }
  for (const b of beneficios) {
    if (!b || !b.icon || !b.title || !b.desc) {
      throw new Error(`Un beneficio vino incompleto: ${JSON.stringify(b)}`);
    }
    if (String(b.desc).includes("—") || String(b.title).includes("—")) {
      throw new Error("Un beneficio trae guión largo.");
    }
  }
  return beneficios;
}

/**
 * Red de contención por si el modelo se sale de las reglas. No corrige: rechaza.
 * Es preferible saltear el producto del día a publicar algo fuera de voz.
 */
export function validarCaption(caption, producto) {
  const problemas = [];

  if (caption.includes("—")) problemas.push("tiene guión largo");
  if (/producto curado|curamos/i.test(caption)) problemas.push('dice "producto curado"');
  if (/\bcluster\b/i.test(caption)) problemas.push('dice "cluster"');
  if (/últimas unidades|ultimas unidades|se agota|por tiempo limitado|no te lo pierdas|corré|apurate|apurá/i.test(caption)) {
    problemas.push("mete urgencia o escasez inventada");
  }
  if (/https?:\/\//.test(caption)) problemas.push("mete un link en el cuerpo (va en la bio)");
  if (/\btú\b|\btienes\b|\bpuedes\b/i.test(caption)) problemas.push("se le escapó español neutro");

  // El precio del caption tiene que ser el de la ficha. Si el modelo escribió
  // otro número con signo peso, algo se desalineó y no se publica.
  const preciosEnTexto = [...caption.matchAll(/\$\s?([\d.]{4,})/g)]
    .map((m) => Number(m[1].replace(/\./g, "")))
    .filter((n) => Number.isFinite(n));
  const permitidos = new Set([producto.price, producto.originalPrice].filter(Boolean));
  const ajenos = preciosEnTexto.filter((p) => !permitidos.has(p));
  if (ajenos.length) problemas.push(`menciona precios que no son de la ficha: ${ajenos.join(", ")}`);

  const palabras = caption.split(/\s+/).length;
  if (palabras > 220) problemas.push(`demasiado largo (${palabras} palabras)`);

  // Instagram limita a 5 hashtags desde diciembre 2025. El prompt ya se lo
  // pide al modelo, pero esto es la red de contención: si igual se manda
  // con 6 o más, no se publica.
  const hashtags = caption.match(/#\S+/g) || [];
  if (hashtags.length !== 5) {
    problemas.push(`tiene ${hashtags.length} hashtags en vez de 5`);
  }

  if (problemas.length) {
    throw new Error(`El caption no pasó la validación de voz: ${problemas.join("; ")}`);
  }
  return caption;
}
