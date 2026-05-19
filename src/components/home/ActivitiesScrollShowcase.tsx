"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from "react";

export type ActivityDetail = {
  id: string;
  title: string;
  english: string;
  category: string;
  image: string;
  alt: string;
  quote: string;
  description: string;
  prices: {
    label: string;
    value: string;
    note?: string;
  }[];
};

type ActivitiesScrollShowcaseProps = {
  items: ActivityDetail[];
  phoneHref: string;
};

export function ActivitiesScrollShowcase({ items, phoneHref }: ActivitiesScrollShowcaseProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const menuRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeItem = useMemo(() => items.find((item) => item.id === activeId) ?? items[0], [activeId, items]);
  const selectedId = activeItem?.id ?? "";

  const selectItem = useCallback((id: string, shouldUpdateHash = true) => {
    setActiveId(id);

    if (!shouldUpdateHash) return;

    const nextHash = `#${id}`;

    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, []);

  const handleMenuWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    event.currentTarget.scrollBy({
      left: event.deltaY,
      behavior: "auto",
    });
  };

  useEffect(() => {
    const syncActiveFromHash = () => {
      const idFromHash = decodeURIComponent(window.location.hash.replace("#", ""));

      if (items.some((item) => item.id === idFromHash)) {
        selectItem(idFromHash, false);
      }
    };

    syncActiveFromHash();
    window.addEventListener("hashchange", syncActiveFromHash);
    window.addEventListener("popstate", syncActiveFromHash);

    return () => {
      window.removeEventListener("hashchange", syncActiveFromHash);
      window.removeEventListener("popstate", syncActiveFromHash);
    };
  }, [items, selectItem]);

  useEffect(() => {
    tabRefs.current[selectedId]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [selectedId]);

  if (!activeItem) return null;

  return (
    <section className="depth-warm min-h-[calc(100vh-5rem)] bg-background px-5 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] min-w-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-lake">Activities</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              이용요금 및 예약안내
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
              청풍호 물살을 가르는 쾌속의 스피드와 풍경을 종목별로 확인하세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href={phoneHref} className="spring inline-flex items-center gap-2 border border-mist bg-surface px-4 py-2.5 text-sm font-bold text-lake hover:border-lake hover:text-foreground">
              <PhoneCall aria-hidden="true" className="h-5 w-5" weight="bold" />
              010-4634-5020
            </a>
            <Link
              href="/reservation"
              className="spring inline-flex items-center justify-center gap-2 border border-sun bg-sun px-4 py-2.5 text-sm font-bold text-white hover:border-sunset hover:bg-sunset hover:text-white"
            >
              온라인 예약문의
              <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </div>

        <div className="sticky top-[5rem] z-20 -mx-5 mt-5 border-y border-mist bg-surface/92 px-5 py-3 backdrop-blur lg:top-0 lg:mx-0 lg:px-3">
          <div className="min-w-0">
            <nav
              ref={menuRef}
              aria-label="즐길거리 종목"
              role="tablist"
              onWheel={handleMenuWheel}
              className="flex min-w-0 gap-2.5 overflow-x-auto py-1.5 text-sm font-bold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabRefs.current[item.id] = element;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selectedId === item.id}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-tab`}
                  onClick={() => selectItem(item.id)}
                  className={`spring relative h-11 shrink-0 border-2 px-4 text-left ${
                    selectedId === item.id
                      ? "border-lake bg-lake text-white"
                      : "border-mist bg-foam text-foreground hover:border-lake hover:bg-surface-muted"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-7 min-w-0">
          <ActivityPrefab key={activeItem.id} item={activeItem} />
        </div>
      </div>
    </section>
  );
}

function ActivityPrefab({ item }: { item: ActivityDetail }) {
  return (
    <article
      id={`${item.id}-panel`}
      role="tabpanel"
      aria-labelledby={`${item.id}-tab`}
      data-prefab="activity-item"
      className="min-w-0 scroll-mt-24 pb-8 lg:min-h-[30rem] lg:pb-8 xl:min-h-[32rem]"
    >
      <div className="grid min-w-0 gap-7 lg:min-h-[30rem] xl:min-h-[32rem] xl:grid-cols-[0.43fr_0.57fr] xl:items-stretch">
        <div data-prefab-part="text" className="min-w-0">
          <p className="text-xs font-bold uppercase text-lake">{item.category}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{item.title}</h2>
          <p className="mt-2 text-xs font-bold uppercase text-foreground/38">{item.english}</p>

          <div className="mt-5">
            <h3 className="text-base font-bold">이용요금</h3>
            <div className="mt-3 border-y border-mist">
              {item.prices.map((price) => (
                <div
                  key={`${price.label}-${price.value}`}
                  className="grid gap-1 border-b border-mist py-3 text-sm last:border-b-0 sm:grid-cols-[6rem_1fr]"
                >
                  <span className="text-foreground/56">{price.label}</span>
                  <span>
                    <strong className="numeric text-foreground">{price.value}</strong>
                    {price.note ? <span className="ml-2 text-foreground/50">{price.note}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div data-prefab-part="body-text" className="mt-6">
            <p className="break-all text-lg font-bold leading-snug text-foreground/56 sm:text-xl">{item.quote}</p>
            <p className="mt-4 break-all text-sm leading-7 text-ink-muted">{item.description}</p>
          </div>
        </div>

        <div data-prefab-part="image" className="image-lift relative h-[15rem] w-full overflow-hidden bg-mist sm:aspect-[16/9] sm:h-auto xl:h-full xl:min-h-0 xl:aspect-auto">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 56vw, 100vw"
            className="object-cover"
            priority={item.id === "water-ski"}
          />
        </div>
      </div>
    </article>
  );
}
