import type { Metadata } from "next";
import { baseOpenGraph } from "@/lib/site-og";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Encontraste un error, querés sugerir un producto o tenés una duda? Escribinos a hola@productosvirales.com.ar. Leemos todos los mensajes.",
  alternates: {
    canonical: "https://productosvirales.com.ar/contacto",
  },
  openGraph: {
    ...baseOpenGraph,
    title: "Contacto — ProductosVirales",
    description:
      "Escribinos a hola@productosvirales.com.ar. Sugerencias, errores o pedidos de productos para revisar.",
    url: "https://productosvirales.com.ar/contacto",
  },
};

export default function ContactoPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contacto — ProductosVirales",
            url: "https://productosvirales.com.ar/contacto",
            mainEntity: {
              "@type": "Organization",
              name: "ProductosVirales",
              url: "https://productosvirales.com.ar",
              email: "hola@productosvirales.com.ar",
            },
          }),
        }}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Contacto
      </h1>

      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        ¿Encontraste un error, querés sugerir un producto o tenés una duda?
        Escribinos. Leemos todos los mensajes y respondemos cuando podemos.
      </p>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 md:p-8 text-center space-y-3">
        <p className="text-sm text-[var(--text-muted)]">Escribinos a</p>
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="inline-block text-lg md:text-xl font-bold text-[var(--color-primary)] underline break-all"
        >
          hola@productosvirales.com.ar
        </a>
      </div>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Sobre qué escribirnos
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-base text-[var(--text-secondary)]">
        <li>
          Un producto que querés que revisemos o sumemos a una guía.
        </li>
        <li>
          Un error: un precio desactualizado, un link roto, un dato que no
          cierra.
        </li>
        <li>
          Una sugerencia para mejorar el sitio o una guía.
        </li>
      </ul>

      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Somos un equipo chico. No vendemos nada ni hacemos soporte de compras:
        para problemas con un pedido, el vendedor o la devolución, lo tuyo lo
        resuelve MercadoLibre directamente.
      </p>
    </div>
  );
}
