"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall, Waves } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { phoneHref } from "@/lib/site-data";

const serviceTabs = [
  {
    title: "수상스키",
    image: "/images/activity-water-ski.webp",
    prices: ["초보강습 80,000원", "아웃보트 28,000원", "매직보트 33,000원"],
    note: "지상교육, 봉 1회, 로프 1회와 장비 무상대여를 포함합니다.",
    href: "/activities#water-ski",
  },
  {
    title: "웨이크보드",
    image: "/images/activity-wakeboard.webp",
    prices: ["초보강습 80,000원", "아웃보트 28,000원", "매직보트 33,000원"],
    note: "수상스키와 같은 초보강습 및 장비 무상대여 기준으로 운영합니다.",
    href: "/activities#wakeboard",
  },
  {
    title: "플라이피쉬",
    image: "/images/activity-flyfish-1.webp",
    prices: ["1인 기준 25,000원"],
    note: "물살과 바람을 동시에 받으며 강한 공중감을 즐기는 코스입니다.",
    href: "/activities#flyfish",
  },
  {
    title: "바나나보트",
    image: "/images/activity-banana-boat.webp",
    prices: ["1인 기준 20,000원"],
    note: "가족, 친구, 단체가 함께 웃으며 타기 좋은 기본 놀이기구입니다.",
    href: "/activities#banana-boat",
  },
  {
    title: "땅콩보트",
    image: "/images/activity-peanut-boat.webp",
    prices: ["1인 기준 20,000원"],
    note: "낮은 자세로 물살을 가까이 느끼며 속도감을 즐깁니다.",
    href: "/activities#peanut-boat",
  },
  {
    title: "빅마블",
    image: "/images/activity-big-marble.webp",
    prices: ["1인 기준 20,000원"],
    note: "회전감과 튀어 오르는 움직임이 강한 인기 놀이기구입니다.",
    href: "/activities#big-marble",
  },
  {
    title: "자이언트마블",
    image: "/images/activity-giant-marble.webp",
    prices: ["1인 기준 20,000원"],
    note: "더 큰 탑승감으로 물살 위 움직임을 크게 느낄 수 있습니다.",
    href: "/activities#giant-marble",
  },
  {
    title: "G-Ral",
    image: "/images/activity-g-ral.webp",
    prices: ["1인 기준 20,000원"],
    note: "강한 방향 전환과 빠른 견인감이 중심인 스릴형 놀이기구입니다.",
    href: "/activities#g-ral",
  },
  {
    title: "핵사곤",
    image: "/images/activity-hexagon.webp",
    prices: ["1인 기준 20,000원"],
    note: "여럿이 함께 타기 좋아 단체 일정에 넣기 좋은 코스입니다.",
    href: "/activities#hexagon",
  },
  {
    title: "모터보트",
    image: "/images/motorboat.webp",
    prices: ["실버 60,000원", "골드 120,000원"],
    note: "청풍호 풍경을 빠르게 둘러보는 보트 투어입니다.",
    href: "/activities#motorboat",
  },
  {
    title: "ATV",
    image: "/images/atv-lakeside.webp",
    prices: ["1인용 30,000원", "2인용 버기카 60,000원"],
    note: "안전교육을 진행하고 레저보험에 가입되어 있어 안전하게 이용할 수 있습니다.",
    href: "/activities#atv",
  },
];

type ServiceTab = (typeof serviceTabs)[number];

const defaultServiceTitle = "플라이피쉬";
const defaultService = serviceTabs.find((item) => item.title === defaultServiceTitle) ?? serviceTabs[0]!;

function MobileQuickInfoDetail({ labelledBy, panelId, service }: { labelledBy: string; panelId: string; service: ServiceTab }) {
  return (
    <motion.div
      id={panelId}
      role="region"
      aria-labelledby={labelledBy}
      data-mobile-quick-info-panel
      data-active="true"
      data-motion-skip
      initial={{ height: 0, opacity: 0, y: -12, scaleY: 0.96 }}
      animate={{ height: "auto", opacity: 1, y: 0, scaleY: 1 }}
      exit={{ height: 0, opacity: 0, y: -12, scaleY: 0.96 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden lg:hidden"
    >
      <div className="origin-top rounded-[1.35rem] border border-sun/24 bg-surface p-4 shadow-[0_18px_34px_-28px_rgba(4,37,33,0.42)]">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun/12 text-sun">
            <Waves aria-hidden="true" className="h-5 w-5" weight="bold" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-black">{service.title}</h3>
            <p className="mt-2 break-keep-all text-sm leading-7 text-ink-muted">{service.note}</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-mist border-y border-mist">
          {service.prices.map((price) => (
            <div key={price} className="numeric flex items-center justify-between gap-4 py-3 text-sm font-extrabold">
              <span>{price}</span>
            </div>
          ))}
        </div>
        <Link
          href={service.href}
          className="spring mt-4 inline-flex w-full items-center justify-between gap-3 rounded-full bg-lake px-5 py-3 text-sm font-extrabold text-white hover:bg-forest hover:text-white active:scale-[0.98]"
        >
          선택 종목 자세히 보기
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface/20">
            <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

function DesktopQuickInfoPanel({ service }: { service: ServiceTab }) {
  return (
    <div className="bezel depth-panel hidden rounded-[2rem] bg-surface/72 p-1.5 lg:col-span-7 lg:block">
      <div id="quick-info-desktop-panel" aria-live="polite" className="depth-surface grid overflow-hidden rounded-[1.65rem] border border-mist bg-surface md:grid-cols-[0.92fr_1.08fr]">
        <div className="p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sun/12 text-sun">
              <Waves aria-hidden="true" className="h-6 w-6" weight="bold" />
            </span>
            <div>
              <h3 className="text-3xl font-black">{service.title}</h3>
            </div>
          </div>
          <p className="mt-6 break-keep-all text-base leading-8 text-ink-muted">{service.note}</p>
          <div className="mt-7 divide-y divide-mist border-y border-mist">
            {service.prices.map((price) => (
              <div key={price} className="numeric flex items-center justify-between gap-4 py-4 text-sm font-extrabold">
                <span>{price}</span>
              </div>
            ))}
          </div>
          <Link
            href={service.href}
            className="spring mt-7 inline-flex items-center gap-3 rounded-full bg-lake px-6 py-3 text-sm font-extrabold text-white hover:scale-[1.02] hover:bg-forest hover:text-white active:scale-[0.98]"
          >
            선택 종목 자세히 보기
            <span className="grid h-7 w-7 place-items-center rounded-full bg-surface/20">
              <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
            </span>
          </Link>
        </div>
        <div className="image-lift relative min-h-[320px] bg-mist md:min-h-full">
          <Image src={service.image} alt={`${service.title} 이용 장면`} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

export function QuickInfo() {
  const [selectedTitle, setSelectedTitle] = useState(defaultServiceTitle);
  const [openMobileTitle, setOpenMobileTitle] = useState<string | null>(defaultServiceTitle);
  const featured = serviceTabs.find((item) => item.title === selectedTitle) ?? defaultService;

  const handleServiceClick = (title: string) => {
    setSelectedTitle(title);
    setOpenMobileTitle((currentTitle) => (currentTitle === title ? null : title));
  };

  return (
    <section className="depth-mint bg-foam px-5 py-24 text-foreground lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <div className="bezel depth-panel rounded-[2rem] bg-surface/72 p-1.5 text-foreground lg:col-span-5 lg:row-span-2">
            <div className="depth-surface h-full rounded-[1.65rem] border border-mist bg-surface p-7 sm:p-9">
              <p className="supanova-badge inline-flex px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]">Course Finder</p>
              <h2 className="headline-tight mt-6 break-keep-all text-4xl font-black leading-[1.08] sm:text-5xl">
                종목별 요금과 코스를 확인하세요
              </h2>
              <p className="mt-5 max-w-md break-keep-all text-base leading-8 text-ink-muted">
                강습, 단체 놀이기구, 보트 투어, ATV는 준비 시간과 동선이 다릅니다. 아래에서 목적을 고른 뒤 바로 상담하면 가장 빠릅니다.
              </p>

              <div aria-label="종목별 코스 목록" className="mt-8 grid gap-2 [scrollbar-width:thin] lg:max-h-[18rem] lg:overflow-y-auto lg:pr-2">
                {serviceTabs.map((item, index) => {
                  const isSelected = item.title === featured.title;
                  const isMobileOpen = item.title === openMobileTitle;
                  const activeButtonClasses = "border-sun bg-sun text-white shadow-[0_0_30px_rgba(225,93,50,0.24)]";
                  const idleButtonClasses = "border-mist bg-foam text-foreground/72 hover:border-lake/26 hover:bg-surface-muted hover:text-lake";
                  const triggerId = `quick-info-trigger-${index}`;
                  const panelId = `quick-info-mobile-panel-${index}`;

                  return (
                    <div key={item.title} className="grid gap-2">
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isMobileOpen}
                        aria-controls={panelId}
                        onClick={() => handleServiceClick(item.title)}
                        className={`spring group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-full border px-3 py-3 text-left text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-lake/30 ${
                          isMobileOpen ? activeButtonClasses : idleButtonClasses
                        } ${isSelected ? "lg:border-sun lg:bg-sun lg:text-white lg:shadow-[0_0_30px_rgba(225,93,50,0.24)] lg:hover:border-sun lg:hover:bg-sun lg:hover:text-white" : ""}`}
                      >
                        <span className="numeric grid h-8 w-8 place-items-center rounded-full bg-surface/24 text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item.title}</span>
                        <ArrowRight
                          aria-hidden="true"
                          className={`h-4 w-4 transition-transform duration-300 ${isMobileOpen ? "rotate-90 lg:rotate-0" : ""}`}
                          weight="bold"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isMobileOpen ? <MobileQuickInfoDetail labelledBy={triggerId} panelId={panelId} service={item} /> : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DesktopQuickInfoPanel service={featured} />

          <div className="grid gap-5 lg:col-span-7 sm:grid-cols-2">
            <div className="depth-surface depth-panel-quiet rounded-[2rem] border border-mist bg-surface p-7">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="numeric text-4xl font-black text-foreground">09:00</p>
                  <p className="mt-2 text-sm font-bold text-lake">오픈 시간</p>
                </div>
                <div>
                  <p className="numeric text-4xl font-black text-foreground">19:00</p>
                  <p className="mt-2 text-sm font-bold text-lake">마감 시간</p>
                </div>
              </div>
              <p className="mt-5 break-keep-all text-sm leading-7 text-ink-muted">운영 시간은 09:00부터 19:00까지입니다. 성수기와 주말은 오전 시간대부터 빠르게 채워집니다.</p>
            </div>
            <a
              href={phoneHref}
              className="spring depth-panel-quiet group rounded-[2rem] border border-sun bg-sun p-7 text-white hover:scale-[1.02] hover:border-sunset hover:bg-sunset hover:text-white active:scale-[0.98]"
            >
              <PhoneCall aria-hidden="true" className="h-7 w-7" weight="bold" />
              <p className="mt-5 text-2xl font-black">전화로 시간 확인</p>
              <p className="mt-3 break-keep-all text-sm leading-7 text-white/78">종목, 인원, 방문 시간을 알려주시면 가능한 시간부터 바로 맞춥니다.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold">
                예약문의
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" weight="bold" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
