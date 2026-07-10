#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Arma el mensaje de una baja de precio (foto + texto en la voz del sitio,
 * con la contra honesta y cómo varió el precio) y lo manda por Telegram.
 *
 * Por default lo manda al chat PRIVADO de Juan, para revisar antes de
 * publicar. Con el flag --canal lo postea directo al canal público
 * (@productosvirales_argentina) como mensaje nativo del bot — sin la
 * etiqueta de "reenviado" que deja usar Reenviar en Telegram. Nunca se
 * publica solo: hay que correr el comando con --canal a mano, cada vez.
 *
 * No modifica el catálogo ni el historial de precios — es solo mensajería.
 * El precio "nuevo" lo confirma Juan a mano (la API oficial de ML sigue
 * caída, no hay chequeo automático todavía).
 *
 * Uso:
 *   node scripts/telegram-price-drop.cjs <ID> <precioNuevo>            # revisión, chat privado
 *   node scripts/telegram-price-drop.cjs <ID> <precioNuevo> --canal    # publica en el canal
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const HISTORY_PATH = path.resolve("src/data/price-history.json");
const COUPONS_PATH = path.resolve("src/data/coupons.ts");
const SLUG_MAX_LENGTH = 80;
const CHANNEL_USERNAME = "@productosvirales_argentina";

function loadDotEnv() {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0 && !line.startsWith("#")) out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  } catch { /* sin .env, main() avisa */ }
  return out;
}

function formatPrice(n) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

// ─── Mismo algoritmo que src/lib/product-url.ts (productSlug) ───
function slugifyTitle(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/, "");
}
function productSlug(id, title) {
  const titlePart = slugifyTitle(title);
  const idPart = id.toLowerCase();
  return titlePart ? `${titlePart}-${idPart}` : idPart;
}

// ─── Extraer el bloque del producto de curated-products.ts (mismo enfoque que price-drops.cjs) ───
function extractProductBlock(src, id) {
  const blocks = src.split(/\n  \{\n/).slice(1);
  for (const b of blocks) {
    const idMatch = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (idMatch && idMatch[1].toUpperCase() === id.toUpperCase()) return b;
  }
  return null;
}
function prop(block, p) {
  const m = block.match(new RegExp(`(?:^|\\n)\\s*${p}:\\s*['"\`]([^'"\`]*)['"\`]`));
  return m ? m[1] : "";
}
function numProp(block, p) {
  const m = block.match(new RegExp(`(?:^|\\n)\\s*${p}:\\s*(\\d+(?:\\.\\d+)?)`));
  return m ? Number(m[1]) : undefined;
}
function firstConsItem(block) {
  const m = block.match(/cons:\s*\[\s*['"`]([^'"`]+)['"`]/);
  return m ? m[1] : null;
}

// ─── Cupón aplicable (mismo cálculo que src/lib/coupons.ts) ───
function getApplicableCoupon(price) {
  let src;
  try {
    src = fs.readFileSync(COUPONS_PATH, "utf8");
  } catch {
    return null;
  }
  const objs = [...src.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1]);
  const now = new Date();
  const coupons = objs
    .map((block) => ({
      code: prop(block, "code"),
      discountAmount: numProp(block, "discountAmount") || 0,
      minPurchase: numProp(block, "minPurchase") || 0,
      validUntil: prop(block, "validUntil"),
      active: /active:\s*true/.test(block),
    }))
    .filter((c) => c.code);

  const eligible = coupons.filter(
    (c) => c.active && price >= c.minPurchase && (!c.validUntil || new Date(c.validUntil) > now)
  );
  if (eligible.length === 0) return null;
  return eligible.reduce((best, c) => (c.discountAmount > best.discountAmount ? c : best));
}

// ─── Historial de precio (mismo cálculo que src/lib/price-history.ts) ───
function priceVariationLine(id, currentPrice) {
  let history;
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  } catch {
    return null;
  }
  const raw = history[id];
  if (!raw || raw.length === 0) return null;

  const points = [...raw];
  const last = points[points.length - 1];
  if (currentPrice && currentPrice !== last.p) {
    points.push({ d: new Date().toISOString().slice(0, 10), p: currentPrice });
  }
  if (points.length < 2) return null;

  const prices = points.map((pt) => pt.p);
  const min = Math.min(...prices);
  const minPoint = points.find((pt) => pt.p === min);
  const current = points[points.length - 1].p;
  const pctFromMin = min > 0 ? Math.round(((current - min) / min) * 100) : 0;

  if (current <= min) return "Es el precio más bajo que le vimos registrado.";
  if (pctFromMin <= 5) return `Está a solo ${pctFromMin}% de su mínimo histórico (${formatPrice(min)}).`;
  const [, m, d] = minPoint.d.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `Todavía está ${pctFromMin}% arriba de su mínimo (${formatPrice(min)} el ${d} ${meses[m - 1]}), pero es una baja real igual.`;
}

async function sendToTelegram(token, chatId, photoUrl, caption) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl, caption }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const publicar = args.includes("--canal");
  const oldIdx = args.indexOf("--old");
  const oldOverride = oldIdx >= 0 ? Number(args[oldIdx + 1]) : null;
  const rest = args.filter((a, i) => a !== "--canal" && a !== "--old" && i !== oldIdx + 1);
  const [id, newPriceArg] = rest;
  if (!id || !newPriceArg) {
    console.log("Uso: node scripts/telegram-price-drop.cjs <ID> <precioNuevo> [--canal] [--old <precioViejo>]");
    console.log("--old sirve cuando el catalogo ya se actualizo solo (Bright Data) y el precio");
    console.log("guardado ya ES el nuevo: pasa ahi el precio anterior para armar el mensaje igual.");
    process.exit(1);
  }
  const newPrice = Number(newPriceArg);
  if (!newPrice || newPrice <= 0) {
    console.error("precioNuevo inválido.");
    process.exit(1);
  }

  const env = loadDotEnv();
  const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const privateChatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !privateChatId) {
    console.error("Faltan TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID en .env");
    process.exit(1);
  }
  const chatId = publicar ? CHANNEL_USERNAME : privateChatId;

  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const block = extractProductBlock(src, id);
  if (!block) {
    console.error(`No encontré el producto ${id} en curated-products.ts`);
    process.exit(1);
  }

  const title = prop(block, "title");
  const image = prop(block, "image");
  const oldPrice = oldOverride || numProp(block, "price");
  const description = prop(block, "description");
  const cons = firstConsItem(block);
  const affiliateUrl = prop(block, "affiliateUrl");
  const permalink = prop(block, "permalink");
  const mlLink = affiliateUrl || permalink;

  if (!oldPrice) {
    console.error("No encontré el precio guardado del producto.");
    process.exit(1);
  }
  if (newPrice >= oldPrice) {
    console.error(`El precio nuevo (${formatPrice(newPrice)}) no es menor al guardado (${formatPrice(oldPrice)}). Este script es para bajas, no subas.`);
    process.exit(1);
  }

  const pctDrop = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  const slug = productSlug(id, title);
  const url = `https://productosvirales.com.ar/producto/${slug}`;
  const variation = priceVariationLine(id, newPrice);
  const contra = cons || description || "(sin contra registrada en la ficha — revisar antes de postear)";
  const coupon = getApplicableCoupon(newPrice);

  const lines = [
    title,
    "",
    `Antes ${formatPrice(oldPrice)}, ahora ${formatPrice(newPrice)} (-${pctDrop}%).`,
  ];
  if (variation) lines.push(variation);
  if (coupon) {
    lines.push(`Además hay un cupón activo: ${coupon.code}, -${formatPrice(coupon.discountAmount)} en compras desde ${formatPrice(coupon.minPurchase)}.`);
  }
  lines.push("", contra, "", `Ficha: ${url}`);
  if (affiliateUrl) lines.push(`Comprar directo: ${affiliateUrl}`);
  lines.push("Es afiliado, no te cambia el precio.");

  const caption = lines.join("\n");

  if (!image) {
    console.warn("Ojo: no encontré imagen para este producto, mando el mensaje sin foto.");
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: caption }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
  } else {
    await sendToTelegram(token, chatId, image, caption);
  }

  // Segundo mensaje aparte con el link de MercadoLibre, para chequear el
  // precio desde el celular con un solo tap (adentro del caption de la
  // foto el link queda mezclado con el resto del texto).
  if (mlLink) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: mlLink }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`Telegram API error (2do mensaje): ${JSON.stringify(data)}`);
  }

  console.log(
    publicar
      ? `Publicado en el canal ${CHANNEL_USERNAME}:`
      : "Mensaje enviado a tu chat privado de Telegram para revisar:"
  );
  console.log("---");
  console.log(caption);
  console.log("---");
  if (!publicar) {
    console.log("Si te gusta como quedó, corré el mismo comando agregando --canal al final para publicarlo.");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
