#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Manda por EMAIL (Resend) las bajas de precio de la última corrida de Bright
 * Data a los suscriptores con source='price-alert'. Corre como paso del workflow
 * update-prices-brightdata, DESPUÉS de apply-brightdata-prices (que escribe
 * .cache/pending-price-drops.json) — misma lógica que notify-price-drops-telegram.
 *
 * Decisión de producto (Juan, 2026-07-11): manda TODAS las bajas reales, en cada
 * corrida (3x/semana). Si no hay bajas o no hay suscriptores, no manda nada.
 *
 * DRY-RUN por defecto: imprime a cuántos y qué mandaría, sin enviar.
 * Con --send envía de verdad. Requiere en el env:
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

function fmtPrice(n) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
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
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// affiliateUrl + imagen por id, parseando el catálogo (.ts) — mismo enfoque que
// notify-price-drops-telegram.cjs.
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

function dropRowsHtml(drops, cat) {
  return drops
    .map((d) => {
      const c = cat[d.id.toUpperCase()] || {};
      const link = c.affiliateUrl || SITE_URL;
      const off = Math.abs(d.pct);
      return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee">
          <div style="font-weight:600;color:#1c1c1c;font-size:15px">${esc(d.title)}</div>
          <div style="margin-top:4px;color:#555;font-size:14px">
            <span style="text-decoration:line-through;color:#999">${fmtPrice(d.stored)}</span>
            &nbsp;<strong style="color:#16a34a">${fmtPrice(d.scraped)}</strong>
            &nbsp;<span style="background:#dcfce7;color:#166534;border-radius:6px;padding:2px 6px;font-size:12px;font-weight:700">-${off}%</span>
          </div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
          <a href="${esc(link)}" style="background:#ffe600;color:#111;text-decoration:none;padding:8px 14px;border-radius:999px;font-weight:700;font-size:13px">Ver oferta</a>
        </td>
      </tr>`;
    })
    .join("");
}

function emailHtml(drops, cat, email) {
  const n = drops.length;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#faf9f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:24px 20px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#f4805f;margin:0 0 4px">PRODUCTOS VIRALES</p>
      <h1 style="font-size:20px;color:#1c1c1c;margin:0 0 4px">Bajaron ${n} precio${n > 1 ? "s" : ""} 👀</h1>
      <p style="color:#555;font-size:14px;margin:0 0 16px">Estas son las bajas de precio que detectamos en MercadoLibre. El precio puede cambiar, confirmalo en el link.</p>
      <table style="width:100%;border-collapse:collapse">${dropRowsHtml(drops, cat)}</table>
      <p style="color:#999;font-size:12px;margin:20px 0 0;line-height:1.5">
        Ganamos una comisión si comprás por los links — no te cambia el precio.<br>
        <a href="${unsubUrl(email)}" style="color:#999">Cancelar suscripción</a>
      </p>
    </div>
  </div>
</body></html>`;
}

async function getSubscribers() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return { ok: false, emails: [], reason: "sin DATABASE_URL" };
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(url);
  const rows = await sql`
    SELECT email FROM subscribers
    WHERE source = 'price-alert' AND unsubscribed = false
  `;
  return { ok: true, emails: rows.map((r) => r.email) };
}

async function main() {
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

  const cat = catalogLookup(new Set(drops.map((d) => d.id.toUpperCase())));

  const subs = await getSubscribers();
  if (!subs.ok) {
    console.log(`[email] ${subs.reason} — dry-run igual. Bajas: ${drops.length}.`);
  }
  const emails = subs.emails;

  console.log(`[email] bajas: ${drops.length} | suscriptores price-alert: ${emails.length} | modo: ${SEND ? "ENVÍO" : "DRY-RUN"}`);
  drops.forEach((d) => console.log(`   -${Math.abs(d.pct)}%  ${d.title}  ${fmtPrice(d.stored)}→${fmtPrice(d.scraped)}`));

  if (!SEND) {
    console.log("[email] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] falta RESEND_API_KEY — no se envió.");
    return;
  }
  if (emails.length === 0) {
    console.log("[email] no hay suscriptores para enviar.");
    return;
  }

  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = `Bajaron ${drops.length} precio${drops.length > 1 ? "s" : ""} que te pueden interesar 👀`;

  let sent = 0;
  for (const email of emails) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject,
        html: emailHtml(drops, cat, email),
        headers: { "List-Unsubscribe": `<${unsubUrl(email)}>` },
      });
      if (error) console.error(`[email] error a ${email}:`, error);
      else sent++;
    } catch (e) {
      console.error(`[email] excepción a ${email}:`, e.message);
    }
  }
  console.log(`[email] enviados: ${sent}/${emails.length}`);
}

main().catch((e) => {
  console.error("[email] fallo:", e);
  process.exit(1);
});
