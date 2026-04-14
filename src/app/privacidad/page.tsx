import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de ProductosVirales.com.ar. Qué datos recolectamos, cómo los usamos, y cuáles son tus derechos.",
  alternates: { canonical: "https://productosvirales.com.ar/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4 text-[var(--text-secondary)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Política de privacidad
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Última actualización: 14 de abril de 2026
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Quiénes somos
      </h2>
      <p>
        ProductosVirales.com.ar es un sitio de contenido editorial operado de
        forma independiente. Este documento explica cómo manejamos tus datos.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Datos que recolectamos
      </h2>
      <p>
        No te pedimos que crees una cuenta ni que nos des datos personales.
        Usamos Vercel Analytics para entender cómo se usa el sitio, que
        recolecta métricas anónimas (país, dispositivo, páginas visitadas). No
        usamos cookies de seguimiento cross-site.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Links de afiliados
      </h2>
      <p>
        Muchos links en el sitio son links de afiliado a MercadoLibre
        Argentina. Si hacés click y comprás, recibimos una comisión sin costo
        extra para vos. MercadoLibre puede setear sus propias cookies al
        recibir tu visita — su política se aplica una vez que salís de nuestro
        sitio.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Tus derechos
      </h2>
      <p>
        Tenés derecho a solicitar qué datos tenemos sobre vos (esencialmente
        ninguno) y a pedir que los borremos. Contactanos en{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--color-primary)]"
        >
          hola@productosvirales.com.ar
        </a>
        .
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cambios a esta política
      </h2>
      <p>
        Si cambiamos esta política, actualizamos la fecha arriba. No te
        notificamos activamente porque no tenemos tu email.
      </p>
    </div>
  );
}
