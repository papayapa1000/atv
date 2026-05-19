import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { listVideoPostsPage, type VideoPostPage } from "@/lib/videos/repository";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { SectionHeading } from "./SectionHeading";

type VideoGuideProps = {
  page?: string | null;
};

function videoPageHref(page: number) {
  return page <= 1 ? "/videos" : `/videos?page=${page}`;
}

function VideoPagination({ videoPage }: { videoPage: VideoPostPage }) {
  if (videoPage.totalCount < videoPage.pageSize) {
    return null;
  }

  return (
    <nav aria-label="동영상 페이지" className="mt-8 flex flex-col gap-4 border border-mist bg-surface/82 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="numeric text-sm font-bold text-foreground/54">
        {videoPage.page} / {videoPage.totalPages} 페이지 · 총 {videoPage.totalCount}개
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {videoPage.page > 1 ? (
          <Link
            href={videoPageHref(videoPage.page - 1)}
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

        {Array.from({ length: videoPage.totalPages }, (_, index) => index + 1).map((pageNumber) => {
          const isActive = pageNumber === videoPage.page;

          return (
            <Link
              key={pageNumber}
              href={videoPageHref(pageNumber)}
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

        {videoPage.page < videoPage.totalPages ? (
          <Link
            href={videoPageHref(videoPage.page + 1)}
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

export async function VideoGuide({ page }: VideoGuideProps) {
  const videoPage = await listVideoPostsPage(page, 9);

  return (
    <section id="videos" className="depth-warm bg-background px-5 py-18 text-foreground lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <SectionHeading
            as="h1"
            eyebrow="Video"
            title="현장의 속도감을 영상으로 먼저 확인합니다"
            description="유튜브 영상과 현장 촬영 파일을 한곳에서 확인할 수 있습니다. 목록에서는 썸네일만 보여주고 상세 화면에서 영상을 재생합니다."
          />
        </div>

        <div className="depth-panel-quiet mt-12 grid grid-cols-2 gap-px border border-mist bg-mist lg:grid-cols-3">
          {videoPage.items.map((post, index) => (
            <Link
              key={post.id}
              href={`/videos/${post.id}`}
              aria-label={`${post.title} 상세보기`}
              className="image-lift group relative block aspect-[4/3] overflow-hidden bg-mist focus:outline-none focus-visible:ring-4 focus-visible:ring-lake/24 lg:aspect-[16/10]"
            >
              <VideoThumbnail post={post} priority={index === 0} fill />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-surface/62 bg-surface/88 p-3 text-xs font-bold text-foreground backdrop-blur-md sm:p-4 sm:text-sm">
                <span className="min-w-0 truncate">{post.title}</span>
                <span className="numeric text-lake">{String(videoPage.offset + index + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}
          {videoPage.items.length === 0 ? (
            <div className="col-span-full flex min-h-[28rem] flex-col items-center justify-center bg-surface px-5 py-16 text-center">
              <p className="text-lg font-bold">등록된 동영상이 없습니다.</p>
              <p className="mt-3 text-sm leading-7 text-ink-muted">관리자 페이지에서 유튜브 링크 또는 영상 파일을 등록해 주세요.</p>
            </div>
          ) : null}
        </div>

        <VideoPagination videoPage={videoPage} />
      </div>
    </section>
  );
}
