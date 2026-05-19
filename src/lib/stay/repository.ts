import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import {
  countLocalStayPosts,
  createLocalStayPost,
  getLocalStayPost,
  listLocalStayPosts,
} from "./local-store";
import { normalizeStayPage, type StayPageMeta } from "./pagination";
import type { NormalizedStayPostForm } from "./validation";

export type SupabaseStayPostRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  title: string;
  price: string;
  content: string;
  image_urls: string[] | null;
  is_published: boolean;
  sort_order: number | null;
};

export type StayPost = {
  id: string;
  createdAt: string;
  title: string;
  price: string;
  content: string;
  imageUrls: string[];
  isPublished: boolean;
  sortOrder: number;
};

export type CreateStayPostInput = Omit<NormalizedStayPostForm, "imageFiles"> & {
  imageUrls: string[];
};

export type StayPostPage = StayPageMeta & {
  items: StayPost[];
};

const staySelect = "id,created_at,title,price,content,image_urls,is_published,sort_order";

function toStayPost(row: SupabaseStayPostRow): StayPost {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    price: row.price,
    content: row.content,
    imageUrls: row.image_urls ?? [],
    isPublished: row.is_published,
    sortOrder: row.sort_order ?? 0,
  };
}

function emptyStayPage(rawPage: string | number | null | undefined, pageSize: number): StayPostPage {
  const meta = normalizeStayPage(rawPage, 0, pageSize);

  return {
    ...meta,
    items: [],
  };
}

export async function listStayPostsPage(rawPage?: string | number | null, pageSize = 9): Promise<StayPostPage> {
  try {
    const countRows = await supabaseRest<Array<{ id: string }>>("stay_posts?select=id&is_published=eq.true&limit=10000");

    if (countRows.length === 0) {
      const localCount = await countLocalStayPosts();
      const meta = normalizeStayPage(rawPage, localCount, pageSize);
      const items = await listLocalStayPosts(meta.pageSize, meta.offset);

      return localCount > 0 ? { ...meta, items } : emptyStayPage(rawPage, pageSize);
    }

    const meta = normalizeStayPage(rawPage, countRows.length, pageSize);
    const rows = await supabaseRest<SupabaseStayPostRow[]>(
      `stay_posts?select=${staySelect}&is_published=eq.true&order=sort_order.asc,created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
    );

    return {
      ...meta,
      items: rows.map(toStayPost),
    };
  } catch {
    const localCount = await countLocalStayPosts();
    const meta = normalizeStayPage(rawPage, localCount, pageSize);
    const items = await listLocalStayPosts(meta.pageSize, meta.offset);

    return localCount > 0 ? { ...meta, items } : emptyStayPage(rawPage, pageSize);
  }
}

export async function listAdminStayPosts(limit = 100): Promise<StayPost[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  try {
    const rows = await supabaseRest<SupabaseStayPostRow[]>(
      `stay_posts?select=${staySelect}&order=created_at.desc&limit=${safeLimit}`,
    );

    return rows.length > 0 ? rows.map(toStayPost) : listLocalStayPosts(safeLimit, 0, true);
  } catch {
    return listLocalStayPosts(safeLimit, 0, true);
  }
}

export async function getStayPost(id: string): Promise<StayPost | null> {
  try {
    const rows = await supabaseRest<SupabaseStayPostRow[]>(
      `stay_posts?select=${staySelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
    );

    return rows[0] ? toStayPost(rows[0]) : null;
  } catch {
    return getLocalStayPost(id);
  }
}

export async function createStayPost(input: CreateStayPostInput) {
  try {
    const [created] = await supabaseRest<SupabaseStayPostRow[]>("stay_posts?select=id", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: input.title,
        price: input.price,
        content: input.content,
        image_urls: input.imageUrls,
        is_published: input.isPublished,
        sort_order: 0,
      }),
    });

    return created;
  } catch {
    return createLocalStayPost(input);
  }
}
