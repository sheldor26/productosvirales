import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Somos ProductosVirales: un curador independiente de productos virales y trending de MercadoLibre Argentina. Conocé nuestra metodología, cómo ganamos dinero y por qué podés confiar en nuestras recomendaciones.",
  alternates: {
    canonical: "https://productosvirales.com.ar/sobre-nosotros",
  },
  openGraph: {
    title: "Sobre ProductosVirales — El curador independiente de MercadoLibre",
    description:
      "Conocé quiénes estamos detrás del sitio, nuestra metodología y cómo funcionamos.",
    url: "https://productosvirales.com.ar/sobre-nosotros",
  },
};

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Sobre ProductosVirales",
            url: "https://productosvirales.com.ar/sobre-nosotros",
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
        Sobre ProductosVirales
      </h1>

      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        ProductosVirales.com.ar es un curador independiente de productos
        trending y virales disponibles en MercadoLibre Argentina. No vendemos
        nada. No somos una tienda. Somos la guía que te dice qué comprar, por
        qué, y si realmente vale la pena.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo seleccionamos los productos
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Revisamos cientos de productos en MercadoLibre Argentina cada semana.
        Priorizamos los que cumplen tres criterios: (1) alta rotación de ventas
        en el marketplace, (2) buena calidad-precio comparada con alternativas,
        y (3) vendedores con reputación sólida. Probamos muchos nosotros
        mismos y escribimos sobre lo que funciona.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cómo ganamos dinero (transparencia)
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Si comprás un producto usando nuestros links, MercadoLibre nos paga una
        pequeña comisión. Vos no pagás nada extra. Esa comisión no influye en
        nuestras recomendaciones: si un producto no nos convence, lo decimos,
        aunque podamos ganar plata vendiéndolo.
      </p>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        Todas nuestras guías incluyen un disclosure visible cuando contienen
        links de afiliados.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Nuestro compromiso
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-base text-[var(--text-secondary)]">
        <li>No recomendamos productos que no compraríamos nosotros mismos.</li>
        <li>
          Actualizamos los precios y la información cada vez que detectamos
          cambios relevantes.
        </li>
        <li>
          Si nos equivocamos, corregimos. Las guías viejas se actualizan, no se
          esconden.
        </li>
        <li>
          No aceptamos pagos para rankear productos. Nuestras opiniones son
          independientes.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contacto
      </h2>
      <p className="text-base text-[var(--text-secondary)] leading-relaxed">
        ¿Tenés una sugerencia, encontraste un error, o querés que revisemos un
        producto? Escribinos a{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--color-primary)]"
        >
          hola@productosvirales.com.ar
        </a>
        .
      </p>
    </div>
  );
}
