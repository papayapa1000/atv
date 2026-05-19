"use client";

import { useActionState } from "react";
import { CalendarCheck, LockKey, NotePencil, PhoneCall } from "@phosphor-icons/react";
import { submitReservationDetailAction } from "@/app/reservation/board/[id]/actions";
import type {
  CustomerReservationDetail,
  ReservationBoardSummary,
  ReservationDetailActionState,
  ReservationReplyView,
} from "@/lib/reservations/public-types";
import { getStatusLabel } from "@/lib/reservations/validation";

type ReservationDetailClientProps = {
  summary: ReservationBoardSummary;
  initialState: ReservationDetailActionState;
};

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

function statusClass(status: string) {
  if (status === "confirmed") {
    return "border-lake bg-lake text-white";
  }

  if (status === "cancelled") {
    return "border-sun bg-sun text-white";
  }

  return "border-gray-300 bg-gray-100 text-gray-700";
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

function LockedReservationView({
  reservationId,
  state,
  formAction,
  pending,
}: {
  reservationId: string;
  state: ReservationDetailActionState;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  return (
    <div className="grid min-h-[18rem] w-full place-items-center">
      <h1 className="sr-only">예약글 확인</h1>
      <form action={formAction} className="w-full max-w-[22rem] border border-foreground/12 bg-surface p-5 lg:p-6">
        <input type="hidden" name="intent" value="verify" />
        <input type="hidden" name="id" value={reservationId} />
        <label className="block">
          <span className="text-sm font-bold text-foreground">글 비밀번호</span>
          <input
            type="password"
            name="password"
            required
            minLength={4}
            maxLength={30}
            className="mt-2 w-full border border-foreground/14 bg-white px-3 py-3 text-sm font-bold text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-sun/20"
          />
        </label>
        {state.status === "locked" && state.message ? (
          <p className="mt-3 text-sm font-bold text-sunset">{state.message}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="spring mt-5 inline-flex w-full items-center justify-center gap-2 border border-sun bg-sun px-4 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          <LockKey aria-hidden="true" className="h-4 w-4" weight="bold" />
          {pending ? "확인 중" : "확인"}
        </button>
      </form>
    </div>
  );
}

function RepliesList({ replies }: { replies: ReservationReplyView[] }) {
  if (replies.length === 0) {
    return <p className="text-sm leading-7 text-foreground/52">아직 추가 답글이 없습니다.</p>;
  }

  return (
    <div className="grid gap-2">
      {replies.map((reply) => {
        const tone = replyToneClass(reply.authorType);

        return (
          <article key={reply.id} className={`border border-foreground/10 !border-l-4 px-4 py-3 ${tone.article}`}>
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm font-bold ${tone.label}`}>{reply.authorType === "admin" ? "관리자" : "고객"} 답글</p>
              <time dateTime={reply.createdAt} className="numeric text-xs font-bold text-foreground/48">
                {formatKoreaDate(reply.createdAt)}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-foreground/68">{reply.message}</p>
          </article>
        );
      })}
    </div>
  );
}

function OpenReservationView({
  state,
  formAction,
  pending,
}: {
  state: Extract<ReservationDetailActionState, { status: "unlocked" }>;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  const post: CustomerReservationDetail = state.post;

  return (
    <article className="border border-foreground/12 bg-surface p-5 lg:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center border border-foreground/12 text-foreground/54">
          <LockKey aria-hidden="true" className="h-4 w-4" weight="bold" />
        </span>
        <h1 className="text-2xl font-bold sm:text-4xl">
          {post.customerName} <span className="text-foreground/48">님 예약글</span>
        </h1>
        <span className={`inline-flex border px-3 py-1.5 text-xs font-bold ${statusClass(post.status)}`}>
          {getStatusLabel(post.status)}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 text-sm leading-7 text-foreground/68 md:grid-cols-2">
        <div className="flex gap-3">
          <PhoneCall aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-lake" weight="bold" />
          <div>
            <dt className="font-bold text-foreground">연락처</dt>
            <dd className="numeric">{post.phone}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <CalendarCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-lake" weight="bold" />
          <div>
            <dt className="font-bold text-foreground">예약 일정</dt>
            <dd>{post.reservationSummary}</dd>
          </div>
        </div>
        <div>
          <dt className="font-bold text-foreground">이용레저</dt>
          <dd>{post.leisureType}</dd>
        </div>
        <div>
          <dt className="font-bold text-foreground">입금자명</dt>
          <dd>{post.depositorName || "미입력"}</dd>
        </div>
      </dl>

      <section className="mt-6 border border-foreground/10 bg-surface-muted/52 p-4 text-sm leading-7 text-foreground/72">
        <div className="border border-foreground/10 bg-white p-4">
          <p className="mb-2 font-bold text-foreground">작성 내용</p>
          <p className="whitespace-pre-line">{post.message || "남긴 내용이 없습니다."}</p>
        </div>

        <div className="mt-5 border-t border-foreground/10 pt-4">
          <RepliesList replies={state.replies} />
        </div>

        <form action={formAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <input type="hidden" name="intent" value="reply" />
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="password" value={state.password} />
          <label className="block">
            <span className="text-sm font-bold text-foreground">답글 작성</span>
            <textarea
              name="message"
              required
              maxLength={1000}
              rows={3}
              className="mt-2 w-full resize-y border border-foreground/14 bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-sun/20"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="spring inline-flex h-[3.25rem] items-center justify-center gap-2 border border-sun bg-sun px-5 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
          >
            <NotePencil aria-hidden="true" className="h-4 w-4" weight="bold" />
            {pending ? "저장 중" : "저장"}
          </button>
        </form>

        {state.replyError ? <p className="mt-3 text-sm font-bold text-sunset">{state.message}</p> : null}
        {state.message && !state.replyError ? <p className="mt-3 text-sm font-bold text-lake">{state.message}</p> : null}
      </section>
    </article>
  );
}

export function ReservationDetailClient({ summary, initialState }: ReservationDetailClientProps) {
  const [state, formAction, pending] = useActionState(submitReservationDetailAction, initialState);

  if (state.status === "unlocked") {
    return <OpenReservationView state={state} formAction={formAction} pending={pending} />;
  }

  return <LockedReservationView reservationId={summary.id} state={state} formAction={formAction} pending={pending} />;
}
