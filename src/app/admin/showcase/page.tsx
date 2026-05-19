import type { Metadata } from "next";
import { Trash } from "@phosphor-icons/react/ssr";
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
          <div className="border-b border-foreground/12 pb-8">
            <div>
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">
                Showcase Admin
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">자랑하기 관리</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
                방문객이 등록한 후기, 링크, 첨부 사진을 확인하고 필요 없는 게시글을 삭제합니다.
              </p>
            </div>
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

          <section className="mt-8 min-h-[36rem] border border-mist bg-white p-5 shadow-[0_24px_52px_-38px_rgba(7,59,58,0.42)] sm:p-6">
            <div className="flex flex-col gap-2 border-b border-mist pb-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold">자랑하기 게시판</h2>
              <span className="numeric text-sm font-bold text-foreground/48">총 {posts.length}개</span>
            </div>

            {posts.length > 0 ? (
              <ul className="mt-2 divide-y divide-mist">
                {posts.map((post) => (
                  <li key={post.id}>
                    <div className="grid gap-3 px-1 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-center sm:px-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-foreground">{post.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-lake/72">
                          <span>{post.authorName}</span>
                          <span>첨부 사진 {post.imageUrls.length}장</span>
                          {post.linkUrl ? <span>링크 있음</span> : null}
                        </div>
                        <p className="mt-2 line-clamp-1 text-sm leading-6 text-foreground/54">{post.content}</p>
                      </div>
                      <time dateTime={post.createdAt} className="numeric text-xs font-bold text-foreground/48 sm:text-right sm:text-sm">
                        {formatDate(post.createdAt)}
                      </time>
                      <form action={deleteAdminShowcasePostAction} className="sm:justify-self-end">
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
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[30rem] flex-col items-center justify-center border-y border-mist px-5 py-16 text-center">
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
