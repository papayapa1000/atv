import { StayGuide } from "@/components/home/StayGuide";
import { buildPageMetadata } from "@/lib/seo";
import { listStayPostsPage } from "@/lib/stay/repository";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "주변 숙박",
  description: "제천 수상레저와 ATV 이용 전후로 함께 확인하기 좋은 청풍호 주변 숙박 정보를 안내합니다.",
  path: "/stay",
  image: {
    path: "/images/stay-cheongpung-resort.webp",
    alt: "청풍호 주변 숙박 시설",
  },
  keywords: ["제천 청풍호 숙박", "청풍호 주변 펜션", "제천 수상레저 숙박"],
});

type StayPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function StayPage({ searchParams }: StayPageProps) {
  const params = searchParams ? await searchParams : {};
  const stayPage = await listStayPostsPage(params.page, 12);

  return (
    <main>
      <StayGuide stayPage={stayPage} />
    </main>
  );
}
