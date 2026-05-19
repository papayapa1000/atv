import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { programCards } from "@/lib/site-data";
import { SectionHeading } from "./SectionHeading";

type Program = (typeof programCards)[number];

type ProgramGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  programs?: Program[];
  filters?: string[][];
};

const courseFilters = [
  ["강습·장비 대여", "수상스키와 웨이크보드는 초보/중급 기준에 따라 안내합니다."],
  ["놀이기구 라인업", "플라이피쉬부터 빅마블까지 인원과 스릴 강도에 맞춰 고를 수 있습니다."],
  ["패키지·단체", "여러 번 이용하거나 10인 이상이면 전화로 묶음 상담이 빠릅니다."],
];

export function ProgramGrid({
  eyebrow = "Programs",
  title = "목적에 맞는 코스를 먼저 고릅니다",
  description = "초보 강습, 강한 스릴, 단체 이용, 풍경 투어가 모두 같은 선택지가 아닙니다. 방문 목적부터 정하면 종목 선택이 쉬워집니다.",
  programs = programCards,
  filters = courseFilters,
}: ProgramGridProps) {
  return (
    <section id="programs" className="depth-mint bg-foam px-5 py-18 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <div className="mt-8 border-y border-mist">
            {filters.map(([filterTitle, text]) => (
              <article key={filterTitle} className="border-b border-mist py-5 last:border-b-0">
                <h3 className="font-bold text-foreground">{filterTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-mist">
          {programs.map((program, index) => (
            <article
              key={program.title}
              className="group grid border-b border-mist bg-surface transition-colors duration-300 hover:bg-surface-muted/45 sm:grid-cols-[0.44fr_0.56fr]"
            >
              <div className="image-lift relative min-h-[250px] overflow-hidden bg-mist sm:min-h-[320px]">
                <Image
                  src={program.image}
                  alt={`${program.title} 현장 이미지`}
                  fill
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[250px] flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="numeric text-xs font-bold text-lake">{String(index + 1).padStart(2, "0")}</p>
                      <p className="mt-2 text-xs font-bold uppercase text-foreground/46">{program.eyebrow}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center border border-mist text-lake transition-colors duration-300 group-hover:border-sun group-hover:bg-sun group-hover:text-deep">
                      <ArrowRight aria-hidden="true" className="h-4 w-4" weight="bold" />
                    </span>
                  </div>
                  <h3 className="mt-7 text-3xl font-bold leading-snug text-foreground">{program.title}</h3>
                  <p className="text-pretty mt-4 max-w-lg text-sm leading-7 text-ink-muted">{program.description}</p>
                </div>
                <p className="numeric mt-7 border-t border-mist pt-4 text-sm font-bold text-foreground">{program.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
