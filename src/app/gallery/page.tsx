import { GalleryPreview } from "@/components/home/GalleryPreview";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "갤러리",
  description: "청풍호 수상레저와 ATV 현장 사진, 영상, 단체 이용 장면을 확인하세요.",
  path: "/gallery",
  image: {
    path: "/images/hero-sunset-boat.webp",
    width: 1920,
    height: 864,
    alt: "청풍호 석양 아래 모터보트",
  },
  keywords: ["제천 수상레저 사진", "청풍호 레저 갤러리"],
});

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
