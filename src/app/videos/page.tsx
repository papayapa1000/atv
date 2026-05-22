import type { Metadata } from "next";
import { VideoGuide } from "@/components/home/VideoGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "동영상 | 제천 수상레저 & 청풍 ATV",
  description: "청풍호 수상레저와 ATV 현장 영상을 확인하세요.",
};

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
