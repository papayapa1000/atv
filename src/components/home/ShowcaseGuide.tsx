import Link from "next/link";
import { ArrowRight, PencilSimpleLine } from "@phosphor-icons/react/ssr";
import type { ShowcasePostPage } from "@/lib/showcase/repository";
import { SectionHeading } from "./SectionHeading";

const naverBlogUrl = "https://blog.naver.com/dori0924";

type ShowcaseGuideProps = {
  showcasePage: ShowcasePostPage;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function ShowcaseGuide({ showcasePage }: ShowcaseGuideProps) {
  return (
    <section className="depth-mint bg-foam px-5 py-14 text-foreground lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            as="h1"
            eyebrow="Showcase"
            title="다녀간 손님들의 게시판입니다"
            description="방문 후기, SNS 링크, 현장 사진을 직접 남길 수 있는 자랑하기 게시판입니다."
          />
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-3 border border-sunset/20 bg-sun/8 px-4 py-2.5 shadow-[0_14px_30px_-28px_rgba(185,79,49,0.7)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-foreground/70">
              <span className="font-bold text-foreground">네이버 블로그 안내</span> 더 많은 현장 후기와 사진은 네이버 블로그에서도 확인하실 수 있습니다.
            </p>
            <a
              href={naverBlogUrl}
              target="_blank"
              rel="noreferrer"
              className="spring group inline-flex w-fit shrink-0 items-center justify-center gap-2 border border-sun bg-sun px-3.5 py-2 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white"
            >
              네이버 블로그 이동하기
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" weight="bold" />
            </a>
          </div>

          <div className="grid min-h-[45rem] grid-rows-[auto_1fr_auto] border border-mist bg-white p-5 shadow-[0_24px_52px_-38px_rgba(7,59,58,0.42)] sm:p-6">
            <div className="flex flex-col gap-4 border-b border-mist pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">자랑하기 게시판</h2>
                <p className="numeric mt-2 text-sm font-bold text-foreground/48">총 {showcasePage.totalCount}개</p>
              </div>
              <Link
                href="/showcase/write"
                className="spring inline-flex w-fit items-center justify-center gap-2 border border-lake bg-lake px-4 py-2.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-white"
              >
                <PencilSimpleLine aria-hidden="true" className="h-4 w-4" weight="bold" />
                글쓰기
              </Link>
            </div>

            <div className="mt-2">
              {showcasePage.items.length > 0 ? (
                <ul className="divide-y divide-mist">
                  {showcasePage.items.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/showcase/${post.id}`}
                        className="spring grid gap-3 px-1 py-4 text-sm hover:bg-foam/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-lake/30 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center sm:px-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-foreground">{post.title}</p>
                          <p className="mt-1 truncate text-xs font-bold text-lake/72">{post.authorName}</p>
                        </div>
                        <time dateTime={post.createdAt} className="numeric text-xs font-bold text-foreground/48 sm:text-right sm:text-sm">
                          {formatDate(post.createdAt)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex min-h-[38rem] flex-col items-center justify-center border-y border-mist px-5 py-16 text-center">
                  <p className="text-lg font-bold">아직 등록된 게시글이 없습니다.</p>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">첫 방문 후기를 남기면 이곳에 표시됩니다.</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-mist pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="numeric text-sm font-bold text-foreground/52">
                {showcasePage.page} / {showcasePage.totalPages} 페이지
              </p>
              {showcasePage.totalPages > 1 ? (
                <nav aria-label="자랑하기 게시판 페이지" className="flex flex-wrap gap-2">
                  {showcasePage.page > 1 ? (
                    <Link
                      href={`/showcase?page=${showcasePage.page - 1}`}
                      className="spring border border-mist bg-white px-3 py-2 text-sm font-bold text-foreground/68 hover:border-lake hover:text-lake"
                    >
                      이전
                    </Link>
                  ) : null}

                  {Array.from({ length: showcasePage.totalPages }, (_, index) => index + 1).map((pageNumber) => {
                    const isActive = pageNumber === showcasePage.page;

                    return (
                      <Link
                        key={pageNumber}
                        href={`/showcase?page=${pageNumber}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`spring inline-flex h-9 min-w-9 items-center justify-center border px-3 text-sm font-bold ${
                          isActive
                            ? "border-lake bg-lake text-white"
                            : "border-mist bg-white text-foreground/68 hover:border-lake hover:text-lake"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}

                  {showcasePage.page < showcasePage.totalPages ? (
                    <Link
                      href={`/showcase?page=${showcasePage.page + 1}`}
                      className="spring border border-mist bg-white px-3 py-2 text-sm font-bold text-foreground/68 hover:border-lake hover:text-lake"
                    >
                      다음
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
