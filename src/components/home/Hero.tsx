import Image from "next/image";
import { ArrowRight, PhoneCall } from "@phosphor-icons/react/ssr";
import { phoneHref } from "@/lib/site-data";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground">
      <div className="reveal relative min-h-[calc(100svh-7rem)] overflow-hidden bg-mist sm:min-h-[82svh]">
        <Image
          src="/images/hero-sunset-boat.webp"
          alt="청풍호 석양을 가로지르는 모터보트"
          fill
          preload
          loading="eager"
          sizes="100vw"
          className="hero-kenburns object-cover object-[58%_50%]"
        />
        <div className="relative z-10 mx-auto min-h-[calc(100svh-7rem)] max-w-[1440px] px-5 pb-8 pt-24 sm:min-h-[82svh] sm:px-8 sm:pt-20 lg:px-12">
          <div className="mt-0 max-w-[36rem] rounded-[1.5rem] border border-surface/70 bg-surface/64 p-4 shadow-[0_18px_62px_-52px_rgba(7,59,58,0.42)] backdrop-blur-sm sm:p-5 lg:mt-0 lg:max-w-[31rem] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
            <h1 className="headline-tight text-balance break-keep-all text-[2.1rem] font-black leading-[1.04] sm:text-5xl lg:text-[3.05rem] lg:[text-shadow:0_2px_24px_rgba(255,253,250,0.9)]">
              제천 청풍호에서 즐기는
              <span className="block">수상레저와 ATV</span>
            </h1>
            <p className="text-pretty mt-4 max-w-lg break-keep-all text-sm leading-6 text-ink-muted sm:text-base sm:leading-7 lg:max-w-[29rem] lg:font-semibold lg:text-foreground/78 lg:[text-shadow:0_1px_18px_rgba(255,253,250,0.92)]">
              청풍호의 물살 위 수상레저와 호반 산길을 달리는 ATV를 한곳에서 즐겨보세요. 인원과 일정에 맞춰 알맞은 코스를 안내해 드립니다.
            </p>

            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href={phoneHref}
                className="spring group inline-flex items-center justify-center gap-3 rounded-full border border-sun bg-sun px-6 py-3 text-sm font-extrabold text-white shadow-[0_0_28px_rgba(225,93,50,0.2)] hover:scale-[1.02] hover:border-sunset hover:bg-sunset hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sun focus:ring-offset-2 focus:ring-offset-surface sm:py-3.5 sm:text-base"
              >
                <PhoneCall aria-hidden="true" className="h-5 w-5" weight="bold" />
                전화예약 바로하기
                <span className="grid h-8 w-8 place-items-center rounded-full bg-surface/20">
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" weight="bold" />
                </span>
              </a>
              <a
                href="/water-ski-atv#location"
                className="spring inline-flex items-center justify-center rounded-full border border-lake bg-lake px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_-24px_rgba(7,59,58,0.72)] hover:scale-[1.02] hover:border-forest hover:bg-forest hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-lake focus:ring-offset-2 focus:ring-offset-surface sm:py-3.5 sm:text-base"
              >
                찾아오시는 길
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
