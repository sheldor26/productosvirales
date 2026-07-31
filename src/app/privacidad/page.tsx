import type { Metadata } from "next";
import { baseOpenGraph } from "@/lib/site-og";

const title = "Política de privacidad";
const description =
  "Política de privacidad de ProductosVirales.com.ar. Qué datos recolectamos, cómo los usamos, y cuáles son tus derechos.";
const canonical = "https://productosvirales.com.ar/privacidad";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: { ...baseOpenGraph, title, description, url: canonical },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4 text-[var(--text-secondary)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
        Política de privacidad
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Última actualización: 30 de julio de 2026
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
        No te pedimos que crees una cuenta. Usamos Google Analytics 4,
        Microsoft Clarity y Vercel Analytics para entender cómo se usa el
        sitio: qué páginas se visitan, desde qué dispositivo y país, y cómo
        interactuás con la página (Clarity puede grabar sesiones y mapas de
        calor, sin capturar campos de formulario). Ninguna de estas
        herramientas identifica quién sos por nombre.
      </p>
      <p>
        Si te suscribís al newsletter o a las alertas de baja de precio,
        guardamos tu email, tu dirección IP y desde qué página te
        suscribiste, en una base de datos propia. Usamos eso únicamente para
        mandarte los avisos que pediste. Podés darte de baja en cualquier
        momento con el link que incluye cada email.
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
        Productos guardados
      </h2>
      <p>
        Si usás el botón de guardar en una tarjeta de producto, la lista queda
        en el almacenamiento local de tu navegador (localStorage), no en
        nuestros servidores. No la asociamos a ninguna cuenta ni email, y se
        borra sola si limpiás los datos del sitio en tu navegador.
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Tus derechos
      </h2>
      <p>
        Tenés derecho a solicitar qué datos tenemos sobre vos y a pedir que
        los borremos. Si te suscribiste, eso es tu email, tu IP y la página
        de origen; si no, no guardamos ningún dato que te identifique.
        Contactanos en{" "}
        <a
          href="mailto:hola@productosvirales.com.ar"
          className="underline text-[var(--text-primary)]"
        >
          hola@productosvirales.com.ar
        </a>
        .
      </p>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6">
        Cambios a esta política
      </h2>
      <p>
        Si cambiamos esta política, actualizamos la fecha arriba. Solo te
        notificamos activamente si sos suscriptor y el cambio te afecta
        directamente.
      </p>
    </div>
  );
}
