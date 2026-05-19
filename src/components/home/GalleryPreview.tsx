import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { listGalleryPostsPage, type GalleryPostPage } from "@/lib/gallery/repository";
import { SectionHeading } from "./SectionHeading";

type GalleryPreviewProps = {
  page?: string | null;
};

function galleryPageHref(page: number) {
  return page <= 1 ? "/gallery" : `/gallery?page=${page}`;
}

function GalleryPagination({ galleryPage }: { galleryPage: GalleryPostPage }) {
  if (galleryPage.totalCount < galleryPage.pageSize) {
    return null;
  }

  return (
    <nav aria-label="갤러리 페이지" className="mt-8 flex flex-col gap-4 border border-mist bg-surface/82 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="numeric text-sm font-bold text-foreground/54">
        {galleryPage.page} / {galleryPage.totalPages} 페이지 · 총 {galleryPage.totalCount}개
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {galleryPage.page > 1 ? (
          <Link
            href={galleryPageHref(galleryPage.page - 1)}
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

        {Array.from({ length: galleryPage.totalPages }, (_, index) => index + 1).map((pageNumber) => {
          const isActive = pageNumber === galleryPage.page;

          return (
            <Link
              key={pageNumber}
              href={galleryPageHref(pageNumber)}
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

        {galleryPage.page < galleryPage.totalPages ? (
          <Link
            href={galleryPageHref(galleryPage.page + 1)}
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

export async function GalleryPreview({ page }: GalleryPreviewProps) {
  const galleryPage = await listGalleryPostsPage(page, 9);
  const galleryWall = galleryPage.items;

  return (
    <section id="gallery" className="depth-warm bg-background px-5 py-18 text-foreground lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <SectionHeading
            as="h1"
            eyebrow="Gallery"
            title="청풍호의 장면을 한눈에 봅니다"
            description="수상레저, ATV, 단체 이용 사진과 영상으로 예약 전 현장 분위기를 먼저 확인할 수 있습니다."
          />
        </div>

        <div className="depth-panel-quiet mt-12 grid grid-cols-2 gap-px border border-mist bg-mist lg:grid-cols-3">
          {galleryWall.map((post, index) => (
            <Link
              key={post.id}
              href={`/gallery/${post.id}`}
              aria-label={`${post.title} 상세보기`}
              className="image-lift group relative block aspect-[4/3] overflow-hidden bg-mist focus:outline-none focus-visible:ring-4 focus-visible:ring-lake/24 lg:aspect-[16/10]"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-surface/16 opacity-70 transition-opacity duration-500 group-hover:opacity-25" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-surface/62 bg-surface/88 p-3 text-xs font-bold text-foreground backdrop-blur-md sm:p-4 sm:text-sm">
                <span className="min-w-0 truncate">{post.title}</span>
                <span className="numeric text-lake">{String(galleryPage.offset + index + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}
        </div>

        <GalleryPagination galleryPage={galleryPage} />
      </div>
    </section>
  );
}
