import type { Metadata } from "next";
import { StayGuide } from "@/components/home/StayGuide";
import { listStayPostsPage } from "@/lib/stay/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "주변 숙박 | 제천 ATV & 수상레저",
  description: "제천 수상레저와 ATV 이용 전후로 함께 확인하기 좋은 주변 숙박 정보를 안내합니다.",
};

type StayPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function StayPage({ searchParams }: StayPageProps) {
  const params = searchParams ? await searchParams : {};
  const stayPage = await listStayPostsPage(params.page, 9);

  return (
    <main>
      <StayGuide stayPage={stayPage} />
    </main>
  );
}
