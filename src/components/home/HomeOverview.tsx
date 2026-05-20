import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, CheckCircle, MapPin, PhoneCall } from "@phosphor-icons/react/ssr";
import { galleryImages, phoneHref, phoneNumber, refundRules, reservationSteps } from "@/lib/site-data";

const packageCards = [
  {
    title: "주변 숙박 연계",
    image: "/images/night-party.webp",
    label: "숙박 일정",
    text: "당일 레저 후 숙박이 필요한 가족·단체는 방문 날짜와 인원을 기준으로 주변 숙박 동선을 함께 문의할 수 있습니다.",
    action: "주변 숙박 보기",
    href: "/stay",
  },
  {
    title: "단체 워크숍 코스",
    image: "/images/workshop.webp",
    label: "10인 이상",
    text: "성수기, 주말, 연휴 기간 단체 방문은 이용 종목과 시간을 먼저 맞춘 뒤 예약하는 편이 안정적입니다.",
    action: "예약 안내 보기",
    href: "/reservation",
  },
  {
    title: "수상레저 + ATV",
    image: "/images/atv-family.webp",
    label: "하루 코스",
    text: "물 위에서 먼저 즐기고 ATV로 이어가는 일정은 가족, 연인, 친구 모임 모두에게 가장 문의가 많은 구성입니다.",
    action: "코스 확인하기",
    href: "/activities",
  },
];

const packageCardLayouts = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
];

const featuredGallery = [
  ...galleryImages.slice(0, 4),
  { src: "/images/motorboat.webp", alt: "청풍호 모터보트 주행" },
  { src: "/images/bandwagon.webp", alt: "단체 수상 놀이기구" },
  { src: "/images/waterski-rental.webp", alt: "수상스키 장비 준비" },
  { src: "/images/big-marble.webp", alt: "빅마블 수상 놀이기구" },
  { src: "/images/atv-lakeside.webp", alt: "청풍호 호반 ATV 주행" },
];

export function HomeOverview() {
  return (
    <section className="depth-warm bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-8 lg:py-36">
        <div className="mb-12">
          <div>
            <p className="supanova-badge inline-flex px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]">Stay & Group Course</p>
            <h2 className="headline-tight mt-5 break-keep-all text-4xl font-black leading-[1.08] sm:text-6xl">
              레저만 예약하지 말고 하루 동선까지 맞추세요
            </h2>
            <p className="mt-5 max-w-2xl break-keep-all text-base leading-8 text-ink-muted">
              단체, 가족, 연인 일정은 이용 종목보다 동선이 먼저입니다. 수상레저 후 숙박, ATV, 주변 관광까지 한 번에 정리해 드립니다.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {packageCards.map((card, index) => (
            <Link
              key={card.title}
              href={card.href}
              className={`spring group bezel depth-panel-quiet rounded-[2rem] bg-surface/72 p-1.5 hover:-translate-y-1 ${packageCardLayouts[index]}`}
            >
              <div className="depth-surface grid h-full overflow-hidden rounded-[1.65rem] border border-mist bg-surface md:grid-cols-[0.94fr_1.06fr] lg:grid-cols-1">
                <div className={`image-lift relative min-h-[260px] overflow-hidden bg-mist ${index === 0 ? "lg:min-h-[420px]" : "lg:min-h-[220px]"}`}>
                  <Image src={card.image} alt={card.title} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-surface/16 opacity-70 transition-opacity duration-500 group-hover:opacity-30" />
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-8">
                  <div>
                    <p className="text-sm font-extrabold text-sun">{card.label}</p>
                    <h3 className={`${index === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"} mt-3 break-keep-all font-black leading-tight`}>
                      {card.title}
                    </h3>
                    <p className="mt-4 break-keep-all text-sm leading-7 text-ink-muted">{card.text}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-3 text-sm font-extrabold text-lake">
                    {card.action}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-lake/8 transition-colors duration-300 group-hover:bg-sun group-hover:text-white">
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" weight="bold" />
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="depth-sage bg-surface-muted px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div>
              <p className="supanova-badge inline-flex px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]">Gallery</p>
              <h2 className="headline-tight mt-5 break-keep-all text-4xl font-black leading-[1.08] sm:text-6xl">사진으로 먼저 보는 현장 분위기</h2>
            </div>
          </div>

          <div className="depth-panel-quiet grid overflow-hidden rounded-[2rem] border border-mist bg-mist lg:grid-cols-6">
            {featuredGallery.map((image, index) => (
              <Link
                key={`${image.src}-${index}`}
                href="/gallery"
                className={`image-lift group relative overflow-hidden bg-mist ${index === 0 ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto" : "aspect-[4/3]"}`}
              >
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" loading="eager" />
                <div className="absolute inset-0 bg-surface/16 opacity-70 transition-opacity duration-300 group-hover:opacity-25" />
                <span className="absolute bottom-0 left-0 right-0 flex items-center gap-2 border-t border-surface/62 bg-surface/88 p-4 text-sm font-bold text-foreground backdrop-blur-md">
                  <Camera aria-hidden="true" className="h-4 w-4 text-sun" weight="bold" />
                  <span className="min-w-0 truncate">{image.alt}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-24 lg:grid-cols-[0.42fr_0.29fr_0.29fr] lg:px-8 lg:py-32">
        <div className="depth-surface depth-panel-quiet rounded-[2rem] border border-mist bg-surface p-7 text-foreground sm:p-9">
          <p className="supanova-badge inline-flex px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]">Reservation</p>
          <h2 className="headline-tight mt-6 break-keep-all text-4xl font-black leading-[1.08]">예약금과 환불 기준을 먼저 확인하세요</h2>
          <p className="mt-5 text-base leading-8 text-ink-muted">
            예약 당일 미방문이 잦아 50,000원 선입금 방식으로 예약을 확정합니다. 일정 변경은 최소 1일 전 연락해 주세요.
          </p>
          <a href={phoneHref} className="spring mt-8 inline-flex items-center gap-3 rounded-full border border-sun bg-sun px-6 py-3.5 text-sm font-extrabold text-white hover:scale-[1.02] hover:border-sunset hover:bg-sunset hover:text-white">
            <PhoneCall aria-hidden="true" className="h-4 w-4" weight="bold" />
            {phoneNumber}
          </a>
        </div>

        <div className="depth-surface depth-panel-quiet rounded-[2rem] border border-mist bg-surface p-7">
          <h3 className="flex items-center gap-3 text-xl font-bold">
            <MapPin aria-hidden="true" className="h-5 w-5 text-lake" weight="bold" />
            예약 절차
          </h3>
          <ol className="mt-6 space-y-4">
            {reservationSteps.slice(0, 4).map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-7 text-ink-muted">
                <span className="numeric font-bold text-lake">{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="depth-mint depth-panel-quiet rounded-[2rem] border border-mist bg-foam p-7 text-foreground">
          <h3 className="flex items-center gap-3 text-xl font-bold">
            <CheckCircle aria-hidden="true" className="h-5 w-5 text-sun" weight="bold" />
            환불규정
          </h3>
          <div className="mt-6 divide-y divide-foreground/12">
            {refundRules.map((rule) => (
              <dl key={rule.label} className="grid grid-cols-[1fr_auto] gap-4 py-4 text-sm">
                <dt className="font-bold text-ink-muted">{rule.label}</dt>
                <dd className="font-bold text-sun">{rule.value}</dd>
              </dl>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-ink-muted">기상과 현장 안전 상황에 따라 이용 시간이 조정될 수 있습니다.</p>
        </div>
      </div>
    </section>
  );
}
