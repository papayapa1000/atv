import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { ReservationDetailClient } from "@/components/reservation/ReservationDetailClient";
import { ReservationSubnav } from "@/components/reservation/ReservationSubnav";
import { getReservationBoardItem } from "@/lib/reservations/repository";
import type { ReservationDetailActionState } from "@/lib/reservations/public-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "예약글 확인 | 제천 ATV & 수상레저",
  description: "예약글 비밀번호 확인 후 문의 내용과 답글을 확인하세요.",
};

type ReservationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { id } = await params;
  const summary = await getReservationBoardItem(id);

  if (!summary) {
    notFound();
  }

  const initialState: ReservationDetailActionState = {
    status: "locked",
    id,
    message: "",
  };

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <ReservationSubnav active="board" />
      <section className="min-h-[calc(100svh-16rem)] px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/reservation/board" className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            예약게시판
          </Link>

          <div className="mt-8">
            <ReservationDetailClient summary={summary} initialState={initialState} />
          </div>
        </div>
      </section>
    </main>
  );
}
