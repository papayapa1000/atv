import { ShowcaseGuide } from "@/components/home/ShowcaseGuide";
import { buildPageMetadata } from "@/lib/seo";
import { listShowcasePostsPage } from "@/lib/showcase/repository";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "자랑하기",
  description: "제천 청풍호 수상레저와 ATV를 이용한 방문 후기, 사진, 링크를 확인할 수 있는 자랑하기 게시판입니다.",
  path: "/showcase",
  keywords: ["제천 수상레저 후기", "청풍호 ATV 후기"],
});

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
