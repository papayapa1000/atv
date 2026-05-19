"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, CaretLeft, CaretRight, Compass } from "@phosphor-icons/react";

export type NearbySpot = {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
};

type NearbySliderProps = {
  spots: NearbySpot[];
};

export function NearbySlider({ spots }: NearbySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.86, 760),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          aria-label="이전 관광지"
          onClick={() => scroll(-1)}
          className="spring grid h-11 w-11 place-items-center border border-mist text-lake hover:border-sun hover:bg-sun hover:text-deep"
        >
          <CaretLeft aria-hidden="true" className="h-5 w-5" weight="bold" />
        </button>
        <button
          type="button"
          aria-label="다음 관광지"
          onClick={() => scroll(1)}
          className="spring grid h-11 w-11 place-items-center border border-mist text-lake hover:border-sun hover:bg-sun hover:text-deep"
        >
          <CaretRight aria-hidden="true" className="h-5 w-5" weight="bold" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {spots.map((spot) => (
          <article
            key={spot.title}
            className="depth-warm depth-panel-quiet min-w-[82%] snap-start overflow-hidden border border-mist bg-background sm:min-w-[48%] lg:min-w-[31%] xl:min-w-[24%]"
          >
            <div className="image-lift relative aspect-[4/3] overflow-hidden bg-mist">
              <Image
                src={spot.image}
                alt={spot.alt}
                fill
                sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 82vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <Compass aria-hidden="true" className="h-6 w-6 text-lake" weight="bold" />
              <h3 className="mt-5 text-2xl font-bold leading-snug">{spot.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink-muted">{spot.description}</p>
              <a
                href={spot.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-lake underline underline-offset-4"
              >
                제천문화관광 보기
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" weight="bold" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
