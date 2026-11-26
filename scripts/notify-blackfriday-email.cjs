#!/usr/bin/env node

/**
 * Mail puntual de Black Friday (27/11/2026) con 8 productos verificados A MANO
 * (precio y stock confirmados en MercadoLibre el 26/11/2026, no solo el dato del
 * catálogo) en su mínimo histórico real. No es uno de los mails automáticos
 * recurrentes (price-alert / weekly-digest) — es un envío único, a toda la
 * lista (newsletter + price-alert, deduplicada por email).
 *
 * Por qué hay una lista hardcodeada de productos en vez de calcularla: el
 * criterio "mínimo histórico" sobre price-history.json dio 23 candidatas, pero
 * la verificación manual (MercadoLibre real, 26/11/2026) encontró que 10 de
 * esas 23 tenían el precio del catálogo desactualizado (hasta 41% por debajo
 * del precio real de hoy) — confirmado también contra el link de afiliado real,
 * no solo el permalink genérico. Los primeros 6 de abajo son los que SÍ
 * coincidieron de esa tanda. Se sumaron después 2 más (ventilador y freidora,
 * pedido de Juan para aprovechar el verano), verificados a mano con el mismo
 * criterio pero fuera del lote original de 23 candidatas automáticas.
 * Ver docs/seo-tracking-optimizaciones.md para el detalle completo.
 *
 * Diseño: tema Black Friday (franja negra + dorado) en vez del rosa de marca
 * de los mails recurrentes — es un envío especial, no reemplaza el template
 * de scripts/lib/email-brand.cjs (ese sigue intacto para price-drops y digest).
 * Reutiliza de ahí solo los helpers neutros (esc, fmtPrice, truncateWords,
 * productRow, renderPlainText).
 *
 * DRY-RUN por defecto. Con --send envía. Con --preview escribe un HTML de
 * ejemplo a .cache/blackfriday-preview.html sin tocar la base ni enviar nada.
 * Requiere en el env: RESEND_API_KEY, EMAIL_FROM, DATABASE_URL,
 * UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-blackfriday-email.cjs                       # dry-run
 *   node scripts/notify-blackfriday-email.cjs --preview              # HTML de ejemplo local
 *   node scripts/notify-blackfriday-email.cjs --send --to=vos@x.com  # prueba: 1 solo mail, no toca la base
 *   node scripts/notify-blackfriday-email.cjs --send                 # envío real a toda la lista
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { esc, fmtPrice, truncateWords, productRow, renderPlainText } = require("./lib/email-brand.cjs");

const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const TEST_TO = (() => {
  const arg = process.argv.find((a) => a.startsWith("--to="));
  return arg ? arg.slice(5).trim() : null;
})();

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const INK = "#15131A";
const MUTED = "#6B7280";
const GOLD_TEXT = "#8A6414"; // dorado apagado, variante oscura para texto sobre fondo claro (contraste AA)

// Verificados a mano en MercadoLibre el 26/11/2026 (precio Y stock reales, no
// solo el dato del catálogo). `stored`/`scraped` son el precio tachado y el
// precio actual que muestra la propia ficha hoy.
const PRODUCTS = [
  {
    id: "MLA37360592",
    title: "iRobot Roomba J7 Color Negro",
    href: "https://meli.la/1kHDG1G",
    image: "https://http2.mlstatic.com/D_NQ_NP_895799-MLA99463646864_112025-F.jpg",
    rating: 4.7,
    reviewCount: 110,
    stored: 1050000,
    scraped: 872030,
  },
  {
    id: "MLA18651915",
    title: "Auriculares Gamer Inalámbricos Logitech G G435, para PC y Consolas",
    href: "https://meli.la/1X17nvS",
    image: "https://http2.mlstatic.com/D_NQ_NP_705021-MLA99555662590_122025-F.jpg",
    rating: 4.7,
    reviewCount: 11070,
    stored: 226699,
    scraped: 143167,
  },
  {
    id: "MLA57658338",
    title: "Monitor Gamer 34 Gigabyte Curvo Wide WQHD 120Hz 1ms GS34WQCA",
    href: "https://meli.la/1po7w8y",
    image: "https://http2.mlstatic.com/D_NQ_NP_699006-MLA99442569860_112025-F.jpg",
    rating: 4.9,
    reviewCount: 8, // publicación nueva (reemplazo de stock del 2026-11-08): 8 opiniones reales, no las 248 de la vieja descontinuada
    stored: 999999,
    scraped: 761449,
  },
  {
    id: "MLA28261746",
    title: "Kit Alarma Hogar TRCB Inalámbrico 4 Sensores WiFi y Sirena Externa",
    href: "https://meli.la/2tv7arA",
    image: "https://http2.mlstatic.com/D_Q_NP_744521-MLA99387109980_112025-F.webp",
    rating: 4.6,
    reviewCount: 945,
    stored: 339900,
    scraped: 238104,
  },
  {
    id: "MLAU156843560",
    title: "Lampara Luna Velador LED Táctil Recargable USB Moonlamp",
    href: "https://meli.la/24XwvhU",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_647472-MLA100692957058_122025-F.webp",
    rating: 4.7,
    reviewCount: 805,
    stored: 40997,
    scraped: 32797,
  },
  {
    id: "MLAU3800115477",
    title: "Kit x4 Perfumes Tubito Fragancias Árabes x 35ml para Hombre",
    href: "https://meli.la/2AWZpVQ",
    image: "https://http2.mlstatic.com/D_NQ_NP_806897-MLA110509775595_042026-O.webp",
    rating: 4.6,
    reviewCount: 305,
    stored: 17999,
    scraped: 12999,
  },
  {
    id: "MLA41701462",
    title: "Ventilador Liliana VP20K 3 en 1 De Pie / Turbo / Pared, 3 Aspas Metálicas",
    href: "https://meli.la/2WpWhbB",
    image: "https://http2.mlstatic.com/D_Q_NP_732691-MLA100068608409_122025-F.webp",
    rating: 4.7,
    reviewCount: 4758,
    stored: 151999,
    scraped: 90581,
  },
  {
    id: "MLA36816568",
    title: "Freidora de Aire Gadnic Cuk AIRCRISP 17 Litros, Formato Horno",
    href: "https://meli.la/2uZdzVJ",
    image: "https://http2.mlstatic.com/D_NQ_NP_809249-MLA99542110648_122025-O.webp",
    rating: 4.8,
    reviewCount: 2504,
    stored: 230999,
    scraped: 187649,
  },
];

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

function subject() {
  return "Black Friday: 8 precios que verificamos a mano, mínimos históricos reales";
}

function dropRowsHtml() {
  return PRODUCTS.map((p, i) => {
    const pct = Math.round(((p.scraped - p.stored) / p.stored) * 100);
    return productRow({
      title: p.title,
      href: p.href,
      image: p.image,
      rating: p,
      stored: p.stored,
      scraped: p.scraped,
      pct,
      isFirst: i === 0,
      isLast: i === PRODUCTS.length - 1,
      heroLabel: i === 0 ? "Mínimo histórico registrado" : null,
      ctaLabel: "Ver precio actual",
    });
  }).join("");
}

const BANNER_URL = `${SITE_URL}/images/email/blackfriday-2026-banner.jpg`;
const BANNER_ALT = "BLACK FRIDAY — Mínimos históricos verificados a mano. Precio y stock confirmados el 26/11 en MercadoLibre.";

function emailHtml(email) {
  const top = PRODUCTS[0];
  const preheader = `Verificamos precio y stock a mano en MercadoLibre el 26/11. ${truncateWords(top.title, 40)} y 7 más en su mínimo histórico real.`;
  const rowsHtml = dropRowsHtml();

  // Reglas de dark mode: mismo patrón que email-brand.cjs (media query +
  // [data-ogsc] para Gmail forzando dark mode), adaptadas a la franja negra/
  // dorada de este envío puntual.
  const darkRules = `
    .body-bg{background-color:#0c0c13!important;}
    .card{background-color:#17151e!important;border-color:rgba(255,255,255,.09)!important;box-shadow:none!important;}
    .text-main{color:#ECECEF!important;}
    .muted{color:#9a9aa5!important;}
    .row{border-color:rgba(255,255,255,.09)!important;}
    .chip{background-color:#3a2c0f!important;color:#f0c75e!important;}
    .hero-label{color:#f0c75e!important;}
    .trust-chip{background-color:#201c12!important;color:#f0c75e!important;border-color:rgba(240,199,94,.35)!important;}
  `;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>Black Friday — productosvirales</title>
<style>
  :root{color-scheme:light dark;supported-color-schemes:light dark;}
  body{margin:0;padding:0;width:100%!important;-webkit-font-smoothing:antialiased;}
  a{text-decoration:none;}
  @media (prefers-color-scheme: dark){ ${darkRules} }
  [data-ogsc] .body-bg,[data-ogsb] .body-bg{background-color:#0c0c13!important;}
  [data-ogsc] .card,[data-ogsb] .card{background-color:#17151e!important;border-color:rgba(255,255,255,.09)!important;box-shadow:none!important;}
  [data-ogsc] .text-main{color:#ECECEF!important;}
  [data-ogsc] .muted{color:#9a9aa5!important;}
  [data-ogsc] .row{border-color:rgba(255,255,255,.09)!important;}
  [data-ogsc] .chip,[data-ogsb] .chip{background-color:#3a2c0f!important;color:#f0c75e!important;}
  [data-ogsc] .hero-label{color:#f0c75e!important;}
  [data-ogsc] .trust-chip,[data-ogsb] .trust-chip{background-color:#201c12!important;color:#f0c75e!important;border-color:rgba(240,199,94,.35)!important;}
  @media screen and (max-width:620px){
    .container{width:100%!important;}
    .px{padding-left:24px!important;padding-right:24px!important;}
  }
</style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#F7F7F5;font-family:${FONT};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:#F7F7F5;font-size:1px;line-height:1px;">${esc(preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="body-bg" style="background-color:#F7F7F5;">
    <tr><td align="center" style="padding:36px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container card" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid rgba(17,17,17,.07);border-radius:24px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 10px 28px -6px rgba(16,24,40,.08);overflow:hidden;">

        <!-- Banner ilustrado Black Friday (generado para este envío) -->
        <tr><td style="line-height:0;font-size:0;">
          <a href="${SITE_URL}" target="_blank"><img src="${BANNER_URL}" width="600" alt="${esc(BANNER_ALT)}" class="text-main" style="display:block;width:100%;max-width:600px;height:auto;border-radius:24px 24px 0 0;font-family:${FONT};font-size:15px;line-height:1.5;color:${INK};" /></a>
        </td></tr>

        <tr><td align="center" class="px" style="padding:20px 40px 0;">
          <a href="${SITE_URL}" target="_blank" class="text-main" style="font-family:${FONT};font-size:19px;font-weight:800;color:${INK};letter-spacing:-.02em;">productos<span class="chip" style="background-color:#FCE7F0;color:#AD1457;padding:3px 11px;border-radius:9999px;margin-left:2px;font-size:15px;">virales</span></a>
        </td></tr>
        <tr><td align="left" class="px" style="padding:14px 40px 0;">
          <h1 class="text-main" style="margin:0;font-family:${FONT};font-size:22px;font-weight:700;color:${INK};letter-spacing:-.02em;line-height:1.3;">8 precios que verificamos a mano para el Black Friday</h1>
          <p class="muted" style="margin:10px 0 0;font-family:${FONT};font-size:15px;color:${MUTED};line-height:1.6;">No confiamos en el feed de ofertas de nadie: antes de mandarte esto, entramos a cada ficha de MercadoLibre el 26/11 y confirmamos precio y stock a mano. Los 8 de abajo están en su precio más bajo registrado.</p>
          <div class="trust-chip" style="display:inline-block;margin-top:14px;background-color:#FCE7F0;color:${GOLD_TEXT};border:1px solid rgba(201,151,43,.35);font-family:${FONT};font-size:12px;font-weight:700;padding:6px 14px;border-radius:9999px;">&#10003;&nbsp;Precio y stock verificados a mano el 26/11</div>
        </td></tr>

        <tr><td class="px" style="padding:20px 40px 0;">${rowsHtml}</td></tr>
        <tr><td style="padding:4px 0 8px;"></td></tr>
      </table>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width:100%;max-width:600px;">
        <tr><td align="center" class="px" style="padding:24px 24px 6px;font-family:${FONT};font-size:12.5px;color:${MUTED};line-height:1.7;">
          <span class="muted" style="color:${MUTED};">productosvirales.com.ar &middot; Ganamos una comisión si comprás por los links, no te cambia el precio. Los precios pueden cambiar en MercadoLibre, confirmalos antes de pagar.</span><br>
          <a href="${SITE_URL}/privacidad" class="muted" style="color:${MUTED};text-decoration:underline;">Privacidad</a>
          &nbsp;&middot;&nbsp;
          <a href="${unsubUrl(email)}" class="muted" style="color:${MUTED};text-decoration:underline;">Cancelar suscripción</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function emailText(email) {
  return renderPlainText({
    title: "Black Friday: 8 precios que verificamos a mano",
    introText:
      "No confiamos en el feed de ofertas de nadie: antes de mandarte esto entramos a cada ficha de MercadoLibre el 26/11 y confirmamos precio y stock a mano. Los 8 de abajo están en su precio más bajo registrado. Los precios pueden cambiar, confirmalos antes de pagar.",
    items: PRODUCTS.map((p) => ({
      title: p.title,
      href: p.href,
      stored: p.stored,
      scraped: p.scraped,
      pct: Math.round(((p.scraped - p.stored) / p.stored) * 100),
    })),
    siteUrl: SITE_URL,
    unsubUrl: unsubUrl(email),
    moreCount: 0,
  });
}

async function getSubscribers(sql) {
  // Toda la lista (newsletter + price-alert), deduplicada — es un envío
  // puntual de Black Friday, no uno de los automáticos segmentados por canal.
  const rows = await sql`
    SELECT DISTINCT email FROM subscribers
    WHERE source IN ('newsletter', 'price-alert') AND unsubscribed = false
  `;
  return rows.map((r) => r.email);
}

async function main() {
  if (process.argv.includes("--preview")) {
    const out = path.resolve(".cache/blackfriday-preview.html");
    const outTxt = path.resolve(".cache/blackfriday-preview.txt");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, emailHtml("vos@ejemplo.com"));
    fs.writeFileSync(outTxt, emailText("vos@ejemplo.com"));
    console.log(`[blackfriday] preview -> ${out} (y ${outTxt})`);
    return;
  }

  console.log(`[blackfriday] ${PRODUCTS.length} productos | modo: ${SEND ? "ENVÍO" : "DRY-RUN"}`);
  PRODUCTS.forEach((p) => {
    const pct = Math.round(((p.scraped - p.stored) / p.stored) * 100);
    console.log(`   ${pct}%  ${p.title}  ${fmtPrice(p.stored)}→${fmtPrice(p.scraped)}`);
  });

  if (!SEND) {
    console.log("[blackfriday] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }

  if (!process.env.RESEND_API_KEY) return void console.log("[blackfriday] falta RESEND_API_KEY — no se envió.");
  if (!process.env.UNSUBSCRIBE_SECRET) return void console.log("[blackfriday] falta UNSUBSCRIBE_SECRET — no se envió.");

  let emails;
  if (TEST_TO) {
    // Modo prueba: un solo destinatario, no toca la base de suscriptores.
    emails = [TEST_TO];
    console.log(`[blackfriday] MODO PRUEBA: enviando solo a ${TEST_TO}, no se consulta la base de suscriptores.`);
  } else {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) return void console.log("[blackfriday] falta DATABASE_URL — no se envió.");
    const { neon } = require("@neondatabase/serverless");
    const sql = neon(dbUrl);
    emails = await getSubscribers(sql);
    if (emails.length === 0) return void console.log("[blackfriday] no hay suscriptores — nada que mandar.");
  }

  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subj = subject();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let sent = 0;
  for (const email of emails) {
    // En modo prueba (--to=) la key suma un timestamp: así cada reenvío de
    // prueba (contenido distinto) no choca con la idempotencia de Resend.
    const idem = TEST_TO
      ? "bf26-test-" + crypto.createHash("sha256").update(email + Date.now()).digest("hex").slice(0, 16)
      : "bf26-" + crypto.createHash("sha256").update(email).digest("hex").slice(0, 24);
    try {
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: email,
          subject: subj,
          html: emailHtml(email),
          text: emailText(email),
          headers: {
            "List-Unsubscribe": `<${unsubUrl(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        { idempotencyKey: idem }
      );
      if (error) {
        console.error(`[blackfriday] error a ${email}:`, error);
      } else {
        sent++;
      }
    } catch (e) {
      console.error(`[blackfriday] excepción a ${email}:`, e.message);
    }
    await sleep(150);
  }
  console.log(`[blackfriday] enviados: ${sent} | total suscriptores: ${emails.length}`);
}

main().catch((e) => {
  console.error("[blackfriday] fallo:", e);
  process.exit(1);
});
