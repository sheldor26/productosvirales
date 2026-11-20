#!/usr/bin/env node

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
 * Diseño: template compartido en scripts/lib/email-brand.cjs (ver ese archivo
 * para el porqué del rediseño 2026-11-20 y la nota sobre autenticación de
 * dominio, que es lo que de verdad define si cae en Spam).
 *
 * DRY-RUN por defecto. Con --send envía. Requiere en el env:
 *   RESEND_API_KEY, EMAIL_FROM, DATABASE_URL, UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-price-drops-email.cjs            # dry-run
 *   node scripts/notify-price-drops-email.cjs --preview  # HTML de ejemplo local
 *   node scripts/notify-price-drops-email.cjs --send     # envía
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {
  esc,
  fmtPrice,
  truncateWords,
  productRow,
  renderShell,
  renderPlainText,
} = require("./lib/email-brand.cjs");

const DROPS_PATH = path.resolve(".cache/pending-price-drops.json");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const MAX_ITEMS = 6; // tope de productos por mail (foco + evita el "message clipped" de Gmail; el resto va al sitio)
const CTA_LABEL = "Ver precio actual"; // honesto (no promete oferta) y menos spammy que "Ver oferta"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  // Separa también las fichas `const nombre: Product = {...}` extraídas antes
  // del array (fix TS2590, ver tasks/lessons.md) — si no, quedan invisibles acá.
  const blocks = src.split(/\n(?:  \{|const \w+: Product = \{)\n/).slice(1);
  const map = {};
  for (const b of blocks) {
    const idm = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (!idm) continue;
    const id = idm[1].toUpperCase();
    if (!idSet.has(id)) continue;
    const aff = b.match(/affiliateUrl:\s*['"`]([^'"`]+)['"`]/);
    const img = b.match(/image:\s*['"`]([^'"`]+)['"`]/);
    const rat = b.match(/(?:^|\n)\s{4}rating:\s*([\d.]+)/); // rating a nivel producto (4 espacios)
    const rev = b.match(/(?:^|\n)\s{4}reviewCount:\s*(\d+)/);
    map[id] = {
      affiliateUrl: aff ? aff[1] : null,
      image: img ? img[1] : null,
      rating: rat ? Number(rat[1]) : null,
      reviewCount: rev ? Number(rev[1]) : null,
    };
  }
  return map;
}

// CTA de cada baja: link de afiliado si lo tenemos; si no, la ficha propia
// (que igual lleva el botón de afiliado). Nunca el home.
function offerLink(id, cat) {
  const c = cat[id.toUpperCase()] || {};
  return c.affiliateUrl || `${SITE_URL}/producto/${id.toLowerCase()}`;
}

function dateLabelEs(iso) {
  const d = iso ? new Date(iso + "T12:00:00") : new Date();
  try {
    return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  } catch (e) {
    return "";
  }
}

function dropRowsHtml(drops, cat) {
  return drops
    .map((d, i) =>
      productRow({
        title: d.title,
        href: offerLink(d.id, cat),
        image: (cat[d.id.toUpperCase()] || {}).image,
        rating: cat[d.id.toUpperCase()],
        stored: d.stored,
        scraped: d.scraped,
        pct: d.pct,
        isFirst: i === 0,
        isLast: i === drops.length - 1,
        heroLabel: "Mejor bajada de hoy",
        ctaLabel: CTA_LABEL,
      })
    )
    .join("");
}

// Asunto tipo ALERTA (no promo): sin "%", sin "oferta", sin emoji.
function subject(shown, totalFresh) {
  if (totalFresh > 1) return `Detectamos ${totalFresh} bajas de precio`;
  const top = shown[0];
  return top ? `Bajó de precio: ${truncateWords(top.title, 48)}` : "Nuevas bajas de precio";
}

function emailHtml(shown, cat, email, totalFresh, dateIso) {
  const top = shown[0];
  const dLabel = dateLabelEs(dateIso);
  const preheader = top
    ? `${truncateWords(top.title, 44)} quedó en ${fmtPrice(top.scraped)}. Los precios pueden cambiar.`
    : "Nuevas bajas de precio en MercadoLibre.";
  const moreCount = totalFresh - shown.length;
  const moreLineHtml =
    moreCount > 0
      ? `<tr><td align="center" style="padding:8px 40px 28px;"><a href="${SITE_URL}" class="muted" style="font-family:inherit;font-size:14px;color:#6B7280;text-decoration:underline;">Ver las ${moreCount} baja${moreCount > 1 ? "s" : ""} restantes</a></td></tr>`
      : null;
  return renderShell({
    title: `Encontramos ${totalFresh} baja${totalFresh > 1 ? "s" : ""} de precio`,
    kicker: dLabel || null,
    intro: "Recibís esta alerta porque pediste seguir bajas de precio. Estas bajaron hoy en MercadoLibre — el precio puede cambiar, confirmalo en el link.",
    trustLine: "Precios tomados de MercadoLibre hoy",
    rowsHtml: dropRowsHtml(shown, cat),
    moreLineHtml,
    preheader,
    siteUrl: SITE_URL,
    email,
    unsubUrl: unsubUrl(email),
  });
}

function emailText(shown, cat, totalFresh, email) {
  return renderPlainText({
    title: `Encontramos ${totalFresh} baja${totalFresh > 1 ? "s" : ""} de precio`,
    introText: "Recibís esta alerta porque pediste seguir bajas de precio en productosvirales.com.ar. El precio puede cambiar, confirmalo en el link antes de comprar.",
    items: shown.map((d) => ({ title: d.title, href: offerLink(d.id, cat), stored: d.stored, scraped: d.scraped, pct: d.pct })),
    siteUrl: SITE_URL,
    unsubUrl: unsubUrl(email),
    moreCount: totalFresh - shown.length,
  });
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
    const blocks = src.split(/\n(?:  \{|const \w+: Product = \{)\n/).slice(1);
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
    const cat = catalogLookup(new Set(sample.map((s) => s.id.toUpperCase())));
    const out = path.resolve(".cache/email-preview.html");
    const outTxt = path.resolve(".cache/email-preview.txt");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, emailHtml(sample, cat, "vos@ejemplo.com", 15, new Date().toISOString().slice(0, 10)));
    fs.writeFileSync(outTxt, emailText(sample, cat, 15, "vos@ejemplo.com"));
    console.log("[email] preview -> " + out + " (y " + outTxt + ")");
    return;
  }

  if (!fs.existsSync(DROPS_PATH)) {
    console.log("[email] no hay pending-price-drops.json — nada que mandar.");
    return;
  }
  const parsed = JSON.parse(fs.readFileSync(DROPS_PATH, "utf8"));
  const runDate = parsed.date || null;
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
          html: emailHtml(shown, cat, email, fresh.length, runDate),
          text: emailText(shown, cat, fresh.length, email),
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
