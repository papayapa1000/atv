import Image from "next/image";
import { ArrowRight, MapPin } from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/home/SectionHeading";
import { NearbySlider, type NearbySpot } from "@/components/home/NearbySlider";
import { buildPageMetadata } from "@/lib/seo";

const venueAddress = "충북 제천시 금성면 청풍호로 1542-5";
const encodedAddress = encodeURIComponent(venueAddress);

const nearbySpots: NearbySpot[] = [
  {
    title: "청풍호반케이블카",
    description: "비봉산 정상까지 올라 청풍호와 산세를 한눈에 보는 대표 전망 코스입니다.",
    image: "/images/cheongpung-cable-car.webp",
    alt: "청풍호반케이블카와 청풍호 전경",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=3727&menuLevel=3&menuNo=16",
  },
  {
    title: "청풍문화유산단지",
    description: "청풍호를 배경으로 전통 건축과 산책길을 함께 둘러보는 가족 코스입니다.",
    image: "/images/cheongpung-cultural-heritage.webp",
    alt: "청풍문화유산단지와 청풍호 전경",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=10&menuLevel=3&menuNo=67",
  },
  {
    title: "청풍랜드",
    description: "청풍호 주변에서 번지점프와 수변 산책 분위기를 함께 느낄 수 있는 명소입니다.",
    image: "/images/cheongpung-land.webp",
    alt: "청풍랜드 분수와 시설",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=27&menuLevel=3&menuNo=18",
  },
  {
    title: "청풍호유람선",
    description: "물 위에서 보는 청풍호 풍경을 여유 있게 즐기는 휴식형 코스입니다.",
    image: "/images/cheongpung-cruise.webp",
    alt: "청풍호유람선 운행 모습",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=3780&menuLevel=3&menuNo=95",
  },
  {
    title: "옥순봉 출렁다리",
    description: "청풍호 물길과 옥순봉 절경을 가까이 보는 산책형 명소입니다.",
    image: "/images/oksunbong-bridge.webp",
    alt: "옥순봉 출렁다리와 청풍호 풍경",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=94203&menuLevel=3&menuNo=852",
  },
  {
    title: "비봉산",
    description: "청풍호를 내려다보는 능선 전망이 좋아 드라이브 일정에 붙이기 좋습니다.",
    image: "/images/bibongsan.webp",
    alt: "비봉산에서 바라본 청풍호 풍경",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=336&menuLevel=3&menuNo=52",
  },
  {
    title: "청풍호 자드락길",
    description: "호수와 숲길을 따라 걷는 완만한 코스로 레저 전후 가볍게 들르기 좋습니다.",
    image: "/images/jadrakgil.webp",
    alt: "청풍호 자드락길 산책로",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=133&menuLevel=3&menuNo=54",
  },
  {
    title: "능강구곡",
    description: "계곡 물소리와 숲길이 이어지는 여름철 휴식 코스입니다.",
    image: "/images/neunggang-valley.webp",
    alt: "능강구곡 계곡 풍경",
    href: "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=18&menuLevel=3&menuNo=53",
  },
];

const transportGuides = [
  {
    title: "주소",
    lines: [venueAddress],
  },
  {
    title: "자가용 이용 시",
    lines: [
      "내비게이션 주소: 충북 제천시 금성면 청풍호로 1542-5",
      "청풍호·금성면 방면 도로를 따라 진입합니다.",
    ],
  },
  {
    title: "버스 이용 시",
    lines: [
      "동서울터미널(강변역) 또는 서울고속버스터미널에서 제천행 버스 이용",
      "제천역에서 금성면·청풍 방면 버스 노선 확인 후 인근 정류장 하차",
    ],
  },
  {
    title: "방문 전 확인",
    lines: ["계절과 수위에 따라 집결 위치가 달라질 수 있으니 출발 전 운영 여부를 확인해 주세요."],
  },
];

export const metadata = buildPageMetadata({
  title: "수상스키/ATV",
  description: "제천 청풍호 수상스키, 웨이크보드, ATV 코스와 인사말, 주변관광지, 찾아오시는 길을 확인하세요.",
  path: "/water-ski-atv",
  image: {
    path: "/images/banana-boat.webp",
    width: 1080,
    height: 720,
    alt: "청풍호에서 바나나보트를 즐기는 방문객들",
  },
  keywords: ["제천 수상스키", "청풍호 ATV", "제천 찾아가는 길"],
});

export default function WaterSkiAtvPage() {
  return (
    <main>
      <section id="greeting" className="depth-warm scroll-mt-36 bg-background px-5 py-18 text-foreground lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:items-center">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Greeting"
              title={
                <>
                  제천 청풍호,{" "}
                  <span className="block sm:inline">여름이 시작되는 순간</span>
                </>
              }
              description="강렬한 스피드가 온몸을 깨우고 물보라 속 웃음이 자연스럽게 터집니다."
            />
            <p className="mt-6 text-base leading-8 text-ink-muted">
              가족과 함께, 연인과 함께 행복해지는 시간에 여러분을 초대합니다. 맑은 물빛과 산자락이 펼쳐진 청풍호에서 일상의 긴장은 가볍게 내려놓고, 물 위를 가르는 짜릿함과 시원한 바람을 온몸으로 느껴보세요.
            </p>
            <p className="mt-4 text-base leading-8 text-ink-muted">
              처음 도전하는 분께도 장비 착용과 안전 수칙, 탑승 요령을 차근차근 안내합니다. 수상스키와 웨이크보드의 스피드, 바나나보트의 웃음, ATV의 주행감까지 방문 목적에 맞춰 여름 하루를 더 선명하게 만들어 드리겠습니다.
            </p>
          </div>

          <div className="image-lift relative min-h-[360px] overflow-hidden bg-mist lg:min-h-[560px]">
            <Image
              src="/images/banana-boat.webp"
              alt="청풍호에서 바나나보트를 즐기는 방문객들"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section id="nearby" className="depth-surface scroll-mt-36 bg-surface px-5 py-18 text-foreground lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 border-b border-mist pb-8">
            <SectionHeading
              eyebrow="Nearby"
              title="레저 후 둘러보기 좋은 청풍호 주변 명소"
              description="수상레저를 즐긴 뒤 청풍호를 따라 전망 좋은 명소와 산책 코스를 여유롭게 둘러보기 좋습니다."
            />
          </div>

          <NearbySlider spots={nearbySpots} />
        </div>
      </section>

      <section id="location" className="depth-sage scroll-mt-36 bg-surface-muted px-5 py-18 text-foreground lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Location"
              title="찾아오시는 길"
              description="청풍호를 따라 들어오는 길목에 있어 내비게이션에서 주소를 검색한 뒤 안내되는 진입로를 확인해 주세요."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://map.naver.com/p/search/${encodedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="spring inline-flex items-center gap-3 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white active:scale-[0.98]"
              >
                <MapPin aria-hidden="true" className="h-4 w-4" weight="bold" />
                네이버 지도
              </a>
              <a
                href={`https://map.kakao.com/?q=${encodedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="spring inline-flex items-center gap-3 border border-lake bg-lake px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-white active:scale-[0.98]"
              >
                카카오맵
                <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
              </a>
            </div>
          </div>

          <div className="depth-surface depth-panel-quiet grid border border-mist bg-surface lg:grid-cols-[0.9fr_1.1fr]">
            <a
              href={`https://map.kakao.com/?q=${encodedAddress}`}
              target="_blank"
              rel="noreferrer"
              aria-label="카카오맵에서 충북 제천시 금성면 청풍호로 1542-5 보기"
              className="image-lift relative block min-h-[320px] overflow-hidden bg-mist"
            >
              <Image
                src="/images/kakao-map-cheongpungho-1542-5.webp"
                alt="카카오맵에서 본 제천 수상레저 & 청풍 ATV 주변 지도"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover"
              />
            </a>
            <div className="p-6 sm:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <MapPin aria-hidden="true" className="h-6 w-6 text-sun" weight="bold" />
                교통안내
              </h3>
              <div className="mt-7 divide-y divide-foreground/12">
                {transportGuides.map((guide) => (
                  <article key={guide.title} className="py-5 first:pt-0 last:pb-0">
                    <h4 className="text-base font-bold text-sun">{guide.title}</h4>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-ink-muted">
                      {guide.lines.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-sun" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
