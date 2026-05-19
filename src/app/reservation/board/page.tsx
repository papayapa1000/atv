import type { Metadata } from "next";
import Link from "next/link";
import { LockKey, PencilSimpleLine } from "@phosphor-icons/react/ssr";
import { ReservationSubnav } from "@/components/reservation/ReservationSubnav";
import { getReservationBoardTitle, getStatusLabel } from "@/lib/reservations/validation";
import { listReservationPostsPage, type ReservationBoardPage } from "@/lib/reservations/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "예약게시판 | 제천 ATV & 수상레저",
  description: "예약글쓰기에서 접수된 예약 문의를 확인하세요.",
};

type ReservationBoardPageProps = {
  searchParams?: Promise<{ created?: string; page?: string }>;
};

function statusClass(status: string) {
  if (status === "confirmed") {
    return "border-lake bg-lake text-white";
  }

  if (status === "cancelled") {
    return "border-sun bg-sun text-white";
  }

  return "border-gray-300 bg-gray-100 text-gray-700";
}

export default async function ReservationBoardPage({ searchParams }: ReservationBoardPageProps) {
  const params = searchParams ? await searchParams : {};
  let reservationPage: ReservationBoardPage = {
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    offset: 0,
  };
  let loadError = "";

  try {
    reservationPage = await listReservationPostsPage(params.page, 10);
  } catch {
    loadError = "예약게시판을 불러오지 못했습니다. Supabase 설정과 reservation_posts 테이블을 확인해 주세요.";
  }

  const reservations = reservationPage.items;

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <ReservationSubnav active="board" />
      <section className="min-h-[calc(100svh-16rem)] px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 border-b border-foreground/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">
                Reservation Board
              </p>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">예약게시판</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
                예약글쓰기에서 작성한 문의가 접수 순서대로 표시됩니다. 연락처는 개인정보 보호를 위해 일부만 공개합니다.
              </p>
            </div>
            <Link
              href="/reservation/write"
              className="spring inline-flex w-fit items-center gap-3 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white"
            >
              <PencilSimpleLine aria-hidden="true" className="h-4 w-4" weight="bold" />
              예약글쓰기
            </Link>
          </div>

          {params.created ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">
              예약 문의가 접수되었습니다.
            </div>
          ) : null}

          {loadError ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">{loadError}</div>
          ) : null}

          {reservationPage.totalCount > 0 ? (
            <div className="mt-6 flex items-center justify-between text-sm font-bold text-foreground/56">
              <span>총 {reservationPage.totalCount}개</span>
              <span>
                {reservationPage.page} / {reservationPage.totalPages} 페이지
              </span>
            </div>
          ) : null}

          <div className="mt-8 min-h-[32rem] border border-foreground/12 bg-surface p-4 sm:p-5">
            {reservations.length > 0 ? (
              <ul className="grid gap-3">
                {reservations.map((item) => (
                  <li
                    key={item.id}
                    className="spring border border-foreground/14 bg-white shadow-[0_12px_20px_-16px_rgba(107,114,128,0.65)] hover:-translate-y-0.5 hover:border-lake/36 hover:shadow-[0_16px_28px_-16px_rgba(75,85,99,0.7)]"
                  >
                    <Link
                      href={`/reservation/board/${item.id}`}
                      className="spring grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 p-3 hover:bg-foam/76 focus:outline-none focus-visible:ring-2 focus-visible:ring-lake/30 sm:p-5 md:grid-cols-[2.5rem_1fr_8rem_15rem] md:items-center md:gap-4 md:p-6"
                    >
                      <div className="hidden h-9 w-9 items-center justify-center border border-foreground/12 text-foreground/54 sm:flex md:h-10 md:w-10">
                        <LockKey aria-hidden="true" className="h-4 w-4" weight="bold" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground sm:text-base">
                          {getReservationBoardTitle(item.customerName)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-foreground/56 sm:mt-2 sm:text-sm">{item.reservationSummary}</p>
                      </div>
                      <span
                        className={`inline-flex w-fit items-center justify-center border px-2 py-1 text-[0.68rem] font-bold sm:px-3 sm:py-1.5 sm:text-xs ${statusClass(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <time dateTime={item.createdAt} className="numeric hidden text-right text-sm font-bold text-foreground/48 sm:block md:text-right">
                        {new Intl.DateTimeFormat("ko-KR", {
                          timeZone: "Asia/Seoul",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }).format(new Date(item.createdAt))}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[32rem] flex-col items-center justify-center px-5 py-16 text-center">
                <p className="text-lg font-bold">아직 접수된 예약 문의가 없습니다.</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">첫 예약 문의를 남기면 이곳에서 확인할 수 있습니다.</p>
              </div>
            )}
          </div>

          {reservationPage.totalPages > 1 ? (
            <nav aria-label="예약게시판 페이지" className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {reservationPage.page > 1 ? (
                <Link
                  href={`/reservation/board?page=${reservationPage.page - 1}`}
                  className="spring border border-foreground/14 bg-surface px-4 py-2 text-sm font-bold text-foreground/68 hover:border-foreground hover:text-foreground"
                >
                  이전
                </Link>
              ) : null}

              {Array.from({ length: reservationPage.totalPages }, (_, index) => index + 1).map((pageNumber) => {
                const isActive = pageNumber === reservationPage.page;

                return (
                  <Link
                    key={pageNumber}
                    href={`/reservation/board?page=${pageNumber}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`spring inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-bold ${
                      isActive
                        ? "border-lake bg-lake text-white"
                        : "border-foreground/14 bg-surface text-foreground/68 hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}

              {reservationPage.page < reservationPage.totalPages ? (
                <Link
                  href={`/reservation/board?page=${reservationPage.page + 1}`}
                  className="spring border border-foreground/14 bg-surface px-4 py-2 text-sm font-bold text-foreground/68 hover:border-foreground hover:text-foreground"
                >
                  다음
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
}
