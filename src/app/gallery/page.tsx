import type { Metadata } from "next";
import { GalleryPreview } from "@/components/home/GalleryPreview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "갤러리 | 제천 ATV & 수상레저",
  description: "청풍호 수상레저와 ATV 현장 사진, 영상, 단체 이용 장면을 확인하세요.",
};

type GalleryPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main>
      <GalleryPreview page={params.page} />
    </main>
  );
}
