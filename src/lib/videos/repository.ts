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

function emptyVideoPage(rawPage: string | number | null | undefined, pageSize: number): VideoPostPage {
  const meta = normalizeVideoPage(rawPage, 0, pageSize);

  return {
    ...meta,
    items: [],
  };
}

export async function listVideoPostsPage(rawPage?: string | number | null, pageSize = 9): Promise<VideoPostPage> {
  try {
    const countRows = await supabaseRest<Array<{ id: string }>>("video_posts?select=id&is_published=eq.true&limit=10000");
    const meta = normalizeVideoPage(rawPage, countRows.length, pageSize);

    if (countRows.length === 0) {
      return {
        ...meta,
        items: [],
      };
    }

    const rows = await supabaseRest<SupabaseVideoPostRow[]>(
      `video_posts?select=${videoSelect}&is_published=eq.true&order=sort_order.asc,created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
    );

    return {
      ...meta,
      items: rows.map(toVideoPost),
    };
  } catch {
    return emptyVideoPage(rawPage, pageSize);
  }
}

export async function getVideoPost(id: string): Promise<VideoPost | null> {
  if (!uuidPattern.test(id)) {
    return null;
  }

  try {
    const rows = await supabaseRest<SupabaseVideoPostRow[]>(
      `video_posts?select=${videoSelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
    );

    return rows[0] ? toVideoPost(rows[0]) : null;
  } catch {
    return null;
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
