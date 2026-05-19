import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { LinkedContent } from "@/components/common/LinkedContent";
import { getStayPost } from "@/lib/stay/repository";

export const dynamic = "force-dynamic";

type StayDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export async function generateMetadata({ params }: StayDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getStayPost(id);

  if (!post) {
    return {
      title: "주변 숙박 상세 | 제천 ATV & 수상레저",
    };
  }

  return {
    title: `${post.title} | 주변 숙박`,
    description: post.content,
  };
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { id } = await params;
  const post = await getStayPost(id);

  if (!post) {
    notFound();
  }

  const [mainImageUrl, ...extraImageUrls] = post.imageUrls;

  return (
    <main className="depth-warm min-h-screen bg-background text-foreground">
      <section className="px-5 py-12 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/stay" className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            주변 숙박
          </Link>

          <article className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_30rem]">
            <div className="grid gap-4">
              <div className="depth-panel-quiet relative aspect-[4/3] overflow-hidden border border-mist bg-mist lg:aspect-[16/10]">
                <Image
                  src={mainImageUrl ?? "/images/workshop.webp"}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 62vw, 100vw"
                  className="object-cover"
                />
              </div>

              {extraImageUrls.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {extraImageUrls.map((imageUrl, index) => (
                    <div key={imageUrl} className="relative aspect-[4/3] overflow-hidden border border-mist bg-mist">
                      <Image
                        src={imageUrl}
                        alt={`${post.title} 첨부 이미지 ${index + 2}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="border border-foreground/12 bg-surface/92 p-6 shadow-[0_24px_70px_rgba(36,64,67,0.10)] sm:p-8">
              <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">Stay Detail</p>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl lg:text-4xl xl:text-5xl">{post.title}</h1>
              <p className="numeric mt-5 text-2xl font-extrabold text-lake">{post.price}</p>
              <time dateTime={post.createdAt} className="numeric mt-5 block text-sm font-bold text-foreground/46">
                {formatDate(post.createdAt)}
              </time>
              <p className="mt-8 whitespace-pre-line text-base leading-8 text-ink-muted">
                <LinkedContent content={post.content} />
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
