import Link from "next/link";
import { PencilSimpleLine } from "@phosphor-icons/react/ssr";
import type { ShowcasePostPage } from "@/lib/showcase/repository";
import { SectionHeading } from "./SectionHeading";

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

        <div className="grid min-h-[45rem] grid-rows-[auto_1fr_auto] border border-mist bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-4 border-b border-foreground/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-lake">Visitor Board</p>
              <h2 className="mt-2 text-2xl font-bold">자랑하기 게시판</h2>
            </div>
            <Link
              href="/showcase/write"
              className="spring inline-flex w-fit items-center justify-center gap-3 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-lake hover:text-white"
            >
              <PencilSimpleLine aria-hidden="true" className="h-4 w-4" weight="bold" />
              글쓰기
            </Link>
          </div>

          <div className="mt-4 overflow-hidden border border-foreground/12 bg-white">
            <div className="grid grid-cols-[1fr_5.5rem_6.5rem] border-b border-foreground/10 bg-surface-muted/70 px-3 py-1 text-xs font-bold text-foreground/56 sm:grid-cols-[1fr_8rem_8rem] sm:px-4">
              <span>제목</span>
              <span className="text-center">작성자</span>
              <span className="text-right">작성일</span>
            </div>

            {showcasePage.items.length > 0 ? (
              <ul>
                {showcasePage.items.map((post) => (
                  <li
                    key={post.id}
                    className="border-b border-foreground/8 odd:bg-white even:bg-foam/58 last:border-b-0"
                  >
                    <Link
                      href={`/showcase/${post.id}`}
                      className="spring grid min-h-12 grid-cols-[1fr_5.5rem_6.5rem] items-center px-3 py-2 text-sm hover:bg-lake/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-lake/30 sm:grid-cols-[1fr_8rem_8rem] sm:px-4"
                    >
                      <p className="min-w-0 truncate font-bold text-foreground">{post.title}</p>
                      <p className="truncate px-2 text-center text-xs font-bold text-foreground/56 sm:text-sm">{post.authorName}</p>
                      <time dateTime={post.createdAt} className="numeric text-right text-xs font-bold text-foreground/46 sm:text-sm">
                        {formatDate(post.createdAt)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[38rem] flex-col items-center justify-center px-5 py-16 text-center">
                <p className="text-lg font-bold">아직 등록된 게시글이 없습니다.</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">첫 방문 후기를 남기면 이곳에 표시됩니다.</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-foreground/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="numeric text-sm font-bold text-foreground/52">
              총 {showcasePage.totalCount}개 · {showcasePage.page} / {showcasePage.totalPages} 페이지
            </p>
            {showcasePage.totalPages > 1 ? (
              <nav aria-label="자랑하기 게시판 페이지" className="flex flex-wrap gap-2">
                {showcasePage.page > 1 ? (
                  <Link
                    href={`/showcase?page=${showcasePage.page - 1}`}
                    className="spring border border-foreground/14 bg-surface px-3 py-2 text-sm font-bold text-foreground/68 hover:border-foreground hover:text-foreground"
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
                          : "border-foreground/14 bg-surface text-foreground/68 hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {showcasePage.page < showcasePage.totalPages ? (
                  <Link
                    href={`/showcase?page=${showcasePage.page + 1}`}
                    className="spring border border-foreground/14 bg-surface px-3 py-2 text-sm font-bold text-foreground/68 hover:border-foreground hover:text-foreground"
                  >
                    다음
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
