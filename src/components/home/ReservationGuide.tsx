import { ArrowRight, CheckCircle, Clock, PhoneCall, ShieldCheck } from "@phosphor-icons/react/ssr";
import { phoneHref, refundRules, reservationFields, reservationSteps, safetyNotes } from "@/lib/site-data";
import { SectionHeading } from "./SectionHeading";

export function ReservationGuide() {
  return (
    <section id="reservation" className="bg-lake px-5 py-16 text-white lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Reservation"
              title="예약금과 이용 정보를 확인하면 일정이 빠르게 확정됩니다"
              description="운영 시간은 07:00부터 19:00까지이며, 예약 시 50,000원 선입금 후 게시판 또는 전화로 이용 정보를 확인합니다."
              tone="dark"
            />
            <div className="mt-8 border border-white/20 bg-white p-6 text-foreground shadow-[0_24px_50px_-32px_rgba(7,59,58,0.78)]">
              <div className="flex items-center gap-3">
                <Clock aria-hidden="true" className="h-5 w-5 text-sun" weight="bold" />
                <p className="numeric text-lg font-bold">운영시간 07:00 - 19:00</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                예약금 50,000원 선입금 후 예약자 정보와 이용하실 레저를 남겨 주세요. 기상과 현장 운영 상황에 따라 시간이 변경될 수 있어 방문 전 전화 확인을 권장합니다.
              </p>
              <div className="mt-6 border-t border-lake/14 pt-5">
                <p className="text-sm font-bold text-foreground">예약 시 준비 항목</p>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm font-bold text-ink-muted">
                  {reservationFields.map((field) => (
                    <li key={field} className="border border-sun/28 bg-sun/12 px-3 py-2 text-deep">
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={phoneHref}
                className="spring group mt-6 inline-flex items-center gap-3 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-lake hover:text-white active:scale-[0.98]"
              >
                <PhoneCall aria-hidden="true" className="h-4 w-4" weight="bold" />
                예약 가능 시간 확인
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" weight="bold" />
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="bg-white/95 p-6 text-foreground shadow-[0_22px_46px_-32px_rgba(7,59,58,0.74)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lake/14 pb-5">
                <h3 className="flex items-center gap-3 text-xl font-bold">
                  <PhoneCall aria-hidden="true" className="h-5 w-5 text-sun" weight="bold" />
                  예약 절차
                </h3>
                <span className="numeric border border-sun/28 bg-sun/12 px-3 py-1 text-xs font-bold text-sunset">4단계</span>
              </div>
              <ol className="mt-6 grid gap-3">
                {reservationSteps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[2.75rem_1fr] items-start gap-4 border border-lake/14 bg-lake/8 px-4 py-3 text-sm leading-7 text-foreground/72">
                    <span className="numeric flex h-9 w-9 items-center justify-center border border-sun/28 bg-white text-sm font-bold text-sunset">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="border border-sun/30 bg-sun/12 p-5 text-foreground shadow-[0_18px_38px_-30px_rgba(185,79,49,0.64)] sm:p-7">
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-sun" weight="bold" />
                안전 안내
              </h3>
              <ul className="mt-5 grid gap-3">
                {safetyNotes.map((note) => (
                  <li key={note} className="flex gap-3 border border-sun/20 bg-white px-4 py-3 text-sm leading-7 text-foreground/72">
                    <CheckCircle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sun" weight="bold" />
                    {note}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 border border-white/18 shadow-[0_20px_44px_-30px_rgba(7,59,58,0.82)] md:grid-cols-3">
          {refundRules.map((rule) => (
            <dl key={rule.label} className="border-b border-lake/12 bg-white p-6 text-foreground last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <dt className="text-sm font-bold text-sunset">{rule.label}</dt>
              <dd className="mt-3 text-2xl font-bold text-lake">{rule.value}</dd>
            </dl>
          ))}
        </div>
      </div>
    </section>
  );
}
