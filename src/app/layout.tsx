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
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterBanner />
        </ThemeProvider>
        <Analytics />
        <AffiliateTracker />
        <ScrollDepthTracker />
        <CtaTracker />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7FJY0G4T9K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7FJY0G4T9K');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
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
