import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { getShowcasePost } from "@/lib/showcase/repository";

export const dynamic = "force-dynamic";

type ShowcaseDetailPageProps = {
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

const contentUrlPattern = /(https?:\/\/[^\s]+)/g;

function splitTrailingPunctuation(value: string) {
  const match = value.match(/[),.!?]+$/);

  if (!match) {
    return { url: value, trailing: "" };
  }

  return {
    url: value.slice(0, -match[0].length),
    trailing: match[0],
  };
}

function renderLinkedContent(content: string) {
  return content.split(contentUrlPattern).map((part, index) => {
    if (!part.match(/^https?:\/\//)) {
      return part;
    }

    const { url, trailing } = splitTrailingPunctuation(part);

    try {
      const parsed = new URL(url);

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return part;
      }
    } catch {
      return part;
    }

    return (
      <span key={`${url}-${index}`}>
        <a href={url} target="_blank" rel="noreferrer" className="font-bold text-lake underline decoration-lake/30 underline-offset-4 hover:text-sunset">
          {url}
        </a>
        {trailing}
      </span>
    );
  });
}

export async function generateMetadata({ params }: ShowcaseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getShowcasePost(id);

  if (!post) {
    return {
      title: "자랑하기 상세 | 제천 ATV & 수상레저",
    };
  }

  return {
    title: `${post.title} | 자랑하기`,
    description: post.content,
  };
}

export default async function ShowcaseDetailPage({ params }: ShowcaseDetailPageProps) {
  const { id } = await params;
  const post = await getShowcasePost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <section className="px-5 py-12 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-[1120px]">
          <Link href="/showcase" className="spring inline-flex items-center gap-2 text-sm font-bold text-foreground/62 hover:text-lake">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" weight="bold" />
            자랑하기 게시판으로
          </Link>

          <article className="mt-8 border border-foreground/12 bg-surface p-5 sm:p-8 lg:p-10">
            <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-bold uppercase text-lake">Showcase Detail</p>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-foreground/50">
              <span>{post.authorName}</span>
              <time dateTime={post.createdAt} className="numeric">
                {formatDate(post.createdAt)}
              </time>
            </div>

            <p className="mt-8 whitespace-pre-line text-base leading-8 text-ink-muted">{renderLinkedContent(post.content)}</p>

            {post.imageUrls.length > 0 ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {post.imageUrls.map((imageUrl, index) => (
                  <div key={imageUrl} className="relative aspect-[4/3] overflow-hidden border border-foreground/10 bg-mist">
                    <Image
                      src={imageUrl}
                      alt={`${post.title} 첨부 사진 ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 520px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}
