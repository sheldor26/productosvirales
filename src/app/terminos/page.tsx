import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos de uso de ProductosVirales.com.ar. Condiciones bajo las cuales podés usar el sitio.",
  alternates: { canonical: "https://productosvirales.com.ar/terminos" },
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4 text-[var(--text-secondary)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Términos y condiciones
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Última actualización: 14 de abril de 2026
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Aceptación
      </h2>
      <p>
        Al usar ProductosVirales.com.ar aceptás estos términos. Si no estás de
        acuerdo, no uses el sitio.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contenido editorial
      </h2>
      <p>
        Nuestro contenido es editorial e informativo. Hacemos el mejor esfuerzo
        para que sea preciso y esté actualizado, pero no garantizamos que los
        precios, stocks o características sean exactos al momento de tu
        compra. La decisión de compra es tuya.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Links de afiliados
      </h2>
      <p>
        Ganamos comisión por ventas originadas en nuestros links. Esto no
        modifica el precio que pagás ni nuestras recomendaciones editoriales.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Responsabilidad
      </h2>
      <p>
        No somos responsables por las compras que hagas en MercadoLibre ni por
        la calidad, garantía o post-venta de los productos. La relación
        comercial es entre vos y el vendedor de MercadoLibre.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Propiedad intelectual
      </h2>
      <p>
        El contenido editorial es nuestro. Las imágenes de producto pertenecen
        a MercadoLibre y a sus respectivos vendedores y se usan bajo fair use
        editorial.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Contacto
      </h2>
      <p>Para cualquier consulta: hola@productosvirales.com.ar</p>
    </div>
  );
}
