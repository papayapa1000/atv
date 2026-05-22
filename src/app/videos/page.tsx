import { VideoGuide } from "@/components/home/VideoGuide";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "동영상",
  description: "청풍호 수상레저와 ATV 현장 영상을 확인하세요.",
  path: "/videos",
  keywords: ["제천 수상레저 영상", "청풍호 ATV 영상"],
});

type VideosPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main>
      <VideoGuide page={params.page} />
    </main>
  );
}
