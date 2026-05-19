import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageSquare, LinkSimple, Trash } from "@phosphor-icons/react/ssr";
import { deleteAdminShowcasePostAction } from "@/app/admin/actions";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireAdminSession } from "@/lib/admin/session";
import { listAdminShowcasePosts, type ShowcasePost } from "@/lib/showcase/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "자랑하기 관리 | 제천 ATV & 수상레저",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminShowcasePageProps = {
  searchParams?: Promise<{ deleted?: string; error?: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export default async function AdminShowcasePage({ searchParams }: AdminShowcasePageProps) {
  await requireAdminSession();
  const params = searchParams ? await searchParams : {};
  let posts: ShowcasePost[] = [];
  let loadError = "";

  try {
    posts = await listAdminShowcasePosts();
  } catch {
    loadError = "자랑하기 게시글을 불러오지 못했습니다. Supabase 설정과 showcase_posts 테이블을 확인해 주세요.";
  }

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="showcase" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 border-b border-foreground/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">
                Showcase Admin
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">자랑하기 관리</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
                방문객이 등록한 후기, 링크, 첨부 사진을 확인하고 필요 없는 게시글을 삭제합니다.
              </p>
            </div>
            <Link
              href="/showcase"
              className="spring inline-flex w-fit items-center justify-center border border-foreground/14 bg-surface px-5 py-3 text-sm font-bold text-foreground/70 hover:border-lake hover:text-lake"
            >
              공개 게시판 보기
            </Link>
          </div>

          {params.deleted ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">
              게시글이 삭제되었습니다.
            </div>
          ) : null}

          {params.error ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">
              삭제할 게시글을 찾지 못했습니다.
            </div>
          ) : null}

          {loadError ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">{loadError}</div>
          ) : null}

          <section className="mt-8 min-h-[36rem] border border-foreground/12 bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-4">
              <h2 className="text-xl font-semibold">등록된 자랑하기 게시글</h2>
              <span className="numeric text-sm font-bold text-foreground/48">{posts.length}개</span>
            </div>

            {posts.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <article key={post.id} className="border border-foreground/12 bg-white">
                    <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                      {post.imageUrls[0] ? (
                        <Image src={post.imageUrls[0]} alt={post.title} fill sizes="(min-width: 1280px) 24vw, 50vw" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lake/70">
                          <ImageSquare aria-hidden="true" className="h-10 w-10" weight="duotone" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-foreground/48">
                        <span>{post.authorName}</span>
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      </div>
                      <h3 className="mt-3 text-base font-bold leading-6">{post.title}</h3>
                      <p className="mt-2 text-xs font-bold text-lake">첨부 사진 {post.imageUrls.length}장</p>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/58">{post.content}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {post.linkUrl ? (
                          <a
                            href={post.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="spring inline-flex items-center gap-2 text-sm font-bold text-lake hover:text-foreground"
                          >
                            <LinkSimple aria-hidden="true" className="h-4 w-4" weight="bold" />
                            링크 열기
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-foreground/38">링크 없음</span>
                        )}

                        <form action={deleteAdminShowcasePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="spring inline-flex items-center gap-2 border border-sunset/28 px-3 py-2 text-sm font-bold text-sunset hover:bg-sunset hover:text-white"
                          >
                            <Trash aria-hidden="true" className="h-4 w-4" weight="bold" />
                            삭제
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[30rem] flex-col items-center justify-center px-5 py-16 text-center">
                <p className="text-lg font-semibold">등록된 자랑하기 게시글이 없습니다.</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">공개 자랑하기 페이지에서 게시글을 작성하면 이곳에 표시됩니다.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
