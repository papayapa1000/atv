import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck } from "@phosphor-icons/react/ssr";
import { ActivitiesScrollShowcase, type ActivityDetail } from "@/components/home/ActivitiesScrollShowcase";
import { DepositAccountGuide } from "@/components/reservation/DepositAccountGuide";
import { buildPageMetadata } from "@/lib/seo";
import { phoneHref } from "@/lib/site-data";

const activityItems: ActivityDetail[] = [
  {
    id: "water-ski",
    title: "수상스키",
    english: "Water Skiing",
    category: "Water Sports",
    image: "/images/activity-water-ski.webp",
    alt: "청풍호 수상스키 장비",
    quote: "초보자도 물 위에 설 수 있도록 차근차근 맞춰 드리는 강습 코스입니다.",
    description:
      "보트의 견인력을 이용해 물 위를 활주하는 대표 수상 스포츠입니다. 초보강습은 지상교육, 봉 1회, 로프 1회와 장비 무상대여를 포함하며 아웃보트와 매직보트도 장비를 무상으로 대여할 수 있습니다.",
    prices: [
      { label: "초보강습", value: "80,000원", note: "지상교육, 봉 1회, 로프 1회, 장비 무상대여" },
      { label: "아웃보트", value: "28,000원", note: "무상장비 대여 가능" },
      { label: "매직보트", value: "33,000원", note: "무상장비 대여 가능" },
      { label: "안내", value: "패키지요금 별도 문의" },
    ],
  },
  {
    id: "wakeboard",
    title: "웨이크보드",
    english: "Wakeboarding",
    category: "Water Sports",
    image: "/images/activity-wakeboard.webp",
    alt: "청풍호 웨이크보드와 수상 장비",
    quote: "지상교육부터 로프 주행까지 처음 배우는 분도 순서대로 준비합니다.",
    description:
      "웨이크보드는 보트가 만들어내는 물결을 이용해 하나의 보드 위에서 주행하는 수상 스포츠입니다. 수상스키와 동일하게 초보강습은 지상교육, 봉 1회, 로프 1회와 장비 무상대여를 포함하고 패키지 요금은 별도로 문의할 수 있습니다.",
    prices: [
      { label: "초보강습", value: "80,000원", note: "지상교육, 봉 1회, 로프 1회, 장비 무상대여" },
      { label: "아웃보트", value: "28,000원", note: "무상장비 대여 가능" },
      { label: "매직보트", value: "33,000원", note: "무상장비 대여 가능" },
      { label: "안내", value: "패키지요금 별도 문의" },
    ],
  },
  {
    id: "flyfish",
    title: "플라이피쉬",
    english: "Flyfish",
    category: "Water Ride",
    image: "/images/activity-flyfish-1.webp",
    alt: "플라이피쉬 수상 놀이기구",
    quote: "물살과 바람을 동시에 받으며 강한 공중감을 즐기는 코스입니다.",
    description:
      "짧은 시간 안에 선명한 스릴을 원하는 분에게 잘 맞는 놀이기구입니다. 탑승 전 안전 보호장비를 착용하고 현장 안내에 따라 이용합니다.",
    prices: [{ label: "1인 기준", value: "25,000원" }],
  },
  {
    id: "banana-boat",
    title: "바나나보트",
    english: "Banana Boat",
    category: "Water Ride",
    image: "/images/activity-banana-boat.webp",
    alt: "바나나보트를 즐기는 방문객",
    quote: "가족, 친구, 단체가 함께 웃으며 타기 좋은 기본 놀이기구입니다.",
    description:
      "수상 놀이기구를 처음 고르는 방문객에게 부담이 적은 코스입니다. 여러 명이 함께 탑승해 물살 위 속도감과 흔들림을 함께 즐길 수 있습니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "bandwagon",
    title: "밴드웨건",
    english: "Bandwagon",
    category: "Water Ride",
    image: "/images/activity-bandwagon.webp",
    alt: "밴드웨건 수상 놀이기구",
    quote: "넓은 탑승감과 빠른 견인감이 함께 있는 단체형 코스입니다.",
    description:
      "안정감 있는 탑승 형태에 속도감이 더해진 놀이기구입니다. 인원이 많거나 여러 종목을 묶는 일정에 함께 넣기 좋습니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "peanut-boat",
    title: "땅콩보트",
    english: "Peanut Boat",
    category: "Water Ride",
    image: "/images/activity-peanut-boat.webp",
    alt: "청풍호 수상 놀이기구 탑승 장면",
    quote: "낮은 자세로 물살을 가까이 느끼며 속도감을 즐깁니다.",
    description:
      "가볍게 시작하면서도 물살을 가까이 느끼고 싶은 방문객에게 맞습니다. 현장 상황과 탑승 인원에 맞춰 안전하게 운영합니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "big-marble",
    title: "빅마블",
    english: "Big Marble",
    category: "Water Ride",
    image: "/images/activity-big-marble.webp",
    alt: "빅마블 수상 놀이기구",
    quote: "회전감과 튀어 오르는 움직임이 강한 인기 놀이기구입니다.",
    description:
      "바나나보트보다 더 큰 자극을 원하는 분에게 적합합니다. 물살 위에서 방향 전환과 흔들림을 크게 느낄 수 있습니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "giant-marble",
    title: "자이언트마블",
    english: "Giant Marble",
    category: "Water Ride",
    image: "/images/activity-giant-marble.webp",
    alt: "자이언트마블 수상 놀이기구",
    quote: "더 큰 탑승감으로 물살 위 움직임을 크게 느낄 수 있습니다.",
    description:
      "여럿이 함께 강한 움직임을 즐기기 좋은 놀이기구입니다. 현장 상황과 인원에 따라 이용 가능 여부를 확인합니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "g-ral",
    title: "G-Ral",
    english: "Thrill Ride",
    category: "Water Ride",
    image: "/images/activity-g-ral.webp",
    alt: "스릴형 수상 놀이기구",
    quote: "강한 방향 전환과 빠른 견인감이 중심인 스릴형 놀이기구입니다.",
    description:
      "속도감과 방향 전환을 선명하게 느끼는 코스입니다. 탑승 전 안전요원 안내와 보호장비 착용을 반드시 확인합니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "hexagon",
    title: "핵사곤",
    english: "Hexagon",
    category: "Water Ride",
    image: "/images/activity-hexagon.webp",
    alt: "핵사곤 수상 놀이기구",
    quote: "여럿이 함께 타기 좋아 단체 일정에 넣기 좋은 코스입니다.",
    description:
      "단체 방문객이 함께 즐기기 좋은 수상 놀이기구입니다. 다른 놀이기구와 묶는 패키지 구성은 방문 인원에 따라 별도 문의로 안내합니다.",
    prices: [{ label: "1인 기준", value: "20,000원" }],
  },
  {
    id: "motorboat",
    title: "모터보트",
    english: "Motor Boat",
    category: "Boat Tour",
    image: "/images/motorboat.webp",
    alt: "청풍호 모터보트",
    quote: "청풍호 풍경을 가장 빠르고 선명하게 둘러보는 보트 투어입니다.",
    description:
      "실버코스와 골드코스로 나뉘며 4인 기준 요금으로 안내합니다. 수상 놀이기구와는 다른 풍경 투어 성격의 코스로, 청풍호의 물길과 산세를 빠르게 둘러볼 수 있습니다.",
    prices: [
      { label: "실버코스", value: "60,000원", note: "4인 기준" },
      { label: "골드코스", value: "120,000원", note: "4인 기준" },
    ],
  },
  {
    id: "atv",
    title: "ATV",
    english: "Trail Ride",
    category: "Trail Ride",
    image: "/images/atv-lakeside.webp",
    alt: "청풍호 주변 ATV 주행",
    quote: "안전교육 및 레저보험이 가입되어 있어 안전합니다.",
    description:
      "수상레저 전후로 이어가기 좋은 육상 액티비티입니다. 1인용 ATV와 2인용 버기카로 나뉘며, 이용 전 안전교육을 진행하고 레저보험에 가입되어 있어 안전하게 이용할 수 있습니다.",
    prices: [
      { label: "1인용", value: "30,000원" },
      { label: "2인용 버기카", value: "60,000원" },
    ],
  },
];

const reservationNotes = [
  "운행시간은 오전 09:00부터 오후 19:00까지입니다.",
  "10인 이상 단체는 성수기, 주말, 연휴 기간에 미리 예약하는 것이 좋습니다.",
  "시즌기간인 6월부터 8월에는 연휴나 주말 전 사전 예약을 권장합니다.",
  "패키지 요금은 이용 종목과 인원에 따라 별도 문의로 안내합니다.",
];

const safetyNotes = [
  "안전수칙을 충분히 숙지하고 안전요원의 안내에 따라 이용합니다.",
  "구명조끼 등 안전 보호장비를 반드시 착용합니다.",
  "식후 또는 음주 후에는 수상레저 활동을 자제합니다.",
  "충분한 준비운동 후 이용하고, 인원 추가 시 미리 알려 주세요.",
];

const refundRows = [
  ["5일 전 취소", "전액 환불"],
  ["1일-4일 전 취소", "50% 환불"],
  ["당일 취소", "환불 불가"],
];

export const metadata = buildPageMetadata({
  title: "즐길거리",
  description: "수상스키, 웨이크보드, 수상 놀이기구, 모터보트, ATV 이용요금과 예약안내를 확인하세요.",
  path: "/activities",
  image: {
    path: "/images/activity-water-ski.webp",
    width: 1080,
    height: 720,
    alt: "청풍호 수상스키 장비",
  },
  keywords: ["제천 수상 놀이기구", "제천 모터보트", "청풍호 웨이크보드"],
});

export default function ActivitiesPage() {
  return (
    <main className="bg-background text-foreground">
      <ActivitiesScrollShowcase items={activityItems} phoneHref={phoneHref} />

      <section id="reservation" className="depth-surface scroll-mt-32 bg-surface px-5 py-18 text-foreground lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="inline-flex border-b border-lake/18 pb-2 text-xs font-bold uppercase text-sun">Reservation</p>
            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">예약 전 확인할 내용</h2>
          </div>

          <div className="mb-6">
            <DepositAccountGuide headingLevel="h3" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <InfoPanel icon={<CalendarCheck aria-hidden="true" className="h-7 w-7 text-sun" weight="bold" />} title="예약안내" items={reservationNotes} />
            <InfoPanel icon={<ShieldCheck aria-hidden="true" className="h-7 w-7 text-sun" weight="bold" />} title="안전수칙" items={safetyNotes} />
            <div className="depth-surface depth-panel-quiet depth-panel-bottom-shadow border border-mist bg-surface p-6 sm:p-8">
              <h3 className="text-2xl font-bold">환불규정</h3>
              <div className="mt-6 divide-y divide-mist border-y border-mist">
                {refundRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-5 py-4 text-sm">
                    <span className="text-ink-muted">{label}</span>
                    <strong className="text-sun">{value}</strong>
                  </div>
                ))}
              </div>
              <Link
                href="/reservation"
                className="spring mt-8 inline-flex items-center gap-2 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:border-sunset hover:bg-sunset hover:text-white"
              >
                예약 페이지 보기
                <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoPanel({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="depth-surface depth-panel-quiet depth-panel-bottom-shadow border border-mist bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <ul className="mt-6 space-y-4 text-sm leading-7 text-ink-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
