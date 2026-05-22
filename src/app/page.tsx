import { Hero } from "@/components/home/Hero";
import { HomeOverview } from "@/components/home/HomeOverview";
import { QuickInfo } from "@/components/home/QuickInfo";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "제천 수상레저 & 청풍 ATV",
  description: "청풍호 수상스키, 웨이크보드, 모터보트, ATV, 단체 워크숍을 한곳에서 상담하고 예약하세요.",
  path: "/",
  keywords: ["제천 레저 예약", "청풍호 레저 예약"],
});

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickInfo />
      <HomeOverview />
    </main>
  );
}
