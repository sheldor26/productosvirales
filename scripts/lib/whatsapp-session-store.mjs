// Store de la sesión de Baileys (login de WhatsApp Web) respaldado en la
// misma Neon que ya usa scripts/bot-social.mjs, en vez de archivos en disco:
// GitHub Actions no tiene disco persistente entre corridas, así que la
// sesión escaneada una vez por QR tiene que sobrevivir entre ejecuciones.
//
// Replica la forma exacta de useMultiFileAuthState de Baileys (un mapa
// "archivo" -> valor, con creds.json aparte) pero guarda ese mapa completo
// como un único JSON encriptado (AES-256-GCM) en whatsapp_channel_session,
// fila única id=1.
//
// Requiere WHATSAPP_SESSION_KEY: 32 bytes en base64 (openssl rand -base64 32).

import crypto from "node:crypto";
import { initAuthCreds, BufferJSON, proto } from "@whiskeysockets/baileys";

function getKey() {
  const b64 = process.env.WHATSAPP_SESSION_KEY;
  if (!b64) {
    throw new Error(
      "Falta WHATSAPP_SESSION_KEY (32 bytes en base64: openssl rand -base64 32)."
    );
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) {
    throw new Error("WHATSAPP_SESSION_KEY debe decodificar a exactamente 32 bytes.");
  }
  return key;
}

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

function decrypt(payload) {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

async function leerArchivos(sql) {
  const filas = await sql`SELECT session_data FROM whatsapp_channel_session WHERE id = 1`;
  if (!filas.length || !filas[0].session_data) return {};
  return JSON.parse(decrypt(filas[0].session_data), BufferJSON.reviver);
}

async function escribirArchivos(sql, files) {
  const payload = encrypt(JSON.stringify(files, BufferJSON.replacer));
  await sql`
    INSERT INTO whatsapp_channel_session (id, session_data, updated_at)
    VALUES (1, ${payload}, now())
    ON CONFLICT (id) DO UPDATE SET session_data = EXCLUDED.session_data, updated_at = now()
  `;
}

/**
 * Devuelve { state, saveCreds } con la misma forma que
 * useMultiFileAuthState de Baileys, lista para pasar a
 * makeWASocket({ auth: state }).
 */
export async function cargarSesionWhatsapp(sql) {
  const files = await leerArchivos(sql);
  const creds = files["creds.json"] || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          for (const id of ids) {
            let value = files[`${type}-${id}.json`] ?? null;
            if (type === "app-state-sync-key" && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value);
            }
            data[id] = value;
          }
          return data;
        },
        set: async (data) => {
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const key = `${category}-${id}.json`;
              if (value) files[key] = value;
              else delete files[key];
            }
          }
          await escribirArchivos(sql, files);
        },
      },
    },
    saveCreds: async () => {
      files["creds.json"] = creds;
      await escribirArchivos(sql, files);
    },
  };
}
