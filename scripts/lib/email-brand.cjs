/**
 * Template de marca compartido por los mails automáticos de ofertas@productosvirales.com.ar
 * (notify-price-drops-email.cjs y notify-weekly-digest.cjs). Antes cada script tenía su
 * propia copia del HTML, duplicada y ya desincronizada (el digest semanal no tenía soporte
 * de dark mode). Se unifica acá para que el diseño se mantenga en un solo lugar.
 *
 * Rediseño 2026-11-20 (pedido de Juan: más estético/moderno + más confiable, porque el mail
 * cae en la carpeta de Spam real de Gmail, no en Promociones). Dos frentes distintos:
 *  - Caer en Spam real se arregla sobre todo con autenticación del dominio (SPF/DKIM/DMARC
 *    verificados en Resend) y reputación de envío — nada de esto lo arregla el HTML. Ver
 *    aviso en docs/seo-tracking-optimizaciones.md o preguntarle a Claude si hace falta repetir
 *    los pasos para revisarlo en el dashboard de Resend.
 *  - Lo que SÍ se arregla con código: pasar explícitamente una versión en texto plano
 *    (multipart) en vez de confiar en lo que genere o no el proveedor, y una pasada de
 *    diseño/legibilidad. (Resend anunció generación automática de texto plano el 21/08/2025
 *    para Broadcasts, con Transactional/Batch "planeado" — no confirmado como ya enviado para
 *    `emails.send` individual, que es lo que usan estos 2 scripts. Controlar el texto a mano,
 *    con nuestro propio disclaimer y links reales, es mejor en cualquier caso.)
 *
 * Pasada de revisión (trío Codex+Gemini+Grok, 2026-11-20): GO con cambios — contraste de
 * varios textos secundarios por debajo de 4.5:1, fallback sólido para el degradé en Outlook,
 * el badge "virales" sin variante dark, y la franja de confianza en verde sonando a "cupón
 * de descuento barato" para 2 de los 3 auditores. Todo corregido en esta versión.
 */

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const BRAND = "#E11D63";
const BRAND_TEXT = "#AD1457"; // rosa más oscuro, para texto sobre fondo rosa claro (el BRAND normal da 3.9:1, insuficiente)
const INK = "#15131A"; // negro con un toque cálido, más premium que #000/#111 plano
const MUTED = "#6B7280"; // único gris secundario del template — 4.8:1 sobre blanco, cumple AA en todos lados donde se usa

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function fmtPrice(n) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

function truncateWords(s, max) {
  if (!s || s.length <= max) return s || "";
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 20 ? cut.slice(0, sp) : cut).trim() + "…";
}

// Botón pill "bulletproof": VML para Outlook, <a> con bgcolor para el resto.
function offerButton(link, label) {
  const href = esc(link);
  return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="left">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:42px;v-text-anchor:middle;width:176px;" arcsize="50%" strokecolor="${BRAND}" fillcolor="${BRAND}">
                  <w:anchorlock/><center style="color:#ffffff;font-family:${FONT};font-size:14px;font-weight:bold;">${label}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${href}" target="_blank" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-family:${FONT};font-size:14px;font-weight:600;line-height:42px;padding:0 26px;border-radius:9999px;box-shadow:0 2px 6px rgba(225,29,99,.28);">${label}</a>
                <!--<![endif]-->
              </td></tr></table>`;
}

function ratingHtml(c) {
  if (!c || !c.rating) return "";
  const rev = c.reviewCount ? ` <span class="muted" style="color:${MUTED};">(${c.reviewCount.toLocaleString("es-AR")})</span>` : "";
  return `<div class="muted" style="font-family:${FONT};font-size:13px;color:${MUTED};margin-top:4px;">&#9733; ${c.rating.toFixed(1)}${rev}</div>`;
}

/**
 * Fila de producto. `heroLabel` es el texto del badge de la primera fila
 * ("Mejor bajada de hoy" en alertas puntuales, "La baja más grande de la semana"
 * en el digest) — null/omitido para no mostrar badge.
 */
function productRow({ title, href, image, rating, stored, scraped, pct, isFirst, isLast, heroLabel, ctaLabel }) {
  const off = Math.abs(pct);
  // La foto no lleva link propio (antes sí) — baja la densidad de links por fila de 3 a 2
  // (título + CTA), señalado por Grok como un factor real de heurística antispam.
  const thumb = image
    ? `<img src="${esc(image)}" width="76" height="76" alt="${esc(title)}" style="display:block;width:76px;height:76px;border-radius:14px;border:1px solid rgba(17,17,17,.08);background-color:#f4f4f2;" />`
    : `<div style="width:76px;height:76px;border-radius:14px;background-color:#f4f4f2;border:1px solid rgba(17,17,17,.08);"></div>`;
  return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="row" style="${isLast ? "" : "border-bottom:1px solid rgba(17,17,17,.07);"}">
          <tr>
            <td width="76" valign="top" style="padding:24px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="76" height="76" bgcolor="#f4f4f2" style="background-color:#f4f4f2;border-radius:14px;">${thumb}</td></tr></table>
            </td>
            <td valign="top" style="padding:24px 0 24px 18px;">
              ${isFirst && heroLabel ? `<div class="hero-label" style="font-family:${FONT};font-size:11px;font-weight:700;color:${BRAND};letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">${esc(heroLabel)}</div>` : ""}
              <a href="${esc(href)}" target="_blank" class="text-main" style="font-family:${FONT};font-size:16px;font-weight:600;color:${INK};line-height:1.35;text-decoration:none;">${esc(title)}</a>
              ${ratingHtml(rating)}
              <div class="text-main" style="font-family:${FONT};font-size:15px;color:${INK};margin:10px 0 16px;">
                <span class="muted" style="text-decoration:line-through;color:${MUTED};">${fmtPrice(stored)}</span>
                &nbsp;<strong style="font-size:19px;letter-spacing:-.01em;">${fmtPrice(scraped)}</strong>
                &nbsp;<span class="chip" style="background-color:#FCE7F0;color:${BRAND_TEXT};font-size:12px;font-weight:700;padding:3px 9px;border-radius:10px;white-space:nowrap;">-${off}%</span>
              </div>${offerButton(href, ctaLabel || "Ver precio actual")}
            </td>
          </tr>
        </table>`;
}

/**
 * Arma el documento HTML completo. `kicker` es el renglón chico arriba del
 * título (ej. la fecha, o null para omitirlo). `trustLine` es la barrita de
 * confianza entre la intro y la lista de productos (string ya armado, o null).
 */
function renderShell({ title, kicker, intro, rowsHtml, moreLineHtml, preheader, siteUrl, email, unsubUrl, trustLine }) {
  // Reglas de dark mode duplicadas bajo @media (prefers-color-scheme) y bajo [data-ogsc]
  // (atributo que inyecta Gmail cuando fuerza su propio dark mode e ignora el media query —
  // hallazgo de Grok, no lo tenían ni Codex ni Gemini).
  const darkRules = `
    .body-bg{background-color:#0c0c13!important;}
    .card{background-color:#17151e!important;border-color:rgba(255,255,255,.09)!important;box-shadow:none!important;}
    .text-main{color:#ECECEF!important;}
    .muted{color:#9a9aa5!important;}
    .row{border-color:rgba(255,255,255,.09)!important;}
    .chip{background-color:#3a1830!important;color:#ff8ab8!important;}
    .hero-label{color:#ff8ab8!important;}
  `;
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(title)} — ProductosVirales</title>
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
  [data-ogsc] .chip{background-color:#3a1830!important;color:#ff8ab8!important;}
  [data-ogsc] .hero-label{color:#ff8ab8!important;}
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
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container card" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid rgba(17,17,17,.07);border-radius:24px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 10px 28px -6px rgba(16,24,40,.08);">
        <tr><td bgcolor="${BRAND}" style="padding:5px 0 0;border-radius:24px 24px 0 0;background-color:${BRAND};background-image:linear-gradient(90deg,${BRAND},#ff7aa8);line-height:5px;font-size:0;">&nbsp;</td></tr>
        <tr><td align="center" class="px" style="padding:30px 40px 4px;">
          ${kicker ? `<div class="muted" style="font-family:${FONT};font-size:11px;font-weight:700;color:#9b9ba3;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;">${esc(kicker)}</div>` : ""}
          <a href="${siteUrl}" target="_blank" style="text-decoration:none;"><span class="text-main" style="font-family:${FONT};font-size:21px;font-weight:800;color:${INK};letter-spacing:-.03em;">productos<span class="chip" style="background-color:#FCE7F0;color:${BRAND_TEXT};padding:3px 11px;border-radius:9999px;margin-left:4px;">virales</span></span></a>
        </td></tr>
        <tr><td align="left" class="px" style="padding:20px 40px 0;">
          <h1 class="text-main" style="margin:0;font-family:${FONT};font-size:24px;font-weight:700;color:${INK};letter-spacing:-.02em;line-height:1.25;">${esc(title)}</h1>
          <p class="muted" style="margin:10px 0 0;font-family:${FONT};font-size:15px;color:${MUTED};line-height:1.6;">${intro}</p>
          ${trustLine ? `<p class="muted" style="margin:10px 0 0;font-family:${FONT};font-size:12.5px;color:${MUTED};">&#10003;&nbsp;${esc(trustLine)}</p>` : ""}
        </td></tr>
        <tr><td class="px" style="padding:14px 40px 0;">${rowsHtml}</td></tr>
        ${moreLineHtml || `<tr><td style="padding:0 0 8px;"></td></tr>`}
      </table>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width:100%;max-width:600px;">
        <tr><td align="center" class="px" style="padding:24px 24px 6px;font-family:${FONT};font-size:12.5px;color:${MUTED};line-height:1.7;">
          <span class="muted" style="color:${MUTED};">productosvirales.com.ar &middot; Ganamos una comisión si comprás por los links, no te cambia el precio.</span><br>
          <a href="${siteUrl}/privacidad" class="muted" style="color:${MUTED};text-decoration:underline;">Privacidad</a>
          &nbsp;&middot;&nbsp;
          <a href="${unsubUrl}" class="muted" style="color:${MUTED};text-decoration:underline;">Cancelar suscripción</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Versión en texto plano (multipart), para no depender de lo que genere o no el proveedor.
 * `moreCount` es cuántos productos más hay además de los listados en `items` (la versión
 * HTML tiene un link "Ver las N bajas restantes" que el texto plano también necesita).
 */
function renderPlainText({ title, introText, items, siteUrl, unsubUrl, moreCount }) {
  const lines = [title, "", introText, ""];
  for (const it of items) {
    lines.push(`- ${it.title}`);
    lines.push(`  ${fmtPrice(it.stored)} -> ${fmtPrice(it.scraped)} (-${Math.abs(it.pct)}%)`);
    lines.push(`  ${it.href}`);
    lines.push("");
  }
  if (moreCount > 0) {
    lines.push(`Ver las ${moreCount} baja${moreCount > 1 ? "s" : ""} restantes: ${siteUrl}`);
    lines.push("");
  }
  lines.push(`Ganamos una comisión si comprás por los links, no te cambia el precio.`);
  lines.push(`Privacidad: ${siteUrl}/privacidad`);
  lines.push(`Cancelar suscripción: ${unsubUrl}`);
  return lines.join("\n");
}

module.exports = {
  FONT,
  BRAND,
  INK,
  MUTED,
  esc,
  fmtPrice,
  truncateWords,
  offerButton,
  ratingHtml,
  productRow,
  renderShell,
  renderPlainText,
};
