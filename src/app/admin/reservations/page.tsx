import type { Metadata } from "next";
import { CalendarCheck, ChatCenteredText, LockKey, NotePencil, PhoneCall } from "@phosphor-icons/react/ssr";
import { deleteAdminReservationAction, updateAdminReservationAction } from "@/app/admin/actions";
import { AdminReservationDeleteForm } from "@/components/admin/AdminReservationDeleteForm";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { listAdminReservations } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { getStatusLabel, reservationStatuses } from "@/lib/reservations/validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "예약게시판 관리 | 제천 ATV & 수상레저",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminReservationsPageProps = {
  searchParams?: Promise<{ updated?: string; deleted?: string; error?: string }>;
};

function statusClass(status: string) {
  if (status === "confirmed") {
    return "border-lake/20 bg-lake text-foam";
  }

  if (status === "cancelled") {
    return "border-sun bg-sun text-white";
  }

  return "border-gray-300 bg-gray-100 text-gray-700";
}

function statusSelectClass(status: string) {
  if (status === "confirmed") {
    return "border-lake/25 bg-lake/8 text-lake";
  }

  if (status === "cancelled") {
    return "border-sun/35 bg-sun/12 text-deep";
  }

  return "border-gray-300 bg-gray-50 text-gray-700";
}

function formatKoreaDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function replyToneClass(authorType: "customer" | "admin") {
  if (authorType === "admin") {
    return {
      article: "border-lake bg-white",
      label: "text-lake",
    };
  }

  return {
    article: "border-sun bg-white",
    label: "text-deep",
  };
}

export default async function AdminReservationsPage({ searchParams }: AdminReservationsPageProps) {
  await requireAdminSession();
  const params = searchParams ? await searchParams : {};
  const reservations = await listAdminReservations();

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="reservations" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="border-b border-foreground/12 pb-8">
            <div>
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">
                Reservation Admin
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">예약게시판 관리</h1>
            </div>
          </div>

          {params.updated ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-semibold text-lake">예약 정보가 저장되었습니다.</div>
          ) : null}
          {params.deleted ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-semibold text-sunset">예약글이 삭제되었습니다.</div>
          ) : null}
          {params.error ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-semibold text-sunset">입력 내용을 다시 확인해 주세요.</div>
          ) : null}

          <div className="mt-8 grid gap-3">
            {reservations.length > 0 ? (
              reservations.map((item) => (
                <article key={item.id} className="border border-foreground/12 bg-surface p-4 shadow-[0_12px_20px_-16px_rgba(107,114,128,0.65)]">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center border border-foreground/12 text-foreground/54">
                          <LockKey aria-hidden="true" className="h-4 w-4" weight="bold" />
                        </span>
                        <h2 className="text-lg font-semibold">
                          {item.customerName} <span className="text-foreground/48">님</span>
                        </h2>
                        <span className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>

                      <dl className="mt-4 grid gap-2 text-sm leading-6 text-foreground/68 md:grid-cols-2">
                        <div className="flex gap-3">
                          <PhoneCall aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-lake" weight="bold" />
                          <div>
                            <dt className="font-semibold text-foreground">연락처</dt>
                            <dd className="numeric">{item.phone}</dd>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CalendarCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-lake" weight="bold" />
                          <div>
                            <dt className="font-semibold text-foreground">예약 일정</dt>
                            <dd>{item.reservationSummary}</dd>
                          </div>
                        </div>
                        <div>
                          <dt className="font-semibold text-foreground">이용레저</dt>
                          <dd>{item.leisureType}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-foreground">입금자명</dt>
                          <dd>{item.depositorName || "미입력"}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 grid gap-3 text-sm leading-6 text-foreground/68">
                        <div className="border border-lake/16 border-l-4 border-l-lake bg-white p-4 shadow-[0_14px_26px_-22px_rgba(75,85,99,0.7)]">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-lake">작성 내용</p>
                          <p className="whitespace-pre-line text-sm font-semibold leading-7 text-foreground">{item.message || "남긴 내용이 없습니다."}</p>
                        </div>

                        <section className="border border-foreground/10 bg-foam/55 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <ChatCenteredText aria-hidden="true" className="h-4 w-4 text-lake" weight="bold" />
                            <h3 className="text-sm font-semibold text-foreground">댓글</h3>
                            <span className="text-xs font-semibold text-foreground/48">{item.replies.length}개</span>
                          </div>

                          {item.replies.length > 0 ? (
                            <div className="mt-3 grid gap-2">
                              {item.replies.map((reply) => {
                                const tone = replyToneClass(reply.authorType);

                                return (
                                  <article key={reply.id} className={`border-l-4 px-3 py-2 ${tone.article}`}>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className={`text-xs font-semibold ${tone.label}`}>
                                        {reply.authorType === "admin" ? "관리자" : "고객"} 댓글
                                      </p>
                                      <time dateTime={reply.createdAt} className="numeric text-xs font-semibold text-foreground/48">
                                        {formatKoreaDate(reply.createdAt)}
                                      </time>
                                    </div>
                                    <p className="mt-1 whitespace-pre-line">{reply.message}</p>
                                  </article>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-foreground/52">아직 댓글이 없습니다.</p>
                          )}
                        </section>
                      </div>
                    </div>

                    <div className="grid self-start gap-3">
                      <form action={updateAdminReservationAction} className="grid gap-3 border border-foreground/10 bg-foam/70 p-3">
                        <input type="hidden" name="id" value={item.id} />
                        <label className="block">
                          <span className="text-sm font-semibold text-foreground">상태값</span>
                          <select
                            name="status"
                            defaultValue={item.status}
                            className={`mt-2 w-full border px-3 py-2.5 text-sm font-semibold outline-none focus:border-lake focus:ring-2 focus:ring-lake/16 ${statusSelectClass(item.status)}`}
                          >
                            {reservationStatuses.map((status) => (
                              <option key={status} value={status}>
                                {getStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-sm font-semibold text-foreground">새 관리자 답글</span>
                          <textarea
                            name="adminNote"
                            placeholder="새 관리자 답글을 입력하세요."
                            rows={4}
                            className="mt-2 w-full resize-y border border-foreground/14 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none focus:border-lake focus:ring-2 focus:ring-lake/16"
                          />
                        </label>

                        <button
                          type="submit"
                          className="spring inline-flex items-center justify-center gap-2 bg-sun px-4 py-2.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-sunset hover:text-white"
                        >
                          <NotePencil aria-hidden="true" className="h-4 w-4" weight="bold" />
                          저장
                        </button>
                      </form>

                      <AdminReservationDeleteForm id={item.id} action={deleteAdminReservationAction} />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-foreground/12 bg-surface px-5 py-16 text-center">
                <p className="text-lg font-semibold">예약 문의가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
