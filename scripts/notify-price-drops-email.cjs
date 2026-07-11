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

function dropRowsHtml(drops, cat) {
  return drops
    .map((d) => {
      const c = cat[d.id.toUpperCase()] || {};
      const link = offerLink(d.id, cat);
      const off = Math.abs(d.pct);
      const thumb = c.image
        ? `<img src="${esc(c.image)}" width="56" height="56" alt="" style="width:56px;height:56px;object-fit:contain;border-radius:8px;background:#f4f4f2;border:1px solid #eee">`
        : "";
      return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;width:56px">${thumb}</td>
        <td style="padding:12px 10px;border-bottom:1px solid #eee">
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

function subject(shown, totalFresh) {
  const top = shown[0];
  const off = top ? Math.abs(top.pct) : 0;
  const rest = totalFresh - 1;
  if (top && rest > 0) return `🔥 -${off}% en ${top.title.slice(0, 40)} y ${rest} baja${rest > 1 ? "s" : ""} más`;
  if (top) return `🔥 Bajó de precio: ${top.title.slice(0, 50)}`;
  return "Bajas de precio en ProductosVirales";
}

function emailHtml(shown, cat, email, totalFresh) {
  const top = shown[0];
  const preheader = top
    ? `${top.title.slice(0, 50)} bajó ${Math.abs(top.pct)}% — y ${Math.max(0, totalFresh - 1)} más.`
    : "Nuevas bajas de precio.";
  const moreCount = totalFresh - shown.length;
  const moreLine =
    moreCount > 0
      ? `<p style="text-align:center;margin:8px 0 0"><a href="${SITE_URL}" style="color:#3483fa;font-size:13px">Y ${moreCount} baja${moreCount > 1 ? "s" : ""} más en el sitio →</a></p>`
      : "";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#faf9f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:24px 20px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#f4805f;margin:0 0 4px">PRODUCTOS VIRALES</p>
      <h1 style="font-size:20px;color:#1c1c1c;margin:0 0 4px">Encontramos ${totalFresh} baja${totalFresh > 1 ? "s" : ""} de precio 👀</h1>
      <p style="color:#555;font-size:14px;margin:0 0 16px">Estas son las bajas que detectamos hoy en MercadoLibre. El precio puede cambiar, confirmalo en el link.</p>
      <table style="width:100%;border-collapse:collapse">${dropRowsHtml(shown, cat)}</table>
      ${moreLine}
      <p style="color:#999;font-size:12px;margin:20px 0 0;line-height:1.6">
        Ganamos una comisión si comprás por los links — no te cambia el precio.<br>
        Recibís esto porque pediste alertas de precio en productosvirales.com.ar ·
        <a href="${SITE_URL}/privacidad" style="color:#999">Privacidad</a> ·
        <a href="${unsubUrl(email)}" style="color:#999">Cancelar suscripción</a>
      </p>
    </div>
  </div>
</body></html>`;
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
