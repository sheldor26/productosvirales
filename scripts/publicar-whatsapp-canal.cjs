#!/usr/bin/env node
// Publica un post (texto solo, o imagen + caption) en el Canal de WhatsApp
// vía Baileys (cliente no oficial — no existe API de Meta para Channels).
//
// Uso:
//   node scripts/publicar-whatsapp-canal.cjs text "Texto del post"
//   node scripts/publicar-whatsapp-canal.cjs post ruta/a/imagen.png "Texto del post"
//
// Requiere DATABASE_URL, WHATSAPP_SESSION_KEY y WHATSAPP_CHANNEL_JID ya
// exportadas en el entorno (mismo criterio que publicar-threads.cjs, no
// carga .env solo):
//   set -a; source .env; set +a; node scripts/publicar-whatsapp-canal.cjs ...
//
// La sesión tiene que existir de antes (correr scripts/whatsapp-bootstrap.mjs
// una vez). Este script conecta, publica, y corta — no queda corriendo.

const fs = require("fs");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta la variable de entorno ${name}. Revisá .env.example.`);
    process.exit(1);
  }
  return value;
}

async function conectar() {
  requireEnv("DATABASE_URL");
  requireEnv("WHATSAPP_SESSION_KEY");
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);

  const { cargarSesionWhatsapp } = await import("./lib/whatsapp-session-store.mjs");
  const { state, saveCreds } = await cargarSesionWhatsapp(sql);

  const baileys = await import("@whiskeysockets/baileys");
  const makeWASocket = baileys.default;
  const { fetchLatestBaileysVersion, DisconnectReason } = baileys;
  const { default: pino } = await import("pino");

  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["ProductosVirales", "Chrome", "1.0"],
    // Default de Baileys son 20s; con sesión ya guardada no debería tardar
    // tanto, pero se sube igual para tolerar una red lenta sin fallar en vano.
    connectTimeoutMs: 60_000,
  });

  sock.ev.on("creds.update", saveCreds);

  await new Promise((resolve, reject) => {
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        reject(
          new Error(
            "Pide QR de nuevo: no hay sesión guardada. Corré scripts/whatsapp-bootstrap.mjs primero."
          )
        );
      }
      if (connection === "open") resolve();
      if (connection === "close") {
        const motivo = lastDisconnect?.error?.output?.statusCode;
        if (motivo === DisconnectReason.loggedOut) {
          reject(new Error("Sesión deslogueada. Corré scripts/whatsapp-bootstrap.mjs de nuevo."));
        }
      }
    });
  });

  return sock;
}

async function main() {
  const [, , modo, ...resto] = process.argv;
  if (!["text", "post"].includes(modo)) {
    console.error("Uso: node scripts/publicar-whatsapp-canal.cjs text|post [imagen.png] \"texto\"");
    process.exit(1);
  }

  const channelJid = requireEnv("WHATSAPP_CHANNEL_JID");
  const sock = await conectar();

  try {
    let mensaje;
    if (modo === "text") {
      const [texto] = resto;
      if (!texto) throw new Error("Falta el texto del post.");
      mensaje = { text: texto };
    } else {
      const [imagePath, texto] = resto;
      if (!imagePath || !fs.existsSync(imagePath)) {
        throw new Error(`No se encontró la imagen: ${imagePath}`);
      }
      mensaje = { image: fs.readFileSync(imagePath), caption: texto || undefined };
    }

    const resultado = await sock.sendMessage(channelJid, mensaje);
    console.log(`Publicado en el canal. id: ${resultado?.key?.id}`);
  } finally {
    await sock.end(undefined);
  }
}

main().catch((err) => {
  console.error("Error publicando en WhatsApp:", err.message);
  process.exit(1);
});
