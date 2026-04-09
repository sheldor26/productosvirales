import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
