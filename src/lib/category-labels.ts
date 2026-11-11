import { categories } from "@/data/categories";

// Hay dos espacios de slugs distintos que terminan los dos en esta función:
// el de categories.ts (hogar, climatizacion, salud-bienestar — con `name`
// propio y ya acentuado) y el más fino de `guide.category`/`product.categorySlug`
// (perfumes-arabes, pavas-electricas, maquinas-de-coser — sin tabla propia).
// Separar por guion y poner mayúscula inicial da "Perfumes Arabes": entendible
// pero mal escrito en los ~30 slugs finos que llevan una palabra acentuada.
// Este mapa cubre esos casos puntuales; el resto sigue el fallback automático.
const ACCENTED_CATEGORY_NAMES: Record<string, string> = {
  "anafe-electrico": "Anafe Eléctrico",
  "arrocera-electrica": "Arrocera Eléctrica",
  "bicicletas-electricas": "Bicicletas Eléctricas",
  "botellas-termicas": "Botellas Térmicas",
  "calefones-electricos": "Calefones Eléctricos",
  "camaras-deportivas": "Cámaras Deportivas",
  "casco-de-moto": "Casco de Moto",
  "camaras-instantaneas": "Cámaras Instantáneas",
  "camaras-vlog": "Cámaras Vlog",
  "cochecito-de-bebe": "Cochecito de Bebé",
  "comodas": "Cómodas",
  "corralito-para-bebe": "Corralito para Bebé",
  "cortadoras-de-cesped": "Cortadoras de Césped",
  "duchas-electricas": "Duchas Eléctricas",
  "eliptica": "Elíptica",
  "estabilizador-de-tension": "Estabilizador de Tensión",
  "estanterias-flotantes": "Estanterías Flotantes",
  "estufas-electricas": "Estufas Eléctricas",
  "guante-de-arquero": "Guante de Arquero",
  "horno-electrico": "Horno Eléctrico",
  "hot-wheels-autos-coleccion": "Hot Wheels Autos Colección",
  "lamparas-de-pie": "Lámparas de Pie",
  "maquina-de-helados": "Máquina de Helados",
  "maquina-de-remo": "Máquina de Remo",
  "maquinas-de-coser": "Máquinas de Coser",
  "mesa-de-ping-pong": "Mesa de Ping Pong",
  "niveles-laser": "Niveles Láser",
  "organizacion-hogar": "Organización Hogar",
  "parrillas-electricas": "Parrillas Eléctricas",
  "pavas-electricas": "Pavas Eléctricas",
  "perfumes-arabes": "Perfumes Árabes",
  "salamandras-a-lena": "Salamandras a Leña",
  "sarten-antiadherente": "Sartén Antiadherente",
  "tensiometros": "Tensiómetros",
  "termometros-digitales": "Termómetros Digitales",
};

/** Nombre legible de una categoría (de guía o de producto), con tildes
 * correctas. Prueba primero contra categories.ts (su `name` ya está bien
 * escrito, ej. "climatizacion" -> "Climatización"), después contra el mapa de
 * slugs finos de arriba, y si no encuentra nada cae al Title Case automático.
 * Devuelve Title Case ("Perfumes Árabes"); para mayúsculas (eyebrow de
 * ArticleHeader), aplicar .toUpperCase() sobre el resultado. */
export function getCategoryName(slug: string): string {
  const topLevel = categories.find((c) => c.slug === slug);
  if (topLevel) return topLevel.name;
  const override = ACCENTED_CATEGORY_NAMES[slug];
  if (override) return override;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
