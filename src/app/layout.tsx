import { JetBrains_Mono, Outfit } from "next/font/google";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { PageMotion } from "@/components/motion/PageMotion";
import { buildRootMetadata, getLocalBusinessJsonLd, stringifyJsonLd } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} ${jetBrainsMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(getLocalBusinessJsonLd()) }}
        />
        <Header />
        <PageMotion>{children}</PageMotion>
        <Footer />
      </body>
    </html>
  );
}
