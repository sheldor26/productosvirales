#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Digest semanal por EMAIL (Resend) a los suscriptores con source='newsletter'
 * (los que se anotaron desde NewsletterBanner, no desde el widget de alerta de
 * precio puntual). Muestra las bajas de precio reales más grandes de los
 * últimos 7 días, calculadas directo desde price-history.json — no depende
 * del archivo efímero .cache/pending-price-drops.json que usa
 * notify-price-drops-email.cjs (ese es por corrida de Bright Data; este es
 * semanal e independiente).
 *
 * Pensado para correr 1 vez por semana (cron aparte, no agregado a ningún
 * workflow todavía — falta que Juan decida día/hora y lo agregue).
 *
 * DRY-RUN por defecto. Con --send envía. Con --preview escribe un HTML de
 * ejemplo a .cache/digest-preview.html sin tocar la base ni enviar nada.
 * Requiere en el env: RESEND_API_KEY, EMAIL_FROM, DATABASE_URL,
 * UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-weekly-digest.cjs            # dry-run
 *   node scripts/notify-weekly-digest.cjs --preview   # HTML de ejemplo local
 *   node scripts/notify-weekly-digest.cjs --send      # envía
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HISTORY_PATH = path.resolve("src/data/price-history.json");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const MAX_ITEMS = 6;
const LOOKBACK_DAYS = 7;
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

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

// title/image/affiliateUrl/rating por id, parseando el catálogo (.ts) — mismo
// approach que notify-price-drops-email.cjs, para no requerir un TS a un
// script .cjs.
function catalogLookup(idSet) {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const blocks = src.split(/\n {2}\{\n/).slice(1);
  const map = {};
  for (const b of blocks) {
    const idm = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (!idm) continue;
    const id = idm[1].toUpperCase();
    if (!idSet.has(id)) continue;
    const title = b.match(/(?:^|\n)\s*title:\s*['"`]([^'"`]+)['"`]/);
    const aff = b.match(/affiliateUrl:\s*['"`]([^'"`]+)['"`]/);
    const img = b.match(/(?:^|\n)\s*image:\s*['"`]([^'"`]+)['"`]/);
    const rat = b.match(/(?:^|\n)\s{4}rating:\s*([\d.]+)/);
    const rev = b.match(/(?:^|\n)\s{4}reviewCount:\s*(\d+)/);
    map[id] = {
      title: title ? title[1] : id,
      affiliateUrl: aff ? aff[1] : null,
      image: img ? img[1] : null,
      rating: rat ? Number(rat[1]) : null,
      reviewCount: rev ? Number(rev[1]) : null,
    };
  }
  return map;
}

function offerLink(id, cat) {
  const c = cat[id.toUpperCase()] || {};
  return c.affiliateUrl || `${SITE_URL}/producto/${id.toLowerCase()}`;
}

/** Baja real de los últimos LOOKBACK_DAYS días para un producto, o null si no
 * hay suficientes datos o el precio no bajó (nunca inventamos una baja). */
function weeklyDrop(id, points) {
  if (!points || points.length < 2) return null;
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const inWindow = points.filter((p) => new Date(p.d + "T12:00:00").getTime() >= cutoff);
  if (inWindow.length === 0) return null;
  const first = inWindow[0].p;
  const current = points[points.length - 1].p;
  if (current >= first) return null; // solo bajas reales, nunca subas presentadas como oferta
  const pct = Math.round(((current - first) / first) * 100);
  return { id, stored: first, scraped: current, pct };
}

function offerButton(link, label) {
  const href = esc(link);
  return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="left">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:40px;v-text-anchor:middle;width:170px;" arcsize="50%" strokecolor="#E11D63" fillcolor="#E11D63">
                  <w:anchorlock/><center style="color:#ffffff;font-family:${FONT};font-size:14px;font-weight:bold;">${label}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${href}" target="_blank" style="display:inline-block;background:#E11D63;color:#ffffff;text-decoration:none;font-family:${FONT};font-size:14px;font-weight:600;line-height:40px;padding:0 24px;border-radius:9999px;">${label}</a>
                <!--<![endif]-->
              </td></tr></table>`;
}

function ratingHtml(c) {
  if (!c || !c.rating) return "";
  const rev = c.reviewCount ? ` <span style="color:#c9c9c9;">(${c.reviewCount.toLocaleString("es-AR")})</span>` : "";
  return `<div style="font-family:${FONT};font-size:13px;color:#666666;margin-top:3px;">&#9733; ${c.rating.toFixed(1)}${rev}</div>`;
}

function productRow(d, cat, isFirst, isLast) {
  const c = cat[d.id.toUpperCase()] || {};
  const href = esc(offerLink(d.id, cat));
  const off = Math.abs(d.pct);
  const thumb = c.image
    ? `<img src="${esc(c.image)}" width="72" height="72" alt="${esc(c.title)}" style="display:block;width:72px;height:72px;border-radius:12px;border:1px solid #eeeeee;background-color:#f4f4f2;" />`
    : `<div style="width:72px;height:72px;border-radius:12px;background-color:#f4f4f2;border:1px solid #eeeeee;"></div>`;
  return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="${isLast ? "" : "border-bottom:1px solid #eeeeee;"}">
          <tr>
            <td width="72" valign="top" style="padding:22px 0;">
              <a href="${href}" target="_blank"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="72" height="72" bgcolor="#f4f4f2" style="background-color:#f4f4f2;border-radius:12px;">${thumb}</td></tr></table></a>
            </td>
            <td valign="top" style="padding:22px 0 22px 16px;">
              ${isFirst ? `<div style="font-family:${FONT};font-size:11px;font-weight:700;color:#e11d63;letter-spacing:.05em;text-transform:uppercase;margin-bottom:5px;">La baja más grande de la semana</div>` : ""}
              <a href="${href}" target="_blank" style="font-family:${FONT};font-size:16px;font-weight:600;color:#111111;line-height:1.3;text-decoration:none;">${esc(c.title || d.id)}</a>
              ${ratingHtml(c)}
              <div style="font-family:${FONT};font-size:15px;color:#111111;margin:9px 0 15px;">
                <span style="text-decoration:line-through;color:#999999;">${fmtPrice(d.stored)}</span>
                &nbsp;<strong style="font-size:18px;">${fmtPrice(d.scraped)}</strong>
                &nbsp;<span style="background-color:#fce7f0;color:#e11d63;font-size:12px;font-weight:700;padding:3px 8px;border-radius:10px;white-space:nowrap;">-${off}%</span>
              </div>${offerButton(href, "Ver precio actual")}
            </td>
          </tr>
        </table>`;
}

function subject(shown) {
  const top = shown[0];
  return top ? `Esta semana bajó: ${truncateWords((top.title || top.id), 40)}` : "Las bajas de precio de la semana";
}

function emailHtml(shown, cat, email) {
  const top = shown[0];
  const topTitle = top ? (cat[top.id.toUpperCase()] || {}).title || top.id : "";
  const preheader = top
    ? `${truncateWords(topTitle, 44)} quedó en ${fmtPrice(top.scraped)}. Los precios pueden cambiar.`
    : "Repaso semanal de precios en MercadoLibre.";
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>Repaso semanal de precios — ProductosVirales</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f8f6;font-family:${FONT};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:#f8f8f6;font-size:1px;line-height:1px;">${esc(preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8f8f6;">
    <tr><td align="center" style="padding:40px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #eeeeee;border-radius:20px;">
        <tr><td align="center" style="padding:34px 40px 6px;">
          <span style="font-family:${FONT};font-size:22px;font-weight:800;color:#111111;letter-spacing:-.03em;">productos<span style="background-color:#fce7f0;color:#e11d63;padding:3px 11px;border-radius:9999px;margin-left:4px;">virales</span></span>
        </td></tr>
        <tr><td align="left" style="padding:18px 40px 2px;">
          <h1 style="margin:0;font-family:${FONT};font-size:23px;font-weight:700;color:#111111;letter-spacing:-.02em;line-height:1.25;">Las bajas de precio de la semana</h1>
          <p style="margin:10px 0 4px;font-family:${FONT};font-size:15px;color:#666666;line-height:1.55;">Seguimos el precio real en MercadoLibre. Esto es lo que bajó de verdad en los últimos 7 días — el precio puede cambiar, confirmalo en el link.</p>
        </td></tr>
        <tr><td style="padding:6px 40px 0;">${shown.map((d, i) => productRow(d, cat, i === 0, i === shown.length - 1)).join("")}</td></tr>
      </table>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:26px 24px 8px;font-family:${FONT};font-size:13px;color:#737373;line-height:1.6;">
          <span style="color:#737373;">Ganamos una comisión si comprás por los links — no te cambia el precio.</span><br>
          <a href="${SITE_URL}/privacidad" style="color:#737373;text-decoration:underline;">Privacidad</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl(email)}" style="color:#737373;text-decoration:underline;">Cancelar suscripción</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function computeWeeklyDrops() {
  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  const drops = [];
  for (const [id, points] of Object.entries(history)) {
    const d = weeklyDrop(id, points);
    if (d) drops.push(d);
  }
  drops.sort((a, b) => a.pct - b.pct); // mayor baja primero
  return drops;
}

async function getSubscribers(sql) {
  const rows = await sql`
    SELECT email FROM subscribers
    WHERE source = 'newsletter' AND unsubscribed = false
  `;
  return rows.map((r) => r.email);
}

async function main() {
  if (process.argv.includes("--preview")) {
    const drops = computeWeeklyDrops().slice(0, MAX_ITEMS);
    const cat = catalogLookup(new Set(drops.map((d) => d.id.toUpperCase())));
    const out = path.resolve(".cache/digest-preview.html");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, emailHtml(drops.length > 0 ? drops : [], cat, "vos@ejemplo.com"));
    console.log(`[digest] preview -> ${out} (${drops.length} bajas reales encontradas)`);
    return;
  }

  const drops = computeWeeklyDrops();
  if (drops.length === 0) {
    console.log("[digest] sin bajas reales en los últimos 7 días — nada que mandar esta semana.");
    return;
  }
  const shown = drops.slice(0, MAX_ITEMS);
  const cat = catalogLookup(new Set(shown.map((d) => d.id.toUpperCase())));

  console.log(`[digest] bajas reales últimos ${LOOKBACK_DAYS} días: ${drops.length} | modo: ${SEND ? "ENVÍO" : "DRY-RUN"}`);
  shown.forEach((d) => {
    const title = (cat[d.id.toUpperCase()] || {}).title || d.id;
    console.log(`   -${Math.abs(d.pct)}%  ${title}  ${fmtPrice(d.stored)}→${fmtPrice(d.scraped)}`);
  });

  if (!SEND) {
    console.log("[digest] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }

  if (!process.env.RESEND_API_KEY) return void console.log("[digest] falta RESEND_API_KEY — no se envió.");
  if (!process.env.UNSUBSCRIBE_SECRET) return void console.log("[digest] falta UNSUBSCRIBE_SECRET — no se envió.");
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return void console.log("[digest] falta DATABASE_URL — no se envió.");

  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const emails = await getSubscribers(sql);
  if (emails.length === 0) return void console.log("[digest] no hay suscriptores 'newsletter' — nada que mandar.");

  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = emailHtml(shown, cat, "");
  const subj = subject(shown.map((d) => ({ ...d, title: (cat[d.id.toUpperCase()] || {}).title })));

  let sent = 0;
  for (const email of emails) {
    const idem =
      "wd-" +
      crypto
        .createHash("sha256")
        .update(email + "|" + new Date().toISOString().slice(0, 10) + "|" + shown.map((d) => d.id).join(","))
        .digest("hex")
        .slice(0, 24);
    try {
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: email,
          subject: subj,
          html: emailHtml(shown, cat, email),
          headers: {
            "List-Unsubscribe": `<${unsubUrl(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        { idempotencyKey: idem }
      );
      if (error) {
        console.error(`[digest] error a ${email}:`, error);
      } else {
        sent++;
      }
    } catch (e) {
      console.error(`[digest] excepción a ${email}:`, e.message);
    }
    await sleep(150);
  }
  console.log(`[digest] enviados: ${sent} | total suscriptores: ${emails.length}`);
}

main().catch((e) => {
  console.error("[digest] fallo:", e);
  process.exit(1);
});
