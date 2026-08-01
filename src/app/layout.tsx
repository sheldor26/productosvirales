import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, DM_Sans, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterBanner } from "@/components/widgets/NewsletterBanner";
import { AffiliateTracker } from "@/components/analytics/AffiliateTracker";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CtaTracker } from "@/components/analytics/CtaTracker";
import { ChannelTracker } from "@/components/analytics/ChannelTracker";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "optional",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "optional",
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
});

export const metadata: Metadata = {
  title: {
    default: "ProductosVirales — Lo más trending de MercadoLibre",
    template: "%s | ProductosVirales",
  },
  description:
    "Descubrí los productos más virales y trending de MercadoLibre Argentina. Ofertas, tendencias de TikTok y lo que todos están comprando.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
  ),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "ProductosVirales",
  },
  twitter: {
    card: "summary_large_image",
    site: "@productosvirales",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "ProductosVirales — Guías nuevas" }],
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${dmSans.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {/* Salto de teclado: sin esto, un usuario de teclado/lector de pantalla
            tiene que tabular por todo el header (logo, nav, categorías, buscador,
            guardados, tema) en CADA página antes de llegar al contenido. Oculto
            hasta que recibe foco (Tab desde el body), WCAG 2.4.1. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--radius-pill)] focus:bg-[var(--bg-primary)] focus:text-[var(--text-primary)] focus:border focus:border-[var(--border)] focus:shadow-lg"
        >
          Saltar al contenido
        </a>
        <ThemeProvider>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <NewsletterBanner />
        </ThemeProvider>
        <Analytics />
        <AffiliateTracker />
        <ScrollDepthTracker />
        <CtaTracker />
        <ChannelTracker />
        <WebVitalsReporter />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7FJY0G4T9K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // transport_url: manda el /g/collect a nuestro propio dominio (/_ga),
            // que el rewrite de next.config reenvía a Google. Evita que el hit se
            // pierda cuando la red o un adblocker bloquea google-analytics.com directo.
            gtag('config', 'G-7FJY0G4T9K', { transport_url: window.location.origin + '/_ga' });
          `}
        </Script>
        {/* lazyOnload (no afterInteractive): Clarity graba sesiones completas
            de mutaciones del DOM, compite por el hilo principal justo cuando
            más importa (INP de los primeros clicks). No es crítico para medir
            conversión (eso lo hacen GA/Vercel), así que puede esperar a que
            el navegador esté libre. */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xgasuwpism");
          `}
        </Script>
      </body>
    </html>
  );
}
