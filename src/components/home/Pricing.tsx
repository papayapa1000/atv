import { ArrowRight, PhoneCall } from "@phosphor-icons/react/ssr";
import { phoneHref, phoneNumber, pricingGroups } from "@/lib/site-data";
import { SectionHeading } from "./SectionHeading";

export function Pricing() {
  return (
    <section id="pricing" className="depth-warm bg-background px-5 py-18 text-foreground lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Price"
              title="기본 요금은 명확하게, 묶음 일정은 전화로 빠르게"
              description="초보 강습, 장비 대여, 놀이기구 코스 기준은 종목마다 다릅니다. 여러 종목을 함께 이용하거나 단체 방문이라면 전화로 인원과 시간을 맞추는 편이 빠릅니다."
            />
            <a
              href={phoneHref}
              className="spring group mt-8 inline-flex items-center gap-3 border border-sun bg-sun px-6 py-3.5 text-base font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sun focus:ring-offset-2 focus:ring-offset-background"
            >
              <PhoneCall aria-hidden="true" className="h-5 w-5" weight="bold" />
              {phoneNumber}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" weight="bold" />
            </a>
            <div className="depth-surface depth-panel-quiet mt-8 border border-mist bg-surface p-6">
              <p className="text-xl font-bold leading-snug text-foreground">성수기와 주말은 시간대가 빠르게 찹니다</p>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                원하는 종목, 인원, 방문 시간을 정해두고 전화하면 예약 가능 여부를 바로 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="depth-surface depth-panel-quiet bg-surface text-foreground">
            {pricingGroups.map((group, index) => (
              <article key={group.title} className="grid gap-0 border-b border-mist last:border-b-0 sm:grid-cols-[0.38fr_0.62fr]">
                <div className="border-b border-mist p-6 sm:border-b-0 sm:border-r sm:p-7">
                  <p className="numeric text-xs font-bold text-lake">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-2xl font-bold text-foreground">{group.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink-muted">{group.note}</p>
                </div>
                <ul className="grid content-center">
                  {group.items.map((item) => (
                    <li key={item} className="numeric flex items-center justify-between gap-4 border-b border-mist px-6 py-4 text-sm font-bold text-foreground last:border-b-0 sm:px-7">
                      {item}
                      <span className="h-px w-8 shrink-0 bg-sun" />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
