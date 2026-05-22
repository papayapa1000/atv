import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import type { StayPostPage } from "@/lib/stay/repository";
import { SectionHeading } from "./SectionHeading";

type StayGuideProps = {
  stayPage: StayPostPage;
};

function stayPageHref(page: number) {
  return page <= 1 ? "/stay" : `/stay?page=${page}`;
}

function StayPagination({ stayPage }: { stayPage: StayPostPage }) {
  if (stayPage.totalCount <= stayPage.pageSize) {
    return null;
  }

  return (
    <nav aria-label="주변 숙박 페이지" className="mt-8 flex flex-col gap-4 border border-mist bg-surface/82 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="numeric text-sm font-bold text-foreground/54">
        {stayPage.page} / {stayPage.totalPages} 페이지 · 총 {stayPage.totalCount}개
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {stayPage.page > 1 ? (
          <Link
            href={stayPageHref(stayPage.page - 1)}
            className="spring inline-flex h-10 items-center gap-2 border border-foreground/14 bg-surface px-3 text-sm font-bold text-foreground/68 hover:border-lake hover:text-lake"
          >
            <CaretLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            이전
          </Link>
        ) : (
          <span className="inline-flex h-10 items-center gap-2 border border-foreground/8 bg-surface-muted px-3 text-sm font-bold text-foreground/32">
            <CaretLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            이전
          </span>
        )}

        {Array.from({ length: stayPage.totalPages }, (_, index) => index + 1).map((pageNumber) => {
          const isActive = pageNumber === stayPage.page;

          return (
            <Link
              key={pageNumber}
              href={stayPageHref(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`spring inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-bold ${
                isActive
                  ? "border-lake bg-lake text-white"
                  : "border-foreground/14 bg-surface text-foreground/68 hover:border-lake hover:text-lake"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}

        {stayPage.page < stayPage.totalPages ? (
          <Link
            href={stayPageHref(stayPage.page + 1)}
            className="spring inline-flex h-10 items-center gap-2 border border-foreground/14 bg-surface px-3 text-sm font-bold text-foreground/68 hover:border-lake hover:text-lake"
          >
            다음
            <CaretRight aria-hidden="true" className="h-4 w-4" weight="bold" />
          </Link>
        ) : (
          <span className="inline-flex h-10 items-center gap-2 border border-foreground/8 bg-surface-muted px-3 text-sm font-bold text-foreground/32">
            다음
            <CaretRight aria-hidden="true" className="h-4 w-4" weight="bold" />
          </span>
        )}
      </div>
    </nav>
  );
}

export function StayGuide({ stayPage }: StayGuideProps) {
  return (
    <section id="stay" className="depth-warm bg-background px-5 py-18 text-foreground lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <SectionHeading
            as="h1"
            eyebrow="Stay"
            title="주변 숙박"
            description="수상레저와 ATV 이용 전후로 함께 잡기 좋은 주변 숙박 정보를 확인하세요."
          />
        </div>

        {stayPage.items.length > 0 ? (
          <div className="depth-panel-quiet mt-12 grid grid-cols-2 gap-1 lg:grid-cols-3">
            {stayPage.items.map((post, index) => {
              const coverImageUrl = post.imageUrls[0] ?? "/images/workshop.webp";

              return (
                <Link
                  key={post.id}
                  href={`/stay/${post.id}`}
                  aria-label={`${post.title} 상세보기`}
                  className="image-lift group relative block aspect-[4/3] overflow-hidden bg-mist focus:outline-none focus-visible:ring-4 focus-visible:ring-lake/24 lg:aspect-[16/10]"
                >
                  <Image
                    src={coverImageUrl}
                    alt={post.title}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-surface/16 opacity-70 transition-opacity duration-500 group-hover:opacity-25" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 border-t border-surface/62 bg-surface/88 p-3 text-xs font-bold text-foreground backdrop-blur-md sm:p-4 sm:text-sm">
                    <span className="min-w-0 truncate">{post.title}</span>
                    <span className="numeric shrink-0 text-lake">{post.price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 border border-mist bg-surface px-5 py-20 text-center">
            <p className="text-lg font-bold">등록된 주변 숙박 정보가 없습니다.</p>
          </div>
        )}

        <StayPagination stayPage={stayPage} />
      </div>
    </section>
  );
}
