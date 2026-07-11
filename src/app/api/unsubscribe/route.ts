import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

// Página de confirmación mínima (sin depender del layout de la app).
function shell(title: string, inner: string, status = 200): NextResponse {
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
  button,a.btn{display:inline-block;background:#1c1c1c;color:#fff;border:0;cursor:pointer;
    text-decoration:none;padding:11px 22px;border-radius:999px;font-weight:600;font-size:14px}
  a.link{display:inline-block;margin-top:14px;color:#999;font-size:13px}
</style></head><body><div class="card"><h1>${title}</h1>${inner}</div></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function invalid(): NextResponse {
  return shell(
    "Link inválido",
    `<p>Ese link de baja no es válido. Si querés dejar de recibir mails, respondé cualquiera de nuestros correos y te sacamos de la lista.</p>
     <a class="btn" href="https://productosvirales.com.ar">Volver al inicio</a>`,
    400
  );
}

function creds(request: Request): { email: string; token: string; valid: boolean } {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";
  return { email, token, valid: Boolean(email) && verifyUnsubscribeToken(email, token) };
}

// GET: solo muestra la confirmación. NO da de baja — los clientes de mail y
// escáneres suelen hacer prefetch/GET de los links, lo que daría bajas
// accidentales. La baja real se hace por POST (botón de confirmación abajo, y
// el one-click List-Unsubscribe-Post de Gmail/Outlook).
export async function GET(request: Request) {
  const { email, token, valid } = creds(request);
  if (!valid) return invalid();
  const action = `/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  return shell(
    "¿Cancelar tu suscripción?",
    `<p>Vas a dejar de recibir los mails de alertas de precio de ProductosVirales.</p>
     <form method="post" action="${action}"><button type="submit">Confirmar baja</button></form>
     <a class="link" href="https://productosvirales.com.ar">No, volver al inicio</a>`
  );
}

// POST: da de baja de verdad (form de confirmación o one-click de los clientes).
export async function POST(request: Request) {
  const { email, valid } = creds(request);
  if (!valid) return invalid();

  const sql = getSql();
  if (!sql) {
    return shell(
      "No pudimos procesarlo",
      `<p>Tuvimos un problema para darte de baja. Probá de nuevo en un rato.</p>
       <a class="btn" href="https://productosvirales.com.ar">Volver al inicio</a>`,
      503
    );
  }
  try {
    // Un UPDATE de 0 filas (email que no existe) igual es "éxito": no filtramos
    // si el email está o no en la lista (evita enumeración).
    await sql`UPDATE subscribers SET unsubscribed = true WHERE email = ${email}`;
  } catch (err) {
    console.error("[unsubscribe] error al dar de baja:", err);
    return shell(
      "No pudimos procesarlo",
      `<p>Tuvimos un problema para darte de baja. Probá de nuevo en un rato.</p>
       <a class="btn" href="https://productosvirales.com.ar">Volver al inicio</a>`,
      503
    );
  }

  return shell(
    "Listo, te diste de baja",
    `<p>No vas a recibir más mails de alertas de precio. Podés volver a suscribirte cuando quieras desde el sitio.</p>
     <a class="btn" href="https://productosvirales.com.ar">Volver al inicio</a>`
  );
}
