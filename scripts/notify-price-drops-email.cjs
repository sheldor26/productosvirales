#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Manda por EMAIL (Resend) las bajas de precio de la última corrida de Bright
 * Data a los suscriptores con source='price-alert'. Corre como paso del workflow
 * update-prices-brightdata, DESPUÉS de apply-brightdata-prices (que escribe
 * .cache/pending-price-drops.json) — igual que notify-price-drops-telegram.
 *
 * Decisión de producto (Juan): TODAS las bajas reales, en cada corrida (3x/sem).
 *
 * Anti-duplicados: no reenvía una (email, producto, precio) ya avisada (tabla
 * sent_price_alerts) — cubre re-ejecuciones/reintentos y PRs sin mergear.
 *
 * DRY-RUN por defecto. Con --send envía. Requiere en el env:
 *   RESEND_API_KEY, EMAIL_FROM, DATABASE_URL, UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-price-drops-email.cjs            # dry-run
 *   node scripts/notify-price-drops-email.cjs --send     # envía
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DROPS_PATH = path.resolve(".cache/pending-price-drops.json");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const MAX_ITEMS = 12; // tope de productos por mail (evita el "message clipped" de Gmail)

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

// affiliateUrl + imagen por id, parseando el catálogo (.ts).
function catalogLookup(idSet) {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const blocks = src.split(/\n {2}\{\n/).slice(1);
  const map = {};
  for (const b of blocks) {
    const idm = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (!idm) continue;
    const id = idm[1].toUpperCase();
    if (!idSet.has(id)) continue;
    const aff = b.match(/affiliateUrl:\s*['"`]([^'"`]+)['"`]/);
    const img = b.match(/image:\s*['"`]([^'"`]+)['"`]/);
    map[id] = { affiliateUrl: aff ? aff[1] : null, image: img ? img[1] : null };
  }
  return map;
}

// CTA de cada baja: link de afiliado si lo tenemos; si no, la ficha propia
// (que igual lleva el botón de afiliado). Nunca el home.
function offerLink(id, cat) {
  const c = cat[id.toUpperCase()] || {};
  return c.affiliateUrl || `${SITE_URL}/producto/${id.toLowerCase()}`;
}

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

// Botón pill "bulletproof": VML para Outlook (esquinas redondeadas reales),
// <a> con bgcolor para el resto. Acento de marca (rosa #E11D63).
function offerButton(link) {
  const href = esc(link);
  return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:38px;v-text-anchor:middle;width:120px;" arcsize="50%" strokecolor="#E11D63" fillcolor="#E11D63">
                    <w:anchorlock/><center style="color:#ffffff;font-family:${FONT};font-size:14px;font-weight:bold;">Ver oferta</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-- -->
                  <a href="${href}" target="_blank" style="display:inline-block;background:#E11D63;color:#ffffff;text-decoration:none;font-family:${FONT};font-size:14px;font-weight:600;line-height:38px;padding:0 22px;border-radius:9999px;">Ver oferta</a>
                  <!--<![endif]-->
                </td></tr>
              </table>`;
}

function dropRowsHtml(drops, cat) {
  return drops
    .map((d, i) => {
      const c = cat[d.id.toUpperCase()] || {};
      const link = offerLink(d.id, cat);
      const off = Math.abs(d.pct);
      const last = i === drops.length - 1;
      const thumb = c.image
        ? `<img src="${esc(c.image)}" width="56" height="56" alt="${esc(d.title)}" style="display:block;width:56px;height:56px;border-radius:12px;border:1px solid #eeeeee;background-color:#f4f4f2;" />`
        : `<div style="width:56px;height:56px;border-radius:12px;background-color:#f4f4f2;border:1px solid #eeeeee;"></div>`;
      return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="row" style="${last ? "" : "border-bottom:1px solid #eeeeee;"}">
          <tr>
            <td width="56" valign="top" style="padding:20px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="56" height="56" bgcolor="#f4f4f2" style="background-color:#f4f4f2;border-radius:12px;">${thumb}</td></tr></table>
            </td>
            <td valign="top" style="padding:20px 0 20px 16px;">
              <div class="text-main" style="font-family:${FONT};font-size:16px;font-weight:600;color:#111111;line-height:1.3;">${esc(d.title)}</div>
              <div style="font-family:${FONT};font-size:14px;margin:6px 0 14px;">
                <span style="text-decoration:line-through;color:#999999;">${fmtPrice(d.stored)}</span>
                &nbsp;<strong style="color:#16a34a;">${fmtPrice(d.scraped)}</strong>
                &nbsp;<span class="chip" style="background-color:#fce7f0;color:#c2185b;font-size:12px;font-weight:700;padding:2px 8px;border-radius:10px;">-${off}%</span>
              </div>${offerButton(link)}
            </td>
          </tr>
        </table>`;
    })
    .join("");
}

// Asunto honesto, casual, sin emoji ni urgencia (voice.md).
function subject(shown, totalFresh) {
  const top = shown[0];
  if (top && totalFresh > 1) return `Bajó de precio ${top.title.slice(0, 42)} y ${totalFresh - 1} más`;
  if (top) return `Bajó de precio ${top.title.slice(0, 60)}`;
  return "Nuevas bajas de precio en MercadoLibre";
}

function emailHtml(shown, cat, email, totalFresh) {
  const top = shown[0];
  const preheader = top
    ? `${top.title.slice(0, 48)} bajó ${Math.abs(top.pct)}%${totalFresh > 1 ? ` y ${totalFresh - 1} más` : ""}.`
    : "Nuevas bajas de precio.";
  const moreCount = totalFresh - shown.length;
  const moreLine =
    moreCount > 0
      ? `<tr><td align="center" style="padding:8px 40px 32px;"><a href="${SITE_URL}" class="muted" style="font-family:${FONT};font-size:14px;color:#666666;text-decoration:none;">y ${moreCount} baja${moreCount > 1 ? "s" : ""} más en el sitio</a></td></tr>`
      : `<tr><td style="padding:0 0 12px;"></td></tr>`;
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>Alertas de precio — ProductosVirales</title>
<style>
  body{margin:0;padding:0;width:100%!important;-webkit-font-smoothing:antialiased;}
  a{text-decoration:none;}
  @media (prefers-color-scheme: dark){
    .body-bg{background-color:#0c0c18!important;}
    .card{background-color:#16162a!important;border-color:rgba(255,255,255,.10)!important;}
    .text-main{color:#e8e8ec!important;}
    .muted{color:#999999!important;}
    .row{border-color:rgba(255,255,255,.10)!important;}
  }
</style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#f8f8f6;font-family:${FONT};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:#f8f8f6;font-size:1px;line-height:1px;">${esc(preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="body-bg" style="background-color:#f8f8f6;">
    <tr><td align="center" style="padding:40px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="card" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #eeeeee;border-radius:20px;">
        <tr><td align="center" style="padding:36px 40px 8px;">
          <span class="text-main" style="font-family:${FONT};font-size:20px;font-weight:800;color:#111111;letter-spacing:-.02em;">productos<span style="background-color:#fce7f0;color:#e11d63;padding:3px 11px;border-radius:9999px;margin-left:3px;">virales</span></span>
        </td></tr>
        <tr><td align="left" style="padding:16px 40px 4px;">
          <h1 class="text-main" style="margin:0;font-family:${FONT};font-size:23px;font-weight:700;color:#111111;letter-spacing:-.02em;line-height:1.25;">Encontramos ${totalFresh} baja${totalFresh > 1 ? "s" : ""} de precio</h1>
          <p class="muted" style="margin:10px 0 4px;font-family:${FONT};font-size:15px;color:#666666;line-height:1.55;">Estas bajaron hoy en MercadoLibre. El precio puede cambiar, confirmalo en el link.</p>
        </td></tr>
        <tr><td style="padding:8px 40px 0;">${dropRowsHtml(shown, cat)}</td></tr>
        ${moreLine}
      </table>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:28px 24px 8px;font-family:${FONT};font-size:13px;color:#999999;line-height:1.6;">
          <span class="muted">Ganamos una comisión si comprás por los links — no te cambia el precio.</span><br>
          <span class="muted">Recibís esto porque pediste alertas de precio en productosvirales.com.ar.</span><br>
          <a href="${SITE_URL}/privacidad" class="muted" style="color:#999999;text-decoration:underline;">Privacidad</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl(email)}" class="muted" style="color:#999999;text-decoration:underline;">Cancelar suscripción</a>
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
    WHERE source = 'price-alert' AND unsubscribed = false
  `;
  return rows.map((r) => r.email);
}

// Set de "email|id|price" ya avisados, para no repetir.
async function getSentSet(sql, emails, drops) {
  if (emails.length === 0) return new Set();
  const ids = [...new Set(drops.map((d) => d.id.toUpperCase()))];
  const rows = await sql`
    SELECT email, product_id, price FROM sent_price_alerts
    WHERE email = ANY(${emails}) AND upper(product_id) = ANY(${ids})
  `;
  return new Set(rows.map((r) => `${r.email}|${r.product_id.toUpperCase()}|${r.price}`));
}

async function markSent(sql, email, items) {
  for (const d of items) {
    await sql`
      INSERT INTO sent_price_alerts (email, product_id, price)
      VALUES (${email}, ${d.id.toUpperCase()}, ${Math.round(d.scraped)})
      ON CONFLICT (email, product_id, price) DO NOTHING
    `;
  }
}

async function main() {
  // --preview: genera el mail con 3 productos reales del catálogo (precios de
  // ejemplo) y lo escribe a .cache/email-preview.html para revisarlo.
  if (process.argv.includes("--preview")) {
    const src = fs.readFileSync(CATALOG_PATH, "utf8");
    const blocks = src.split(/\n {2}\{\n/).slice(1);
    const sample = [];
    for (const b of blocks) {
      const id = (b.match(/id:\s*['"`]([^'"`]+)/) || [])[1];
      const title = (b.match(/title:\s*['"`]([^'"`]+)/) || [])[1];
      const image = (b.match(/image:\s*['"`]([^'"`]+)/) || [])[1];
      if (id && title && image) {
        const stored = 120000 + sample.length * 90000;
        sample.push({ id, title, image, stored, scraped: Math.round(stored * (0.82 - sample.length * 0.03)), pct: -18 - sample.length * 3 });
      }
      if (sample.length >= 3) break;
    }
    const cat = {};
    sample.forEach((s) => (cat[s.id.toUpperCase()] = { image: s.image, affiliateUrl: null }));
    const out = path.resolve(".cache/email-preview.html");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, emailHtml(sample, cat, "vos@ejemplo.com", 15));
    console.log("[email] preview -> " + out);
    return;
  }

  if (!fs.existsSync(DROPS_PATH)) {
    console.log("[email] no hay pending-price-drops.json — nada que mandar.");
    return;
  }
  const parsed = JSON.parse(fs.readFileSync(DROPS_PATH, "utf8"));
  const drops = (parsed.drops || []).filter((d) => d.scraped < d.stored);
  if (drops.length === 0) {
    console.log("[email] sin bajas reales en esta corrida — nada que mandar.");
    return;
  }
  drops.sort((a, b) => a.pct - b.pct); // más negativo (mayor % baja) primero
  const cat = catalogLookup(new Set(drops.map((d) => d.id.toUpperCase())));

  console.log(`[email] bajas reales: ${drops.length} | modo: ${SEND ? "ENVÍO" : "DRY-RUN"}`);
  drops.forEach((d) => console.log(`   -${Math.abs(d.pct)}%  ${d.title}  ${fmtPrice(d.stored)}→${fmtPrice(d.scraped)}`));

  if (!SEND) {
    console.log("[email] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }

  // Guards de envío: si falta algún secret, no mandamos (mails con links de baja
  // rotos serían peor que no mandar).
  if (!process.env.RESEND_API_KEY) return void console.log("[email] falta RESEND_API_KEY — no se envió.");
  if (!process.env.UNSUBSCRIBE_SECRET) return void console.log("[email] falta UNSUBSCRIBE_SECRET — no se envió (los links de baja serían inválidos).");
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return void console.log("[email] falta DATABASE_URL — no se envió.");

  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const emails = await getSubscribers(sql);
  if (emails.length === 0) return void console.log("[email] no hay suscriptores price-alert — nada que mandar.");

  const sentSet = await getSentSet(sql, emails, drops);
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  let sent = 0;
  let skipped = 0;
  for (const email of emails) {
    const fresh = drops.filter((d) => !sentSet.has(`${email}|${d.id.toUpperCase()}|${Math.round(d.scraped)}`));
    if (fresh.length === 0) {
      skipped++;
      continue;
    }
    const shown = fresh.slice(0, MAX_ITEMS);
    const idem = "pa-" + crypto.createHash("sha256").update(email + "|" + shown.map((d) => `${d.id}:${Math.round(d.scraped)}`).join(",")).digest("hex").slice(0, 24);
    try {
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: email,
          subject: subject(shown, fresh.length),
          html: emailHtml(shown, cat, email, fresh.length),
          headers: {
            "List-Unsubscribe": `<${unsubUrl(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        { idempotencyKey: idem }
      );
      if (error) {
        console.error(`[email] error a ${email}:`, error);
      } else {
        await markSent(sql, email, shown);
        sent++;
      }
    } catch (e) {
      console.error(`[email] excepción a ${email}:`, e.message);
    }
    await sleep(150); // ~6-7/s, bajo el límite de Resend (10/s)
  }
  console.log(`[email] enviados: ${sent} | sin bajas nuevas (saltados): ${skipped} | total suscriptores: ${emails.length}`);
}

main().catch((e) => {
  console.error("[email] fallo:", e);
  process.exit(1);
});
