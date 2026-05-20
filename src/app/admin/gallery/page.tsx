import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/ssr";
import { deleteAdminGalleryPostAction } from "@/app/admin/actions";
import { AdminDeleteConfirmButton } from "@/components/admin/AdminDeleteConfirmButton";
import { AdminGalleryPostEditModal } from "@/components/admin/AdminGalleryPostEditModal";
import { AdminGalleryPostForm } from "@/components/admin/AdminGalleryPostForm";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { listAdminGalleryPosts, type GalleryPost } from "@/lib/gallery/repository";
import { requireAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "갤러리 관리 | 제천 ATV & 수상레저",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminGalleryPageProps = {
  searchParams?: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
};

export default async function AdminGalleryPage({ searchParams }: AdminGalleryPageProps) {
  await requireAdminSession();
  const params = searchParams ? await searchParams : {};
  let posts: GalleryPost[] = [];
  let loadError = "";

  try {
    posts = await listAdminGalleryPosts();
  } catch {
    loadError = "갤러리 목록을 불러오지 못했습니다. Supabase 설정과 gallery_posts 테이블을 확인해 주세요.";
  }

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="gallery" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 border-b border-foreground/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">Gallery Admin</p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">갤러리 관리</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">갤러리 상세페이지에 표시할 제목, 이미지, 설명을 등록합니다.</p>
            </div>
            <Link
              href="/gallery"
              className="spring inline-flex w-fit items-center justify-center border border-foreground/14 bg-surface px-5 py-3 text-sm font-bold text-foreground/70 hover:border-lake hover:text-lake"
            >
              공개 갤러리 보기
            </Link>
          </div>

          {params.created ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">갤러리 글이 등록되었습니다.</div>
          ) : null}

          {params.updated ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">갤러리 글이 수정되었습니다.</div>
          ) : null}

          {params.deleted ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">갤러리 글이 삭제되었습니다.</div>
          ) : null}

          {params.error ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">요청을 처리하지 못했습니다. 입력값과 Supabase 설정을 확인해 주세요.</div>
          ) : null}

          {loadError ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">{loadError}</div>
          ) : null}

          <div className="mt-8 grid gap-8 xl:grid-cols-[28rem_1fr]">
            <aside className="h-fit border border-foreground/12 bg-surface p-5 sm:p-6">
              <h2 className="text-xl font-semibold">새 갤러리 등록</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/58">등록 후 공개 상태라면 갤러리 목록과 상세페이지에 바로 표시됩니다.</p>
              <div className="mt-6">
                <AdminGalleryPostForm />
              </div>
            </aside>

            <section className="min-h-[36rem] border border-foreground/12 bg-surface p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-4">
                <h2 className="text-xl font-semibold">등록된 갤러리</h2>
                <span className="numeric text-sm font-bold text-foreground/48">{posts.length}개</span>
              </div>

              {posts.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {posts.map((post) => (
                    <article key={post.id} className="border border-foreground/12 bg-white">
                      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                        <Image src={post.imageUrl} alt={post.title} fill sizes="(min-width: 1280px) 28vw, 50vw" className="object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-bold leading-6">{post.title}</h3>
                          <span className={`inline-flex shrink-0 items-center gap-1 border px-2 py-1 text-[0.68rem] font-bold ${post.isPublished ? "border-lake/24 bg-lake/10 text-lake" : "border-foreground/12 bg-surface-muted text-foreground/48"}`}>
                            {post.isPublished ? (
                              <Eye aria-hidden="true" className="h-3.5 w-3.5" weight="bold" />
                            ) : (
                              <EyeSlash aria-hidden="true" className="h-3.5 w-3.5" weight="bold" />
                            )}
                            {post.isPublished ? "공개" : "비공개"}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/58">{post.content}</p>
                        <p className="mt-3 text-xs font-bold text-lake">첨부 이미지 {post.imageUrls.length}장</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {post.isPublished ? (
                            <Link href={`/gallery/${post.id}`} className="spring inline-flex border border-lake/20 px-3 py-2 text-sm font-bold text-lake hover:bg-lake hover:text-white">
                              상세페이지 보기
                            </Link>
                          ) : null}
                          <AdminGalleryPostEditModal post={post} />
                          <AdminDeleteConfirmButton id={post.id} action={deleteAdminGalleryPostAction} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[30rem] flex-col items-center justify-center px-5 py-16 text-center">
                  <p className="text-lg font-semibold">등록된 갤러리 글이 없습니다.</p>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">왼쪽 등록 영역에서 첫 갤러리 글을 추가해 주세요.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
