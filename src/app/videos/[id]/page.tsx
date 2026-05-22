import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { buildPageMetadata } from "@/lib/seo";
import { getVideoPost } from "@/lib/videos/repository";
import { getYouTubeEmbedUrl } from "@/lib/videos/youtube";

export const dynamic = "force-dynamic";

type VideoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getVideoPost(id);

  if (!post) {
    return buildPageMetadata({
      title: "동영상 상세",
      description: "청풍호 수상레저와 ATV 현장 영상을 확인하세요.",
      path: `/videos/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${post.title} | 동영상`,
    description: post.content,
    path: `/videos/${id}`,
    image: post.thumbnailUrl
      ? {
          path: post.thumbnailUrl,
          alt: post.title,
        }
      : undefined,
    keywords: ["제천 수상레저 영상", post.title],
  });
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;
  const post = await getVideoPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="depth-warm min-h-screen bg-background text-foreground">
      <section className="px-5 py-12 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/videos" className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            동영상
          </Link>

          <article className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_30rem]">
            <div className="depth-panel-quiet aspect-video overflow-hidden border border-mist bg-mist">
              {post.sourceType === "youtube" && post.youtubeId ? (
                <iframe
                  src={getYouTubeEmbedUrl(post.youtubeId)}
                  title={post.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : post.videoUrl ? (
                <video src={post.videoUrl} className="h-full w-full bg-foreground object-contain" controls preload="metadata" playsInline />
              ) : null}
            </div>

            <div className="border border-foreground/12 bg-surface/92 p-6 shadow-[0_24px_70px_rgba(36,64,67,0.10)] sm:p-8">
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">Video Detail</p>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl lg:text-4xl xl:text-5xl">{post.title}</h1>
              <time dateTime={post.createdAt} className="numeric mt-5 block text-sm font-bold text-foreground/46">
                {new Intl.DateTimeFormat("ko-KR", {
                  timeZone: "Asia/Seoul",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(post.createdAt))}
              </time>
              <p className="mt-8 whitespace-pre-line text-base leading-8 text-ink-muted">{post.content}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
