import { ArrowRight, CheckCircle, Clock, PhoneCall, ShieldCheck } from "@phosphor-icons/react/ssr";
import { DepositAccountGuide } from "@/components/reservation/DepositAccountGuide";
import { phoneHref, refundRules, reservationFields, reservationSteps, safetyNotes } from "@/lib/site-data";
import { SectionHeading } from "./SectionHeading";

export function ReservationGuide() {
  return (
    <section id="reservation" className="depth-mint bg-foam px-5 py-14 text-foreground lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-foreground/12 pb-8">
          <div className="max-w-4xl">
            <SectionHeading
              as="h1"
              eyebrow="Reservation"
              title="예약 전 확인할 내용을 한눈에 정리했습니다"
              description="운영 시간, 예약금, 준비 항목, 환불 기준을 먼저 확인한 뒤 전화 또는 예약게시판으로 일정을 남겨 주세요."
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.65fr)]">
          <article className="border border-mist bg-white p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-bold">
                  <Clock aria-hidden="true" className="h-6 w-6 text-sun" weight="bold" />
                  예약 전 확인할 내용
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">
                  예약금 50,000원 선입금 후 예약자 정보와 이용하실 레저를 남겨 주세요. ATV와 수상레저 계좌가 다르므로 입금 전 종목별 계좌를 먼저 확인해 주세요.
                </p>
              </div>
              <a
                href={phoneHref}
                className="spring group inline-flex w-fit shrink-0 items-center gap-3 whitespace-nowrap border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white active:scale-[0.98]"
              >
                <PhoneCall aria-hidden="true" className="h-4 w-4 shrink-0" weight="bold" />
                예약 가능 시간 확인
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5" weight="bold" />
              </a>
            </div>

            <dl className="mt-7 grid gap-3 md:grid-cols-3">
              <div className="border border-lake/14 bg-foam px-4 py-4">
                <dt className="text-xs font-bold uppercase text-lake">운영 시간</dt>
                <dd className="numeric mt-2 text-lg font-extrabold">09:00 - 19:00</dd>
              </div>
              <div className="border border-lake/14 bg-foam px-4 py-4">
                <dt className="text-xs font-bold uppercase text-lake">예약금</dt>
                <dd className="numeric mt-2 text-lg font-extrabold">50,000원</dd>
              </div>
              <div className="border border-lake/14 bg-foam px-4 py-4">
                <dt className="text-xs font-bold uppercase text-lake">단체 예약</dt>
                <dd className="mt-2 text-lg font-extrabold">10인 이상 문의</dd>
              </div>
            </dl>

            <div className="mt-7 border-t border-mist pt-6">
              <p className="text-sm font-bold text-foreground">예약 시 준비 항목</p>
              <ul className="mt-3 grid gap-2 text-sm font-bold text-ink-muted sm:grid-cols-2 lg:grid-cols-4">
                {reservationFields.map((field) => (
                  <li key={field} className="border border-mist bg-white px-3 py-2">
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="border border-mist bg-white p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist pb-5">
              <h2 className="flex items-center gap-3 text-2xl font-bold">
                <PhoneCall aria-hidden="true" className="h-6 w-6 text-lake" weight="bold" />
                예약 절차
              </h2>
              <span className="numeric border border-lake/18 bg-lake/8 px-3 py-1 text-xs font-bold text-lake">4단계</span>
            </div>
            <ol className="mt-6 grid gap-3">
              {reservationSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.75rem_1fr] items-start gap-4 border border-mist bg-foam px-4 py-3 text-sm leading-7 text-foreground/72">
                  <span className="numeric flex h-9 w-9 items-center justify-center border border-lake/18 bg-white text-sm font-bold text-lake">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="mt-5">
          <DepositAccountGuide />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
          <article className="border border-mist bg-white p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)] sm:p-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold">
              <ShieldCheck aria-hidden="true" className="h-6 w-6 text-sun" weight="bold" />
              안전 안내
            </h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {safetyNotes.map((note) => (
                <li key={note} className="flex gap-3 border border-mist bg-foam px-4 py-3 text-sm leading-7 text-foreground/72">
                  <CheckCircle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-lake" weight="bold" />
                  {note}
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-mist bg-white p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)] sm:p-8">
            <h2 className="text-2xl font-bold">환불규정</h2>
            <div className="mt-5 divide-y divide-mist border-y border-mist">
              {refundRules.map((rule) => (
                <dl key={rule.label} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                  <dt className="text-sm font-bold text-foreground/66">{rule.label}</dt>
                  <dd className="text-sm font-extrabold text-sunset">{rule.value}</dd>
                </dl>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
