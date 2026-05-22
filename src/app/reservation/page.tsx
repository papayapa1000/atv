import { ReservationGuide } from "@/components/home/ReservationGuide";
import { ReservationSubnav } from "@/components/reservation/ReservationSubnav";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "예약 안내",
  description: "예약금, 예약 준비 항목, 환불규정, 안전수칙을 확인하고 전화로 예약하세요.",
  path: "/reservation",
  keywords: ["제천 수상레저 예약", "청풍 ATV 예약", "청풍호 레저 예약금"],
});

export default function ReservationPage() {
  return (
    <main>
      <ReservationSubnav active="guide" />
      <ReservationGuide />
    </main>
  );
}
