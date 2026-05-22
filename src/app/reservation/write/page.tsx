import type { Metadata } from "next";
import { PhoneCall, ShieldCheck } from "@phosphor-icons/react/ssr";
import { DepositAccountGuide } from "@/components/reservation/DepositAccountGuide";
import { ReservationWriteForm } from "@/components/reservation/ReservationWriteForm";
import { ReservationSubnav } from "@/components/reservation/ReservationSubnav";
import { phoneHref, phoneNumber } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "예약글쓰기 | 제천 수상레저 & 청풍 ATV",
  description: "예약자 정보, 이용 날짜, 이용 레저를 남겨 예약 문의를 접수하세요.",
};

export default function ReservationWritePage() {
  return (
    <main className="depth-mint bg-foam text-foreground">
      <ReservationSubnav active="write" />
      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-[1180px] gap-6">
          <DepositAccountGuide layout="horizontal" headingLevel="h2" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="border border-foreground/12 bg-surface p-4 sm:p-6 lg:p-7">
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">Write</p>
              <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-4xl">예약글쓰기</h1>
              <div className="mt-7">
                <ReservationWriteForm />
              </div>
            </div>

            <aside className="grid content-start gap-4">
              <div className="border border-lake bg-lake p-5 text-white shadow-[0_18px_34px_-24px_rgba(7,59,58,0.86)] sm:p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5 text-white" weight="bold" />
                  <h2 className="text-lg font-bold">예약 접수 안내</h2>
                </div>
                <div className="mt-4 space-y-3 text-xs leading-6 text-white/84">
                  <p>저희 제천 수상레저 & 청풍 ATV는 선입금 방식으로 예약을 받고 있습니다.</p>
                  <p>예약금 5만원을 선입금하신 뒤 양식에 맞춰 예약문의 게시판에 남겨 주시면 확인 후 연락드립니다.</p>
                  <p>ATV와 그 외 종목의 입금 계좌가 다르니 상단 계좌 안내를 먼저 확인해 주세요.</p>
                  <p>예약일 변경은 최소 1일 전 게시판 또는 전화로 알려 주세요.</p>
                </div>
              </div>

              <div className="border border-sun bg-sun p-5 text-white shadow-[0_18px_34px_-24px_rgba(185,79,49,0.78)] sm:p-6">
                <p className="text-sm font-bold text-white/82">전화문의</p>
                <a href={phoneHref} className="spring mt-3 inline-flex items-center gap-3 text-xl font-bold text-white hover:text-white/82">
                  <PhoneCall aria-hidden="true" className="h-5 w-5" weight="bold" />
                  {phoneNumber}
                </a>
                <p className="mt-3 text-xs leading-6 text-white/78">단체 예약, 패키지 구성, 당일 날씨 확인은 유선 문의가 가장 빠릅니다.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
