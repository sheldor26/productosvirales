#!/usr/bin/env node

/**
 * Manda por EMAIL (Resend) el cupón vigente a los suscriptores con
 * source='newsletter' (los de NewsletterBanner, no los de alerta de precio
 * puntual — mismo criterio que notify-weekly-digest.cjs).
 *
 * Lee el/los cupón(es) activos directo de `src/data/coupons.ts` (parseo de
 * texto, igual que `catalogLookup` en los otros scripts de email — no hay
 * import ESM desde un .cjs). Si no hay ningún cupón activo AHORA (según
 * `active`/`validFrom`/`validUntil`), no manda nada: así el script queda
 * listo para cuando Juan suba el cupón del día, sin tocar código de nuevo.
 *
 * Selección de productos: entre los que ya tienen un reseñas/rating sólido
 * (prueba social real) y precio por encima del `minPurchase` del mejor
 * cupón activo, para que el cupón efectivamente aplique.
 *
 * RECORDATORIO (regla ya aprendida, ver memoria "cupones-activos-chequear-
 * al-postear"): antes de --send, probar el cupón en el carrito real de
 * MercadoLibre con al menos uno de los productos elegidos — no alcanza con
 * chequear mentalmente que el precio supere el mínimo.
 *
 * DRY-RUN por defecto. Con --send envía. Con --preview escribe un HTML de
 * ejemplo a .cache/coupon-email-preview.html sin tocar la base ni enviar nada.
 * Requiere en el env: RESEND_API_KEY, EMAIL_FROM, DATABASE_URL,
 * UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-coupon-email.cjs            # dry-run (lee el cupón real, no envía)
 *   node scripts/notify-coupon-email.cjs --preview   # HTML a archivo, no toca DB
 *   node scripts/notify-coupon-email.cjs --send      # envía de verdad
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const COUPONS_PATH = path.resolve("src/data/coupons.ts");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <hola@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const MAX_ITEMS = 8; // grilla 2 columnas, estilo mail de ML: varios productos, no una lista angosta
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const ACCENT = "#E11D63";
// Banner de Cyber Monday generado con AGY (ver scratchpad/cybermonday-banner),
// copiado a public/ y servido por el propio sitio. Hace falta deployar antes
// de --send para que el email no linkee a una imagen 404.
const BANNER_URL = `${SITE_URL}/images/email/cybermonday-2026-banner.png`;
// Perfil social de afiliado en ML (https://www.mercadolibre.com.ar/social/jm159)
// — ahí es donde se "aplica" un cupón: cualquier compra que salga desde ese
// perfil comisiona, sin atarse a un producto puntual del mail. matt_tool es
// el ID de cuenta fijo de Juan (ver LEARNINGS.md 2026-09-24).
const SOCIAL_STORE_URL = "https://www.mercadolibre.com.ar/social/jm159?matt_word=productosvirales&matt_tool=12465328";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fmtPrice(n) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function unsubToken(email) {
  return crypto
    .createHmac("sha256", process.env.UNSUBSCRIBE_SECRET || "")
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}
function unsubUrl(email) {
  return `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubToken(email)}`;
}
function truncateWords(s, max) {
  if (!s || s.length <= max) return s || "";
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 20 ? cut.slice(0, sp) : cut).trim() + "…";
}

// --- Parseo de src/data/coupons.ts (texto, sin import ESM) ---
function parseCoupons() {
  const src = fs.readFileSync(COUPONS_PATH, "utf8");
  const blocks = src.split(/\n {2}\{/).slice(1);
  const now = new Date();
  const coupons = [];
  for (const raw of blocks) {
    const b = "{" + raw;
    const code = (b.match(/code:\s*["'`]([^"'`]+)["'`]/) || [])[1];
    if (!code) continue;
    const discountAmount = Number((b.match(/discountAmount:\s*(\d+)/) || [])[1] || 0) || null;
    const discountPercent = Number((b.match(/discountPercent:\s*(\d+)/) || [])[1] || 0) || null;
    const maxDiscount = Number((b.match(/maxDiscount:\s*(\d+)/) || [])[1] || 0) || null;
    const minPurchase = Number((b.match(/minPurchase:\s*(\d+)/) || [])[1] || 0);
    const activeM = b.match(/active:\s*(true|false)/);
    const active = activeM ? activeM[1] === "true" : false;
    const validFromM = b.match(/validFrom:\s*["'`]([^"'`]+)["'`]/);
    const validUntilM = b.match(/validUntil:\s*["'`]([^"'`]+)["'`]/);
    const validFrom = validFromM ? validFromM[1] : null;
    const validUntil = validUntilM ? validUntilM[1] : null;
    coupons.push({ code, discountAmount, discountPercent, maxDiscount, minPurchase, active, validFrom, validUntil });
  }
  return coupons.filter((c) => {
    if (!c.active) return false;
    if (c.validFrom && new Date(c.validFrom) > now) return false;
    if (c.validUntil && new Date(c.validUntil) <= now) return false;
    return true;
  });
}

function discountFor(c, price) {
  if (c.discountPercent) {
    const raw = Math.floor((price * c.discountPercent) / 100);
    return c.maxDiscount ? Math.min(raw, c.maxDiscount) : raw;
  }
  return c.discountAmount || 0;
}

function bestCoupon(coupons, price) {
  const eligible = coupons.filter((c) => price >= c.minPurchase);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, c) => (discountFor(c, price) > discountFor(best, price) ? c : best));
}

// --- Parseo liviano del catálogo: id, title, price, image, affiliateUrl, rating, reviewCount, visibility ---
function loadCatalog() {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  // Separa también las fichas `const nombre: Product = {...}` extraídas antes
  // del array (fix TS2590, ver tasks/lessons.md) — si no, quedan invisibles acá.
  const blocks = src.split(/\n(?:  \{|const \w+: Product = \{)\n/).slice(1);
  const products = [];
  for (const b of blocks) {
    const id = (b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/) || [])[1];
    const title = (b.match(/title:\s*['"`]([^'"`]+)['"`]/) || [])[1];
    const price = Number((b.match(/(?:^|\n)\s{4}price:\s*(\d+)/) || [])[1] || 0);
    const image = (b.match(/(?:^|\n)\s*image:\s*['"`]([^'"`]+)['"`]/) || [])[1];
    const affiliateUrl = (b.match(/affiliateUrl:\s*['"`]([^'"`]+)['"`]/) || [])[1];
    const rating = Number((b.match(/(?:^|\n)\s{4}rating:\s*([\d.]+)/) || [])[1] || 0) || null;
    const reviewCount = Number((b.match(/(?:^|\n)\s{4}reviewCount:\s*(\d+)/) || [])[1] || 0) || null;
    const visibility = (b.match(/visibility:\s*['"`]([^'"`]+)['"`]/) || [])[1] || "normal";
    const priceStatus = (b.match(/priceStatus:\s*['"`]([^'"`]+)['"`]/) || [])[1] || "fresh";
    if (id && title && price && affiliateUrl) {
      products.push({ id, title, price, image, affiliateUrl, rating, reviewCount, visibility, priceStatus });
    }
  }
  return products;
}

// Elige productos reales, vigentes, con prueba social (reseñas) y precio
// suficiente para que el mejor cupón activo aplique. Ordena por reviewCount
// (más probado primero) y diversifica un poco tomando de distintos rangos.
function pickFeatured(products, coupons, max) {
  const eligible = products.filter(
    (p) =>
      p.visibility === "normal" &&
      p.priceStatus !== "out_of_stock" &&
      p.rating &&
      p.rating >= 4.5 &&
      p.reviewCount &&
      p.reviewCount >= 50 &&
      bestCoupon(coupons, p.price)
  );
  eligible.sort((a, b) => b.reviewCount - a.reviewCount);
  // Evita 2 productos casi idénticos de precio (ej. 2 variantes del mismo
  // modelo): se queda con el primero que ve cada banda de $50.000.
  const seenBand = new Set();
  const picked = [];
  for (const p of eligible) {
    const band = Math.floor(p.price / 50000);
    if (seenBand.has(band)) continue;
    seenBand.add(band);
    picked.push(p);
    if (picked.length >= max) break;
  }
  return picked;
}

function offerButton(link, label) {
  const href = esc(link);
  return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="left">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:40px;v-text-anchor:middle;width:170px;" arcsize="50%" strokecolor="${ACCENT}" fillcolor="${ACCENT}">
                  <w:anchorlock/><center style="color:#ffffff;font-family:${FONT};font-size:14px;font-weight:bold;">${label}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${href}" target="_blank" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-family:${FONT};font-size:14px;font-weight:600;line-height:40px;padding:0 24px;border-radius:9999px;">${label}</a>
                <!--<![endif]-->
              </td></tr></table>`;
}

function ratingHtml(p) {
  if (!p.rating) return "";
  const rev = p.reviewCount ? ` <span style="color:#c9c9c9;">(${p.reviewCount.toLocaleString("es-AR")})</span>` : "";
  return `<div class="muted" style="font-family:${FONT};font-size:13px;color:#666666;margin-top:3px;">&#9733; ${p.rating.toFixed(1)}${rev}</div>`;
}

// El cupón "estrella" para subject/preheader: el de mayor descuento nominal
// entre los activos (solo para el copy de apertura — cada producto de abajo
// sigue usando SU propio mejor cupón, ver productRow).
function topCoupon(coupons) {
  return coupons.reduce((best, c) => (discountFor(c, c.minPurchase) > discountFor(best, best.minPurchase) ? c : best));
}

function subject(coupons) {
  const top = topCoupon(coupons);
  const disc = top.discountAmount ? fmtPrice(top.discountAmount) : `${top.discountPercent}%`;
  return `Cyber Monday: hasta ${disc} OFF hoy en Mercado Libre`;
}

function couponBar(coupons) {
  return coupons
    .map((c) => {
      const disc = c.discountAmount ? fmtPrice(c.discountAmount) : `${c.discountPercent}%`;
      return `<td align="center" style="padding:0 5px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="chip-card" style="background-color:#fce7f0;border-radius:12px;">
                  <tr><td align="center" style="padding:10px 6px;">
                    <div class="text-main" style="font-family:${FONT};font-size:13px;font-weight:800;color:#111111;">${esc(c.code)}</div>
                    <div class="muted" style="font-family:${FONT};font-size:12px;color:#666666;margin-top:2px;">${disc} desde ${fmtPrice(c.minPurchase)}</div>
                  </td></tr>
                </table>
              </td>`;
    })
    .join("");
}

function productCard(p, coupons) {
  const coupon = bestCoupon(coupons, p.price);
  const href = esc(p.affiliateUrl);
  const disc = discountFor(coupon, p.price);
  const final = p.price - disc;
  const thumb = p.image
    ? `<img src="${esc(p.image)}" width="130" height="130" alt="${esc(p.title)}" style="display:block;width:130px;height:130px;object-fit:cover;border-radius:12px;" />`
    : `<div style="width:130px;height:130px;border-radius:12px;background-color:#f4f4f2;"></div>`;
  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="card" style="background-color:#ffffff;border:1px solid #eeeeee;border-radius:16px;">
    <tr><td align="center" style="padding:16px 16px 0;position:relative;">
      <a href="${href}" target="_blank"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="130" height="130" bgcolor="#f4f4f2" style="background-color:#f4f4f2;border-radius:12px;">${thumb}</td></tr></table></a>
    </td></tr>
    <tr><td style="padding:12px 16px 0;">
      <a href="${href}" target="_blank" class="text-main" style="display:block;font-family:${FONT};font-size:14px;font-weight:600;color:#111111;line-height:1.3;text-decoration:none;height:36px;overflow:hidden;">${esc(truncateWords(p.title, 52))}</a>
      ${ratingHtml(p)}
    </td></tr>
    <tr><td style="padding:9px 16px 16px;">
      <span class="muted" style="font-family:${FONT};font-size:12px;text-decoration:line-through;color:#999999;">${fmtPrice(p.price)}</span><br>
      <span class="text-main" style="font-family:${FONT};font-size:19px;font-weight:800;color:#111111;">${fmtPrice(final)}</span>
      &nbsp;<span class="chip" style="background-color:#fce7f0;color:${ACCENT};font-size:11px;font-weight:700;padding:3px 7px;border-radius:9px;white-space:nowrap;">${coupon.code}</span>
      <div style="margin-top:10px;">${offerButton(href, "Comprar")}</div>
    </td></tr>
  </table>`;
}

// Grilla de 2 columnas (compatible con clientes de mail viejos: <table> fijo,
// no CSS grid). `items` debe tener cantidad par para que la última fila
// quede completa; si es impar, la celda sobrante queda vacía.
function productGrid(items, coupons) {
  let rows = "";
  for (let i = 0; i < items.length; i += 2) {
    const left = productCard(items[i], coupons);
    const right = items[i + 1] ? productCard(items[i + 1], coupons) : "";
    rows += `
      <tr>
        <td width="48%" valign="top" style="padding:0 0 16px;">${left}</td>
        <td width="4%"></td>
        <td width="48%" valign="top" style="padding:0 0 16px;">${right}</td>
      </tr>`;
  }
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">${rows}</table>`;
}

function emailHtml(coupons, items, email) {
  const top = topCoupon(coupons);
  const topDisc = top.discountAmount ? fmtPrice(top.discountAmount) : `${top.discountPercent}% OFF`;
  const untilTxt = top.validUntil
    ? new Date(top.validUntil).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit" })
    : null;
  const preheader = `Hasta ${topDisc} con cupón en Mercado Libre${untilTxt ? `, hoy hasta las ${untilTxt}` : ""}. Varios productos elegidos para vos.`;
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>Cyber Monday — ProductosVirales</title>
<style>
  body{margin:0;padding:0;width:100%!important;-webkit-font-smoothing:antialiased;}
  a{text-decoration:none;}
  @media (prefers-color-scheme: dark){
    .body-bg{background-color:#0c0c18!important;}
    .card,.chip-card{background-color:#16162a!important;border-color:rgba(255,255,255,.10)!important;}
    .text-main{color:#e8e8ec!important;}
    .muted{color:#9a9aa5!important;}
    .row{border-color:rgba(255,255,255,.10)!important;}
    .chip{background-color:#3a1830!important;color:#ff8ab8!important;}
  }
</style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#f8f8f6;font-family:${FONT};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:#f8f8f6;font-size:1px;line-height:1px;">${esc(preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="body-bg" style="background-color:#f8f8f6;">
    <tr><td align="center" style="padding:32px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:0 0 20px;">
          <span class="text-main" style="font-family:${FONT};font-size:22px;font-weight:800;color:#111111;letter-spacing:-.03em;">productos<span style="background-color:#fce7f0;color:${ACCENT};padding:3px 11px;border-radius:9999px;margin-left:4px;">virales</span></span>
        </td></tr>
        <tr><td style="border-radius:16px;overflow:hidden;">
          <a href="${esc(SOCIAL_STORE_URL)}" target="_blank"><img src="${BANNER_URL}" width="600" alt="Cyber Monday: hasta ${topDisc} con cupón, hoy en Mercado Libre" style="display:block;width:100%;max-width:600px;height:auto;border-radius:16px;border:0;" /></a>
        </td></tr>
        <tr><td style="padding:18px 2px 4px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>${couponBar(coupons)}</tr></table>
        </td></tr>
        <tr><td style="padding:14px 2px 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0c1440;border-radius:14px;">
            <tr>
              <td align="left" style="padding:16px 18px;" valign="middle">
                <span style="font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;">Aplicá los cupones en Mercado Libre</span><br>
                <span style="font-family:${FONT};font-size:12px;color:#b9c0e8;">Pegalos en el carrito de cualquier compra desde nuestra tienda</span>
              </td>
              <td align="right" style="padding:16px 18px;" valign="middle">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#FFD400" style="background-color:#FFD400;border-radius:9999px;">
                  <a href="${esc(SOCIAL_STORE_URL)}" target="_blank" style="display:inline-block;font-family:${FONT};font-size:13px;font-weight:800;color:#0c1440;line-height:36px;padding:0 20px;white-space:nowrap;">Ir a la tienda →</a>
                </td></tr></table>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td align="left" style="padding:16px 2px 14px;">
          <p class="muted" style="margin:0;font-family:${FONT};font-size:14px;color:#666666;line-height:1.55;">Elegí el cupón según el total de tu compra y pegalo en el carrito antes de pagar${untilTxt ? ` — vence hoy a las ${untilTxt}` : ""}. Los precios de abajo ya tienen el descuento de cada cupón aplicado.</p>
        </td></tr>
        <tr><td style="padding:4px 0 0;">${productGrid(items, coupons)}</td></tr>
      </table>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:10px 24px 8px;font-family:${FONT};font-size:13px;color:#737373;line-height:1.6;">
          <span class="muted" style="color:#737373;">Ganamos una comisión si comprás por los links — no te cambia el precio. Los cupones los emite Mercado Libre, no nosotros.</span><br>
          <a href="${SITE_URL}/privacidad" class="muted" style="color:#737373;text-decoration:underline;">Privacidad</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl(email)}" class="muted" style="color:#737373;text-decoration:underline;">Cancelar suscripción</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function getSubscribers(sql) {
  const rows = await sql`
    SELECT email FROM subscribers
    WHERE source = 'newsletter' AND unsubscribed = false
  `;
  return rows.map((r) => r.email);
}

async function main() {
  const coupons = parseCoupons();
  const catalog = loadCatalog();

  if (coupons.length === 0) {
    console.log("[coupon-email] no hay ningún cupón activo AHORA en src/data/coupons.ts — nada que mandar.");
    console.log("[coupon-email] en cuanto Juan suba el cupón de hoy, correr de nuevo (dry-run primero).");
    return;
  }

  // Cada producto usa SU propio mejor cupón (bestCoupon por precio), tanto
  // para elegirlo (pickFeatured exige que al menos uno de los 3 le aplique)
  // como para mostrarlo (productCard). Ya no hay un "cupón de referencia"
  // único — ver el bug documentado en el historial de este archivo.
  const items = pickFeatured(catalog, coupons, MAX_ITEMS);

  coupons.forEach((c) =>
    console.log(`[coupon-email] cupón: ${c.code} | ${c.discountAmount ? fmtPrice(c.discountAmount) : c.discountPercent + "%"} desde ${fmtPrice(c.minPurchase)} | vence ${c.validUntil || "sin fecha"}`)
  );
  console.log(`[coupon-email] productos elegidos: ${items.length}`);
  items.forEach((p) => console.log(`   ${fmtPrice(p.price)}  ${p.title}  (★${p.rating}, ${p.reviewCount}) -> ${bestCoupon(coupons, p.price).code}`));

  if (items.length === 0) {
    console.log("[coupon-email] ningún producto del catálogo cumple los filtros (rating≥4.5, reviews≥50, precio aplica algún cupón) — revisar manualmente antes de mandar.");
    return;
  }

  if (process.argv.includes("--preview")) {
    const out = path.resolve(".cache/coupon-email-preview.html");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, emailHtml(coupons, items, "vos@ejemplo.com"));
    console.log("[coupon-email] preview -> " + out);
    return;
  }

  if (!SEND) {
    console.log("[coupon-email] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }

  if (!process.env.RESEND_API_KEY) return void console.log("[coupon-email] falta RESEND_API_KEY — no se envió.");
  if (!process.env.UNSUBSCRIBE_SECRET) return void console.log("[coupon-email] falta UNSUBSCRIBE_SECRET — no se envió.");
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return void console.log("[coupon-email] falta DATABASE_URL — no se envió.");

  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const emails = await getSubscribers(sql);
  if (emails.length === 0) return void console.log("[coupon-email] no hay suscriptores newsletter — nada que mandar.");

  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const couponsKey = coupons.map((c) => `${c.code}|${c.validUntil}`).join(",");
  let sent = 0;
  for (const email of emails) {
    const idem = "cp-" + crypto.createHash("sha256").update(`${email}|${couponsKey}`).digest("hex").slice(0, 24);
    try {
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: email,
          subject: subject(coupons),
          html: emailHtml(coupons, items, email),
          headers: {
            "List-Unsubscribe": `<${unsubUrl(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        { idempotencyKey: idem }
      );
      if (error) console.error(`[coupon-email] error a ${email}:`, error);
      else sent++;
    } catch (e) {
      console.error(`[coupon-email] excepción a ${email}:`, e.message);
    }
    await sleep(150);
  }
  console.log(`[coupon-email] enviados: ${sent} / ${emails.length} suscriptores`);
}

main().catch((e) => {
  console.error("[coupon-email] fallo:", e);
  process.exit(1);
});
