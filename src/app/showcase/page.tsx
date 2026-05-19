import type { Metadata } from "next";
import { ShowcaseGuide } from "@/components/home/ShowcaseGuide";
import { listShowcasePostsPage } from "@/lib/showcase/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "자랑하기 | 제천 ATV & 수상레저",
  description: "방문 후기, 사진, 링크를 직접 남길 수 있는 자랑하기 게시판입니다.",
};

type ShowcasePageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function ShowcasePage({ searchParams }: ShowcasePageProps) {
  const params = searchParams ? await searchParams : {};
  const showcasePage = await listShowcasePostsPage(params.page, 12);

  return (
    <main>
      <ShowcaseGuide showcasePage={showcasePage} />
    </main>
  );
}
