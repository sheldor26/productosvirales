#!/usr/bin/env node
// Bootstrap de UNA SOLA VEZ para el Canal de WhatsApp: escanea el QR de
// login, guarda la sesión en Neon (scripts/lib/whatsapp-session-store.mjs)
// y resuelve el JID del canal a partir de su link de invitación.
//
// Uso:
//   set -a; source .env; set +a; node scripts/whatsapp-bootstrap.mjs
//
// Requiere DATABASE_URL y WHATSAPP_SESSION_KEY ya en el entorno (mismo
// criterio que scripts/publicar-threads.cjs: este script no carga .env
// solo). WHATSAPP_SESSION_KEY se genera con: openssl rand -base64 32
//
// Después de correr esto, guardá el JID que imprime como
// WHATSAPP_CHANNEL_JID en .env y en los secrets de GitHub.

import readline from "node:readline/promises";
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { cargarSesionWhatsapp } from "./lib/whatsapp-session-store.mjs";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta la variable de entorno ${name}.`);
    process.exit(1);
  }
  return value;
}

async function sqlClient() {
  requireEnv("DATABASE_URL");
  const { neon } = await import("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL);
}

async function preguntarInviteLink(rl) {
  const respuesta = await rl.question(
    "\nPegá el link de invitación del canal (Info del canal > Invitar a través de link): "
  );
  return respuesta.trim();
}

function extraerCodigoInvite(input) {
  const match = input.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)/);
  return match ? match[1] : input;
}

async function preguntarModo(rl) {
  const respuesta = await rl.question(
    "\n¿Vincular con QR o con código de 8 dígitos? Si el QR te vino fallando, probá el código (qr/codigo): "
  );
  return respuesta.trim().toLowerCase().startsWith("c") ? "codigo" : "qr";
}

async function preguntarNumero(rl) {
  const respuesta = await rl.question(
    "\nNúmero de WhatsApp con código de país, solo dígitos (ej: 549XXXXXXXXXX): "
  );
  return respuesta.trim().replace(/[^0-9]/g, "");
}

async function main() {
  requireEnv("WHATSAPP_SESSION_KEY");
  const sql = await sqlClient();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const modo = await preguntarModo(rl);
  const numero = modo === "codigo" ? await preguntarNumero(rl) : null;
  let pairingCodeSolicitado = false;

  // Baileys NO reconecta solo: si el socket se cierra por cualquier motivo
  // que no sea un logout explícito (típicamente porque el QR mostrado
  // expiró sin escanear, cada ~20-60s), hay que volver a armar el socket
  // a mano para que aparezca un QR nuevo. Por eso conectar() se llama a
  // sí misma en vez de ser un simple connect-and-wait.
  async function conectar() {
    const { state, saveCreds } = await cargarSesionWhatsapp(sql);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      browser: ["ProductosVirales", "Chrome", "1.0"],
      // Default de Baileys son 20s, muy poco para el primer login: hay que
      // abrir el teléfono, ir a Dispositivos vinculados y escanear a mano
      // antes de que se corte. 120s da margen real.
      connectTimeoutMs: 120_000,
    });

    sock.ev.on("creds.update", saveCreds);

    if (modo === "codigo" && !sock.authState.creds.registered && !pairingCodeSolicitado) {
      pairingCodeSolicitado = true;
      // Hay que esperar un toque a que el socket abra el WebSocket antes de
      // poder pedir el código, si no Baileys tira error de "not connected".
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(numero);
          console.log(`\n📱 Código de vinculación: ${code}`);
          console.log("En el teléfono: Ajustes > Dispositivos vinculados > Vincular con número de teléfono, y escribilo ahí.\n");
        } catch (err) {
          console.error("Error pidiendo el código:", err.message);
        }
      }, 3000);
    }

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && modo === "qr") {
        console.log("\nEscaneá este QR desde WhatsApp Business > Dispositivos vinculados:\n");
        qrcode.generate(qr, { small: true });
      }

      if (connection === "open") {
        console.log("\n✔ Sesión conectada y guardada en Neon.");
        const inviteInput = await preguntarInviteLink(rl);
        const codigo = extraerCodigoInvite(inviteInput);
        try {
          const meta = await sock.newsletterMetadata("invite", codigo);
          if (!meta) {
            console.error("No se encontró el canal con ese link. Revisá el link e intentá de nuevo.");
          } else {
            console.log(`\nCanal: ${meta.name}`);
            console.log(`Suscriptores: ${meta.subscribers}`);
            console.log(`\nWHATSAPP_CHANNEL_JID=${meta.id}\n`);
            console.log("Guardá esa línea en .env y como secret en GitHub.");
          }
        } catch (err) {
          console.error("Error resolviendo el canal:", err.message);
        }
        rl.close();
        await sock.end(undefined);
        process.exit(0);
      }

      if (connection === "close") {
        const motivo = lastDisconnect?.error?.output?.statusCode;
        console.log(
          `\nConexión cortada. statusCode=${motivo} mensaje=${lastDisconnect?.error?.message}`
        );
        if (motivo === DisconnectReason.loggedOut) {
          console.error("Sesión deslogueada desde el teléfono. Corré el bootstrap de nuevo.");
          rl.close();
          process.exit(1);
        }
        pairingCodeSolicitado = false;
        console.log(modo === "qr" ? "Generando un QR nuevo en 2s..." : "Reintentando en 2s...");
        setTimeout(() => conectar(), 2000);
      }
    });
  }

  await conectar();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
