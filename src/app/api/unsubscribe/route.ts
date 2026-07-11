import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

// Página de confirmación mínima (sin depender del layout de la app).
function page(title: string, body: string, status = 200): NextResponse {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — ProductosVirales</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#faf9f7;color:#1c1c1c;
    display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;padding:24px}
  .card{max-width:420px;background:#fff;border:1px solid #eee;border-radius:16px;padding:32px;text-align:center;
    box-shadow:0 8px 28px -12px rgba(0,0,0,.15)}
  h1{font-size:20px;margin:0 0 8px}p{color:#555;line-height:1.5;margin:0 0 20px}
  a{display:inline-block;background:#1c1c1c;color:#fff;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:600;font-size:14px}
</style></head><body><div class="card"><h1>${title}</h1><p>${body}</p>
<a href="https://productosvirales.com.ar">Volver al inicio</a></div></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return page(
      "Link inválido",
      "Ese link de baja no es válido. Si querés dejar de recibir mails, respondé cualquiera de nuestros correos y te sacamos de la lista.",
      400
    );
  }

  const sql = getSql();
  if (sql) {
    try {
      await sql`UPDATE subscribers SET unsubscribed = true WHERE email = ${email}`;
    } catch (err) {
      console.error("[unsubscribe] error al dar de baja:", err);
      // No exponemos el error; igual mostramos éxito para no filtrar estado.
    }
  }

  return page(
    "Listo, te diste de baja",
    "No vas a recibir más mails de alertas de precio. Podés volver a suscribirte cuando quieras desde el sitio."
  );
}
