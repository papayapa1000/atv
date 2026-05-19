import type { Metadata } from "next";
import { ReservationGuide } from "@/components/home/ReservationGuide";
import { ReservationSubnav } from "@/components/reservation/ReservationSubnav";

export const metadata: Metadata = {
  title: "예약 안내 | 제천 ATV & 수상레저",
  description: "예약금, 예약 준비 항목, 환불규정, 안전수칙을 확인하고 전화로 예약하세요.",
};

export default function ReservationPage() {
  return (
    <main>
      <ReservationSubnav active="guide" />
      <ReservationGuide />
    </main>
  );
}
