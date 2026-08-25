#!/usr/bin/env node
// Publica un post (texto solo, con imagen, o carrusel) en Threads vía la
// Threads API oficial de Meta (graph.threads.net).
// Uso:
//   node scripts/publicar-threads.cjs text  "Texto del post"
//   node scripts/publicar-threads.cjs post  ruta/a/imagen.png "Texto del post"
//   node scripts/publicar-threads.cjs carousel ruta/img1.png,ruta/img2.png "Texto del post"
//
// Requiere las variables THREADS_ACCESS_TOKEN, THREADS_USER_ID y
// BLOB_READ_WRITE_TOKEN ya exportadas en el entorno antes de correr esto
// (mismo criterio que scripts/publicar-instagram.cjs — no cargan .env solos):
//   set -a; source .env; set +a; node scripts/publicar-threads.cjs ...
//
// Flujo: sube la(s) imagen(es) a Vercel Blob (la Threads API exige URL
// pública, no acepta archivos locales) -> crea el contenedor de medio ->
// espera a que Threads termine de procesarlo -> publica con
// /threads_publish. Threads recomienda esperar antes de publicar (procesa
// la imagen de forma asíncrona), por eso el polling de waitUntilReady.
//
// Límite de texto de Threads: 500 caracteres (a diferencia de Instagram,
// que no tiene ese límite en el caption). Este script no lo valida — el
// texto ya viene armado por Claude siguiendo el formato v3 hype del sitio
// (memoria: threads-formato-hype-cupon-no-curador-honesto), que entra
// cómodo en ese límite.

const fs = require("fs");
const path = require("path");
const { put } = require("@vercel/blob");

const GRAPH_API_VERSION = "v1.0";
const GRAPH_API_BASE = `https://graph.threads.net/${GRAPH_API_VERSION}`;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta la variable de entorno ${name}. Revisá .env.example.`);
    process.exit(1);
  }
  return value;
}

async function uploadImageToBlob(filePath) {
  const token = requireEnv("BLOB_READ_WRITE_TOKEN");
  const filename = `threads-posts/${Date.now()}-${path.basename(filePath)}`;
  const fileBuffer = fs.readFileSync(filePath);
  const { url } = await put(filename, fileBuffer, {
    access: "public",
    token,
    contentType: "image/png",
  });
  return url;
}

async function createTextContainer({ threadsUserId, accessToken, text, topicTag }) {
  const params = new URLSearchParams({
    media_type: "TEXT",
    text,
    access_token: accessToken,
  });
  if (topicTag) params.set("topic_tag", topicTag);
  const res = await fetch(`${GRAPH_API_BASE}/${threadsUserId}/threads?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor de texto: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function createImageContainer({ threadsUserId, accessToken, imageUrl, text, topicTag }) {
  const params = new URLSearchParams({
    media_type: "IMAGE",
    image_url: imageUrl,
    access_token: accessToken,
  });
  if (text) params.set("text", text);
  if (topicTag) params.set("topic_tag", topicTag);

  const res = await fetch(`${GRAPH_API_BASE}/${threadsUserId}/threads?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor de imagen: ${JSON.stringify(data)}`);
  }
  return data.id;
}

// Item de carrusel: mismo endpoint que un post normal, pero con
// is_carousel_item=true y SIN texto (el texto va solo en el contenedor
// padre que agrupa los items).
async function createCarouselItemContainer({ threadsUserId, accessToken, imageUrl }) {
  const params = new URLSearchParams({
    media_type: "IMAGE",
    image_url: imageUrl,
    is_carousel_item: "true",
    access_token: accessToken,
  });
  const res = await fetch(`${GRAPH_API_BASE}/${threadsUserId}/threads?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando item de carrusel: ${JSON.stringify(data)}`);
  }
  return data.id;
}

// Contenedor padre que agrupa los items ya creados (sus IDs, no las URLs)
// en un solo post de carrusel.
async function createCarouselContainer({ threadsUserId, accessToken, childrenIds, text, topicTag }) {
  const params = new URLSearchParams({
    media_type: "CAROUSEL",
    children: childrenIds.join(","),
    access_token: accessToken,
  });
  if (text) params.set("text", text);
  if (topicTag) params.set("topic_tag", topicTag);

  const res = await fetch(`${GRAPH_API_BASE}/${threadsUserId}/threads?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor de carrusel: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function waitUntilReady(containerId, accessToken, { maxAttempts = 10, delayMs = 3000 } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const params = new URLSearchParams({
      fields: "status,error_message",
      access_token: accessToken,
    });
    const res = await fetch(`${GRAPH_API_BASE}/${containerId}?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Error consultando estado del contenedor: ${JSON.stringify(data)}`);
    }
    if (data.status === "FINISHED") return;
    if (data.status === "ERROR" || data.status === "EXPIRED") {
      throw new Error(`El contenedor falló al procesarse: ${JSON.stringify(data)}`);
    }
    console.log(`Contenedor todavía procesando (${data.status}), esperando...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error("El contenedor no terminó de procesarse a tiempo.");
}

async function publishContainer({ threadsUserId, accessToken, creationId }) {
  const params = new URLSearchParams({
    creation_id: creationId,
    access_token: accessToken,
  });
  const res = await fetch(`${GRAPH_API_BASE}/${threadsUserId}/threads_publish?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error publicando: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function publishText({ text, topicTag, threadsUserId, accessToken }) {
  console.log("Creando contenedor de texto...");
  const creationId = await createTextContainer({ threadsUserId, accessToken, text, topicTag });
  console.log(`Contenedor creado: ${creationId}`);

  console.log("Esperando a que Threads procese el post...");
  await waitUntilReady(creationId, accessToken);

  console.log("Publicando...");
  const mediaId = await publishContainer({ threadsUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function publishImage({ imagePath, text, topicTag, threadsUserId, accessToken }) {
  if (!fs.existsSync(imagePath)) {
    console.error(`No existe el archivo: ${imagePath}`);
    process.exit(1);
  }

  console.log("Subiendo imagen a Vercel Blob...");
  const imageUrl = await uploadImageToBlob(imagePath);
  console.log(`Imagen pública en: ${imageUrl}`);

  console.log("Creando contenedor de imagen...");
  const creationId = await createImageContainer({ threadsUserId, accessToken, imageUrl, text, topicTag });
  console.log(`Contenedor creado: ${creationId}`);

  console.log("Esperando a que Threads procese la imagen...");
  await waitUntilReady(creationId, accessToken);

  console.log("Publicando...");
  const mediaId = await publishContainer({ threadsUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function publishCarousel({ imagePathsArg, text, topicTag, threadsUserId, accessToken }) {
  const imagePaths = imagePathsArg.split(",").map((p) => p.trim());
  if (imagePaths.length < 2 || imagePaths.length > 20) {
    console.error("Un carrusel necesita entre 2 y 20 imágenes (límite de Threads).");
    process.exit(1);
  }
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      console.error(`No existe el archivo: ${imagePath}`);
      process.exit(1);
    }
  }

  const childrenIds = [];
  for (const imagePath of imagePaths) {
    console.log(`Subiendo ${imagePath} a Vercel Blob...`);
    const imageUrl = await uploadImageToBlob(imagePath);
    console.log(`Imagen pública en: ${imageUrl}`);

    console.log("Creando item de carrusel...");
    const itemId = await createCarouselItemContainer({ threadsUserId, accessToken, imageUrl });
    console.log(`Item creado: ${itemId}`);

    console.log("Esperando a que Threads procese la imagen...");
    await waitUntilReady(itemId, accessToken);

    childrenIds.push(itemId);
  }

  console.log("Creando contenedor de carrusel...");
  const creationId = await createCarouselContainer({ threadsUserId, accessToken, childrenIds, text, topicTag });
  console.log(`Contenedor de carrusel creado: ${creationId}`);

  console.log("Esperando a que Threads procese el carrusel...");
  await waitUntilReady(creationId, accessToken);

  console.log("Publicando...");
  const mediaId = await publishContainer({ threadsUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function main() {
  const [, , tipo, arg1, arg2, arg3] = process.argv;

  if (!tipo || !["text", "post", "carousel"].includes(tipo)) {
    console.error(
      'Uso: node scripts/publicar-threads.cjs text "Texto del post" [topicTag]\n' +
      '     node scripts/publicar-threads.cjs post ruta-imagen.png "Texto del post" [topicTag]\n' +
      '     node scripts/publicar-threads.cjs carousel img1,img2,... "Texto del post" [topicTag]\n' +
      '\n' +
      '  topicTag: opcional, ej. "Gaming" — filtra el post dentro del topic community de\n' +
      '  Threads (ver memoria: cosas gaming siempre con topicTag "Gaming").'
    );
    process.exit(1);
  }

  const accessToken = requireEnv("THREADS_ACCESS_TOKEN");
  const threadsUserId = requireEnv("THREADS_USER_ID");

  if (tipo === "text") {
    if (!arg1) {
      console.error('Falta el texto del post. Uso: node scripts/publicar-threads.cjs text "Texto"');
      process.exit(1);
    }
    await publishText({ text: arg1, topicTag: arg2, threadsUserId, accessToken });
  } else if (tipo === "carousel") {
    await publishCarousel({ imagePathsArg: arg1, text: arg2, topicTag: arg3, threadsUserId, accessToken });
  } else {
    await publishImage({ imagePath: arg1, text: arg2, topicTag: arg3, threadsUserId, accessToken });
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
