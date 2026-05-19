import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { getGalleryPost } from "@/lib/gallery/repository";

export const dynamic = "force-dynamic";

type GalleryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getGalleryPost(id);

  if (!post) {
    return {
      title: "갤러리 상세 | 제천 ATV & 수상레저",
    };
  }

  return {
    title: `${post.title} | 갤러리`,
    description: post.content,
  };
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = await params;
  const post = await getGalleryPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="depth-warm min-h-screen bg-background text-foreground">
      <section className="px-5 py-12 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/gallery" className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            갤러리
          </Link>

          <article className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_30rem]">
            <div className="depth-panel-quiet relative aspect-[4/3] overflow-hidden border border-mist bg-mist lg:aspect-[16/10]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 62vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="border border-foreground/12 bg-surface/92 p-6 shadow-[0_24px_70px_rgba(36,64,67,0.10)] sm:p-8">
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">Gallery Detail</p>
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
