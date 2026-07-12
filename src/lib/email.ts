import "server-only";
import { Resend } from "resend";

/**
 * Envío de mails vía Resend. La API key vive en `RESEND_API_KEY` (env de Vercel);
 * el remitente en `EMAIL_FROM` (debe ser un dominio verificado en Resend, ej.
 * "ProductosVirales <ofertas@productosvirales.com.ar>").
 *
 * Si falta `RESEND_API_KEY` (ej. local, o antes de configurar Resend), `sendEmail`
 * no-opea y loguea — nada se rompe, igual que `getSql()` con la DB.
 */
let cached: Resend | null = null;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

const FROM =
  process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  /** Link de baja (List-Unsubscribe) — obligatorio para mails de marketing. */
  unsubscribeUrl?: string;
  replyTo?: string;
}

export async function sendEmail(
  input: SendEmailInput
): Promise<{ sent: boolean; error?: string }> {
  const resend = client();
  if (!resend) {
    console.warn(`[email] sin RESEND_API_KEY — no se envió: "${input.subject}"`);
    return { sent: false, error: "no-api-key" };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
      // Cabecera estándar para el botón "cancelar suscripción" del cliente de mail.
      headers: input.unsubscribeUrl
        ? { "List-Unsubscribe": `<${input.unsubscribeUrl}>` }
        : undefined,
    });
    if (error) return { sent: false, error: String(error) };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : String(e) };
  }
}
