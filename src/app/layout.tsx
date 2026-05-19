import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
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

export const metadata: Metadata = {
  title: "?쒖쿇 ATV & ?섏긽?덉? | 泥?뭾???덉? ?덉빟",
  description:
    "泥?뭾?몄뿉???섏긽?ㅽ궎, ?⑥씠?щ낫?? 紐⑦꽣蹂댄듃, ATV, ?⑥껜 ?뚰겕?듭쓣 ??踰덉뿉 ?덉빟?섎뒗 ?쒖쿇 ?덉? ?덊럹?댁??낅땲??",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "?쒖쿇 ATV & ?섏긽?덉?",
    description: "泥?뭾???섏긽?덉?? ATV ?덉빟 ?덈궡",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} ${jetBrainsMono.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
