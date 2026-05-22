import Link from "next/link";
import { ArrowLeft, ImageSquare } from "@phosphor-icons/react/ssr";
import { ShowcaseWriteForm } from "@/components/showcase/ShowcaseWriteForm";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "자랑하기 글쓰기",
  description: "방문 후기와 사진을 등록해 자랑하기 게시판에 공유하세요.",
  path: "/showcase/write",
  noIndex: true,
});

export default function ShowcaseWritePage() {
  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="border border-foreground/12 bg-surface p-5 sm:p-8 lg:p-10">
            <Link
              href="/showcase"
              className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-lake"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
              자랑하기로 돌아가기
            </Link>
            <p className="mt-8 flex w-fit border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">
              Showcase Write
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">게시글 작성</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
              방문 후기와 함께 현장 사진을 등록할 수 있습니다.
            </p>
            <div className="mt-10">
              <ShowcaseWriteForm />
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <div className="border border-lake/14 bg-surface-muted p-6 text-foreground sm:p-8">
              <div className="flex items-center gap-3">
                <ImageSquare aria-hidden="true" className="h-6 w-6 text-sun" weight="bold" />
                <h2 className="text-xl font-bold">사진 첨부 안내</h2>
              </div>
              <div className="mt-6 space-y-4 text-sm leading-7 text-ink-muted">
                <p>수상레저, ATV, 단체 방문 현장 사진을 최대 5장까지 첨부할 수 있습니다.</p>
                <p>각 사진은 8MB 이하의 jpg, png, webp 형식만 지원합니다.</p>
                <p>영상은 링크만 가능합니다.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
