import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import {
  countLocalShowcasePosts,
  createLocalShowcasePost,
  deleteLocalShowcasePost,
  getLocalShowcasePost,
  listLocalShowcasePosts,
} from "./local-store";
import { normalizeShowcasePage, type NormalizedShowcasePostForm, type ShowcasePageMeta } from "./validation";

export type SupabaseShowcasePostRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  author_name: string;
  title: string;
  content: string;
  link_url: string | null;
  image_urls: string[] | null;
  is_published: boolean;
  sort_order: number | null;
};

export type ShowcasePost = {
  id: string;
  createdAt: string;
  authorName: string;
  title: string;
  content: string;
  linkUrl: string | null;
  imageUrls: string[];
  isPublished: boolean;
  sortOrder: number;
};

export type CreateShowcasePostInput = Omit<NormalizedShowcasePostForm, "imageFiles"> & {
  imageUrls: string[];
};

export type ShowcasePostPage = ShowcasePageMeta & {
  items: ShowcasePost[];
};

const showcaseSelect = "id,created_at,author_name,title,content,link_url,image_urls,is_published,sort_order";

export const fallbackShowcasePosts: ShowcasePost[] = [
  {
    id: "family-water-leisure-review",
    createdAt: "2026-05-01T09:00:00.000Z",
    authorName: "가족 방문객",
    title: "아이들과 함께 즐긴 청풍호 수상레저",
    content: "처음 방문했는데 안내가 친절했고 바나나보트와 모터보트를 함께 즐기기 좋았습니다.",
    linkUrl: null,
    imageUrls: ["/images/banana-boat.webp"],
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: "atv-lakeside-review",
    createdAt: "2026-05-01T08:00:00.000Z",
    authorName: "ATV 이용객",
    title: "호반 코스 ATV 후기",
    content: "청풍호 풍경을 보면서 달리는 코스라 사진도 잘 나오고 단체 일정으로도 만족스러웠습니다.",
    linkUrl: null,
    imageUrls: ["/images/atv-lakeside.webp"],
    isPublished: true,
    sortOrder: 2,
  },
];

function toShowcasePost(row: SupabaseShowcasePostRow): ShowcasePost {
  return {
    id: row.id,
    createdAt: row.created_at,
    authorName: row.author_name,
    title: row.title,
    content: row.content,
    linkUrl: row.link_url,
    imageUrls: row.image_urls ?? [],
    isPublished: row.is_published,
    sortOrder: row.sort_order ?? 0,
  };
}

function emptyShowcasePage(rawPage: string | number | null | undefined, pageSize: number): ShowcasePostPage {
  const meta = normalizeShowcasePage(rawPage, 0, pageSize);

  return {
    ...meta,
    items: [],
  };
}

export async function listShowcasePostsPage(rawPage?: string | number | null, pageSize = 12): Promise<ShowcasePostPage> {
  try {
    const countRows = await supabaseRest<Array<{ id: string }>>("showcase_posts?select=id&is_published=eq.true&limit=10000");
    const meta = normalizeShowcasePage(rawPage, countRows.length, pageSize);
    const rows = await supabaseRest<SupabaseShowcasePostRow[]>(
      `showcase_posts?select=${showcaseSelect}&is_published=eq.true&order=created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
    );

    return {
      ...meta,
      items: rows.map(toShowcasePost),
    };
  } catch {
    const localCount = await countLocalShowcasePosts();
    const meta = normalizeShowcasePage(rawPage, localCount, pageSize);
    const items = await listLocalShowcasePosts(meta.pageSize, meta.offset);

    return localCount > 0 ? { ...meta, items } : emptyShowcasePage(rawPage, pageSize);
  }
}

export async function listShowcasePosts(limit = 12): Promise<ShowcasePost[]> {
  const page = await listShowcasePostsPage(1, limit);

  return page.items;
}

export async function listAdminShowcasePosts(limit = 100): Promise<ShowcasePost[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  try {
    const rows = await supabaseRest<SupabaseShowcasePostRow[]>(
      `showcase_posts?select=${showcaseSelect}&order=created_at.desc&limit=${safeLimit}`,
    );

    return rows.map(toShowcasePost);
  } catch {
    return listLocalShowcasePosts(safeLimit);
  }
}

export async function getShowcasePost(id: string): Promise<ShowcasePost | null> {
  try {
    const rows = await supabaseRest<SupabaseShowcasePostRow[]>(
      `showcase_posts?select=${showcaseSelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
    );

    return rows[0] ? toShowcasePost(rows[0]) : null;
  } catch {
    return getLocalShowcasePost(id);
  }
}

export async function createShowcasePost(input: CreateShowcasePostInput) {
  try {
    const [created] = await supabaseRest<SupabaseShowcasePostRow[]>("showcase_posts?select=id", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        author_name: input.authorName,
        title: input.title,
        content: input.content,
        link_url: input.linkUrl || null,
        image_urls: input.imageUrls,
        is_published: true,
        sort_order: 0,
      }),
    });

    return created;
  } catch {
    return createLocalShowcasePost(input);
  }
}

export async function deleteShowcasePost(id: string) {
  try {
    const rows = await supabaseRest<SupabaseShowcasePostRow[]>(
      `showcase_posts?select=${showcaseSelect}&id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Prefer: "return=representation",
        },
      },
    );

    return rows[0] ? toShowcasePost(rows[0]) : null;
  } catch {
    const post = await getLocalShowcasePost(id);
    await deleteLocalShowcasePost(id);

    return post;
  }
}
