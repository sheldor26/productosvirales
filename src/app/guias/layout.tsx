import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "optional",
});

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  // The variable lives on a wrapper div so descendants get var(--font-serif)
  // without the rest of the site paying for the download.
  return <div className={sourceSerif.variable}>{children}</div>;
}
