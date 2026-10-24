import Link from "next/link";
import type { Metadata } from "next";
import { baseOpenGraph } from "@/lib/site-og";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Cómo armamos cada ficha de producto, cómo chequeamos los precios y por qué sacamos los productos sin stock de nuestras guías en ProductosVirales.",
  alternates: {
    canonical: "https://productosvirales.com.ar/metodologia",
  },
  openGraph: {
    ...baseOpenGraph,
    title: "Metodología — Cómo verificamos lo que recomendamos",
    description:
      "El proceso real detrás de cada ficha y cada guía: fuentes, verificación de precios y por qué sacamos lo que se queda sin stock.",
    url: "https://productosvirales.com.ar/metodologia",
  },
};

export default function MetodologiaPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Metodología de ProductosVirales",
            url: "https://productosvirales.com.ar/metodologia",
            mainEntity: {
              "@type": "Organization",
              name: "ProductosVirales",
              url: "https://productosvirales.com.ar",
              description:
                "Curador independiente de productos virales y trending de MercadoLibre Argentina",
            },
          }),
        }}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Cómo verificamos lo que recomendamos
      </h1>

      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Esto no es un resumen de marketing: es el proceso real que seguimos para
        armar cada ficha y cada guía. Si en algún momento no cumplimos algo de
        esto, escribinos a{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--text-primary)]"
        >
          hola@productosvirales.com.ar
        </a>{" "}
        y lo corregimos.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        De dónde sale cada ficha de producto
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Partimos de los datos crudos de MercadoLibre: precio, ficha técnica,
        imágenes del vendedor, rating y la cantidad real de calificaciones.
        Cuando el fabricante tiene página oficial (Philips, Atma, Nespresso,
        etc.), la cruzamos para completar specs que el vendedor no siempre
        carga bien, pero solo si el modelo coincide exactamente con el que se
        vende en Argentina.
      </p>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Después viene el filtro que de verdad importa: las reseñas reales de
        compradores. Un vendedor puede escribir cualquier cosa en el título o
        la descripción de su publicación; las reseñas dicen si es cierto. Si
        las reseñas contradicen lo que promete la publicación, contamos esa
        contradicción, no la escondemos.
      </p>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Cuando un dato no lo podemos verificar con certeza (una spec, el peso,
        un MPN), lo omitimos. No lo inventamos para completar un casillero.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo chequeamos los precios
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Los precios del catálogo se re-verifican contra MercadoLibre varias
        veces por semana con un proceso automatizado, no a mano producto por
        producto. Cada ficha muestra la fecha de la última verificación.
      </p>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Cuando alguien de nuestro equipo verifica un precio a mano en vivo
        (por ejemplo, para corregir un dato que veníamos arrastrando mal), ese
        precio queda protegido durante 7 días: el proceso automático no lo
        puede pisar en ese lapso, para que un scrapeo con datos rotos no
        revierta una corrección real. Pasó una vez, en agosto de 2026, y desde
        entonces existe esta protección.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Qué pasa cuando un producto se queda sin stock
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Cuando detectamos que un producto recomendado se agotó o la
        publicación se dio de baja, lo sacamos de las guías que lo
        mencionaban y lo reemplazamos por una alternativa real con stock
        vigente. La ficha vieja se marca para que no aparezca en listados ni
        en buscadores: no queremos recomendar un producto fantasma que ya no
        se puede comprar.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo ganamos dinero
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Si comprás un producto usando nuestros links, MercadoLibre nos paga
        una comisión chica. Vos no pagás nada extra, y esa comisión no influye
        en qué recomendamos: si un producto no nos convence, lo decimos,
        aunque podamos ganar plata vendiéndolo. Más detalle en{" "}
        <Link href="/sobre-nosotros" className="underline text-[var(--text-primary)]">
          Sobre nosotros
        </Link>
        .
      </p>
    </div>
  );
}
