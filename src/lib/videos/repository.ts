import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import { normalizeVideoPage, type VideoPageMeta } from "./pagination";
import { getYouTubeThumbnailUrl } from "./youtube";
import type { ValidatedVideoPostForm, VideoSourceType } from "./validation";

export type SupabaseVideoPostRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  title: string;
  source_type: VideoSourceType;
  youtube_url: string | null;
  youtube_id: string | null;
  video_url: string | null;
  content: string;
  is_published: boolean;
  sort_order: number | null;
};

export type VideoPost = {
  id: string;
  createdAt: string;
  title: string;
  sourceType: VideoSourceType;
  youtubeUrl: string | null;
  youtubeId: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  content: string;
  isPublished: boolean;
  sortOrder: number;
};

export type VideoPostPage = VideoPageMeta & {
  items: VideoPost[];
};

export type CreateVideoPostInput = Omit<ValidatedVideoPostForm, "videoFile"> & {
  videoUrl: string | null;
};

export type UpdateVideoPostInput = CreateVideoPostInput & {
  id: string;
};

const videoSelect = "id,created_at,title,source_type,youtube_url,youtube_id,video_url,content,is_published,sort_order";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const fallbackVideoPosts: VideoPost[] = [
  {
    id: "sunset-water-ski-video",
    createdAt: "2026-05-01T10:00:00.000Z",
    title: "청풍호 석양 수상스키 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/sunset-ski.mp4",
    thumbnailUrl: null,
    content: "청풍호 물살과 석양 분위기를 영상으로 먼저 확인할 수 있습니다.",
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: "motorboat-speed-video",
    createdAt: "2026-05-01T09:00:00.000Z",
    title: "모터보트 질주 현장 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop.webm",
    thumbnailUrl: null,
    content: "청풍호 위에서 모터보트가 지나가는 속도감과 현장 분위기를 볼 수 있습니다.",
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: "atv-lakeside-course-video",
    createdAt: "2026-05-01T08:00:00.000Z",
    title: "ATV 호반 코스 주행 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v2.webm",
    thumbnailUrl: null,
    content: "ATV 체험 전 코스 분위기와 이동감을 미리 확인할 수 있는 영상입니다.",
    isPublished: true,
    sortOrder: 3,
  },
  {
    id: "workshop-water-leisure-video",
    createdAt: "2026-05-01T07:00:00.000Z",
    title: "단체 워크숍 수상레저 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v3.webm",
    thumbnailUrl: null,
    content: "단체 방문 시 이용 동선과 수상레저 분위기를 영상으로 살펴볼 수 있습니다.",
    isPublished: true,
    sortOrder: 4,
  },
  {
    id: "paddle-boat-video",
    createdAt: "2026-05-01T06:00:00.000Z",
    title: "청풍호 패들보트 체험 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v4.webm",
    thumbnailUrl: null,
    content: "가볍게 즐길 수 있는 청풍호 레저 체험 분위기를 담은 영상입니다.",
    isPublished: true,
    sortOrder: 5,
  },
  {
    id: "banana-boat-group-video",
    createdAt: "2026-04-30T10:00:00.000Z",
    title: "바나나보트 단체 탑승 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/sunset-ski.mp4",
    thumbnailUrl: null,
    content: "단체 이용객이 함께 즐기는 수상레저의 활기 있는 장면을 확인할 수 있습니다.",
    isPublished: true,
    sortOrder: 6,
  },
  {
    id: "waterski-lesson-video",
    createdAt: "2026-04-30T09:00:00.000Z",
    title: "수상스키 입문 강습 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v2.webm",
    thumbnailUrl: null,
    content: "처음 이용하는 고객도 강습 흐름을 미리 이해할 수 있도록 구성한 영상입니다.",
    isPublished: true,
    sortOrder: 7,
  },
  {
    id: "atv-family-course-video",
    createdAt: "2026-04-30T08:00:00.000Z",
    title: "ATV 가족 체험 코스 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v3.webm",
    thumbnailUrl: null,
    content: "가족 단위 방문객이 ATV 코스를 선택하기 전 참고할 수 있는 영상입니다.",
    isPublished: true,
    sortOrder: 8,
  },
  {
    id: "evening-leisure-scene-video",
    createdAt: "2026-04-30T07:00:00.000Z",
    title: "청풍호 저녁 레저 풍경 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop-v4.webm",
    thumbnailUrl: null,
    content: "저녁 시간대 청풍호의 밝고 여유로운 레저 분위기를 담았습니다.",
    isPublished: true,
    sortOrder: 9,
  },
  {
    id: "bandwagon-group-video",
    createdAt: "2026-04-30T06:00:00.000Z",
    title: "밴드웨건 단체 레저 영상",
    sourceType: "file",
    youtubeUrl: null,
    youtubeId: null,
    videoUrl: "/images/hero-cinematic-loop.webm",
    thumbnailUrl: null,
    content: "단체 방문객이 함께 이용하는 레저 분위기를 확인할 수 있는 2페이지 테스트용 샘플 영상입니다.",
    isPublished: true,
    sortOrder: 10,
  },
];

function toVideoPost(row: SupabaseVideoPostRow): VideoPost {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    sourceType: row.source_type,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
    videoUrl: row.video_url,
    thumbnailUrl: row.youtube_id ? getYouTubeThumbnailUrl(row.youtube_id) : null,
    content: row.content,
    isPublished: row.is_published,
    sortOrder: row.sort_order ?? 0,
  };
}

function fallbackById(id: string) {
  return fallbackVideoPosts.find((post) => post.id === id) ?? null;
}

function fallbackVideoPage(rawPage: string | number | null | undefined, pageSize: number): VideoPostPage {
  const meta = normalizeVideoPage(rawPage, fallbackVideoPosts.length, pageSize);

  return {
    ...meta,
    items: fallbackVideoPosts.slice(meta.offset, meta.offset + meta.pageSize),
  };
}

export async function listVideoPostsPage(rawPage?: string | number | null, pageSize = 9): Promise<VideoPostPage> {
  try {
    const countRows = await supabaseRest<Array<{ id: string }>>("video_posts?select=id&is_published=eq.true&limit=10000");

    if (countRows.length === 0) {
      return fallbackVideoPage(rawPage, pageSize);
    }

    const meta = normalizeVideoPage(rawPage, countRows.length, pageSize);
    const rows = await supabaseRest<SupabaseVideoPostRow[]>(
      `video_posts?select=${videoSelect}&is_published=eq.true&order=sort_order.asc,created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
    );

    return {
      ...meta,
      items: rows.map(toVideoPost),
    };
  } catch {
    return fallbackVideoPage(rawPage, pageSize);
  }
}

export async function getVideoPost(id: string): Promise<VideoPost | null> {
  if (!uuidPattern.test(id)) {
    return fallbackById(id);
  }

  try {
    const rows = await supabaseRest<SupabaseVideoPostRow[]>(
      `video_posts?select=${videoSelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
    );

    return rows[0] ? toVideoPost(rows[0]) : null;
  } catch {
    return fallbackById(id);
  }
}

export async function listAdminVideoPosts(limit = 100): Promise<VideoPost[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const rows = await supabaseRest<SupabaseVideoPostRow[]>(`video_posts?select=${videoSelect}&order=created_at.desc&limit=${safeLimit}`);

  return rows.map(toVideoPost);
}

export async function createVideoPost(input: CreateVideoPostInput) {
  const [created] = await supabaseRest<SupabaseVideoPostRow[]>("video_posts?select=id", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title: input.title,
      source_type: input.sourceType,
      youtube_url: input.youtubeUrl,
      youtube_id: input.youtubeId,
      video_url: input.videoUrl,
      content: input.content,
      is_published: input.isPublished,
      sort_order: 0,
    }),
  });

  return created;
}

export async function updateVideoPost(input: UpdateVideoPostInput) {
  const [updated] = await supabaseRest<Array<{ id: string }>>(
    `video_posts?select=id&id=eq.${encodeURIComponent(input.id)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: input.title,
        source_type: input.sourceType,
        youtube_url: input.youtubeUrl,
        youtube_id: input.youtubeId,
        video_url: input.videoUrl,
        content: input.content,
        is_published: input.isPublished,
      }),
    },
  );

  return updated;
}

export async function deleteVideoPost(id: string) {
  const rows = await supabaseRest<SupabaseVideoPostRow[]>(`video_posts?select=${videoSelect}&id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=representation",
    },
  });

  return rows[0] ? toVideoPost(rows[0]) : null;
}
