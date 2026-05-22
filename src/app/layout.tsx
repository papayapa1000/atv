import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { PageMotion } from "@/components/motion/PageMotion";
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
  title: "제천 수상레저 & 청풍 ATV | 청풍호 레저 예약",
  description:
    "청풍호에서 수상스키, 웨이크보드, 모터보트, ATV, 단체 워크숍을 한 번에 예약하는 제천 레저 홈페이지입니다.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "제천 수상레저 & 청풍 ATV",
    description: "청풍호 수상레저와 ATV 예약 안내",
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
        <PageMotion>{children}</PageMotion>
        <Footer />
      </body>
    </html>
  );
}
