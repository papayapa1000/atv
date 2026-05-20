import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import { normalizeGalleryImageUrls, serializeLegacyGalleryImageUrl } from "./image-urls";
import { normalizeGalleryPage, type GalleryPageMeta } from "./pagination";
import type { NormalizedGalleryPostForm } from "./validation";

export type SupabaseGalleryPostRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  title: string;
  image_url: string;
  image_urls?: string[] | null;
  content: string;
  is_published: boolean;
  sort_order: number | null;
};

export type GalleryPost = {
  id: string;
  createdAt: string;
  title: string;
  imageUrl: string;
  imageUrls: string[];
  content: string;
  isPublished: boolean;
  sortOrder: number;
};

export type GalleryPostPage = GalleryPageMeta & {
  items: GalleryPost[];
};

export type CreateGalleryPostInput = Omit<NormalizedGalleryPostForm, "imageFiles"> & {
  imageUrls: string[];
};

export type UpdateGalleryPostInput = CreateGalleryPostInput & {
  id: string;
};

const gallerySelect = "id,created_at,title,image_url,image_urls,content,is_published,sort_order";
const legacyGallerySelect = "id,created_at,title,image_url,content,is_published,sort_order";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const fallbackGalleryPosts: GalleryPost[] = [
  {
    id: "sunset-motorboat",
    createdAt: "2026-05-01T09:00:00.000Z",
    title: "청풍호 석양 아래 모터보트",
    imageUrl: "/images/hero-sunset-boat.webp",
    imageUrls: ["/images/hero-sunset-boat.webp"],
    content: "청풍호의 넓은 수면과 석양이 함께 보이는 대표 장면입니다. 모터보트 코스는 방문 시간과 인원에 맞춰 현장에서 안전 안내 후 진행합니다.",
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: "atv-family",
    createdAt: "2026-05-01T09:01:00.000Z",
    title: "ATV를 즐기는 가족",
    imageUrl: "/images/atv-family.webp",
    imageUrls: ["/images/atv-family.webp"],
    content: "가족 단위 방문객이 함께 즐기기 좋은 ATV 코스입니다. 주행 전 조작법과 안전 수칙을 안내하고 현장 상황에 맞춰 코스를 운영합니다.",
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: "workshop-water-leisure",
    createdAt: "2026-05-01T09:02:00.000Z",
    title: "단체 워크숍 수상레저",
    imageUrl: "/images/workshop.webp",
    imageUrls: ["/images/workshop.webp"],
    content: "워크숍, 동호회, 학교 단체 일정에 맞춰 수상레저와 주변 관광 동선을 함께 구성할 수 있습니다.",
    isPublished: true,
    sortOrder: 3,
  },
  {
    id: "paddle-boat",
    createdAt: "2026-05-01T09:03:00.000Z",
    title: "청풍호 패들보트",
    imageUrl: "/images/paddle-boat.webp",
    imageUrls: ["/images/paddle-boat.webp"],
    content: "물 위에서 여유롭게 시간을 보내고 싶은 방문객에게 어울리는 장면입니다. 현장 운영 상황에 따라 이용 가능 프로그램을 안내합니다.",
    isPublished: true,
    sortOrder: 4,
  },
  {
    id: "night-party",
    createdAt: "2026-05-01T09:04:00.000Z",
    title: "청풍호 야간 파티",
    imageUrl: "/images/night-party.webp",
    imageUrls: ["/images/night-party.webp"],
    content: "단체 일정 이후 이어지는 야간 분위기를 담은 사진입니다. 숙박과 연계한 일정은 방문 날짜와 인원 기준으로 상담합니다.",
    isPublished: true,
    sortOrder: 5,
  },
  {
    id: "motorboat-run",
    createdAt: "2026-05-01T09:05:00.000Z",
    title: "청풍호 모터보트 주행",
    imageUrl: "/images/motorboat.webp",
    imageUrls: ["/images/motorboat.webp"],
    content: "청풍호 풍경을 빠르게 둘러보는 모터보트 주행 장면입니다. 기상과 수면 상태를 확인한 뒤 안전하게 운행합니다.",
    isPublished: true,
    sortOrder: 6,
  },
  {
    id: "waterski-lesson",
    createdAt: "2026-05-01T09:06:00.000Z",
    title: "수상스키 강습 현장",
    imageUrl: "/images/waterski-rental.webp",
    imageUrls: ["/images/waterski-rental.webp"],
    content: "초보자도 안전하게 시작할 수 있도록 장비 착용과 자세 안내를 먼저 진행합니다. 현장 상황과 숙련도에 맞춰 강습 흐름을 조정합니다.",
    isPublished: true,
    sortOrder: 7,
  },
  {
    id: "atv-lakeside-course",
    createdAt: "2026-05-01T09:07:00.000Z",
    title: "청풍호 ATV 호반 코스",
    imageUrl: "/images/atv-lakeside.webp",
    imageUrls: ["/images/atv-lakeside.webp"],
    content: "청풍호 주변 풍경을 따라 달리는 ATV 코스입니다. 주행 전 안전 안내를 거친 뒤 방문 인원과 코스 상황에 맞춰 운영합니다.",
    isPublished: true,
    sortOrder: 8,
  },
  {
    id: "banana-boat-group",
    createdAt: "2026-05-01T09:08:00.000Z",
    title: "바나나보트 단체 체험",
    imageUrl: "/images/banana-boat.webp",
    imageUrls: ["/images/banana-boat.webp"],
    content: "친구, 가족, 단체 방문객이 함께 즐기기 좋은 대표 수상 놀이기구입니다. 탑승 전 안전 장비와 유의사항을 안내합니다.",
    isPublished: true,
    sortOrder: 9,
  },
  {
    id: "bandwagon-lake-leisure",
    createdAt: "2026-05-01T09:09:00.000Z",
    title: "청풍호 밴드웨건 레저",
    imageUrl: "/images/bandwagon.webp",
    imageUrls: ["/images/bandwagon.webp"],
    content: "여러 명이 함께 즐길 수 있는 청풍호 수상레저 장면입니다. 2페이지 페이징 확인을 위한 샘플 데이터입니다.",
    isPublished: true,
    sortOrder: 10,
  },
];

function toGalleryPost(row: SupabaseGalleryPostRow): GalleryPost {
  const imageUrls = normalizeGalleryImageUrls(row.image_url, row.image_urls);

  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    imageUrl: imageUrls[0],
    imageUrls,
    content: row.content,
    isPublished: row.is_published,
    sortOrder: row.sort_order ?? 0,
  };
}

function fallbackById(id: string) {
  return fallbackGalleryPosts.find((post) => post.id === id) ?? null;
}

function fallbackGalleryPage(rawPage: string | number | null | undefined, pageSize: number): GalleryPostPage {
  const meta = normalizeGalleryPage(rawPage, fallbackGalleryPosts.length, pageSize);

  return {
    ...meta,
    items: fallbackGalleryPosts.slice(meta.offset, meta.offset + meta.pageSize),
  };
}

function isMissingGalleryImageUrlsColumnError(error: unknown) {
  return error instanceof Error && error.message.includes("gallery_posts") && error.message.includes("image_urls");
}

async function listLegacyGalleryPosts(): Promise<GalleryPost[]> {
  const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
    `gallery_posts?select=${legacyGallerySelect}&is_published=eq.true&order=sort_order.asc,created_at.desc`,
  );

  return rows.length > 0 ? rows.map(toGalleryPost) : fallbackGalleryPosts;
}

async function listLegacyAdminGalleryPosts(limit: number): Promise<GalleryPost[]> {
  const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
    `gallery_posts?select=${legacyGallerySelect}&order=created_at.desc&limit=${limit}`,
  );

  return rows.map(toGalleryPost);
}

async function getLegacyGalleryPost(id: string) {
  const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
    `gallery_posts?select=${legacyGallerySelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
  );

  return rows[0] ? toGalleryPost(rows[0]) : null;
}

async function createLegacyGalleryPost(input: CreateGalleryPostInput) {
  const [created] = await supabaseRest<SupabaseGalleryPostRow[]>("gallery_posts?select=id", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title: input.title,
      image_url: serializeLegacyGalleryImageUrl(input.imageUrls),
      content: input.content,
      is_published: input.isPublished,
      sort_order: 0,
    }),
  });

  return created;
}

async function updateLegacyGalleryPost(input: UpdateGalleryPostInput) {
  const [updated] = await supabaseRest<Array<{ id: string }>>(
    `gallery_posts?select=id&id=eq.${encodeURIComponent(input.id)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: input.title,
        image_url: serializeLegacyGalleryImageUrl(input.imageUrls),
        content: input.content,
        is_published: input.isPublished,
      }),
    },
  );

  return updated;
}

export async function listGalleryPosts(): Promise<GalleryPost[]> {
  try {
    const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
      `gallery_posts?select=${gallerySelect}&is_published=eq.true&order=sort_order.asc,created_at.desc`,
    );

    return rows.length > 0 ? rows.map(toGalleryPost) : fallbackGalleryPosts;
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      return listLegacyGalleryPosts();
    }

    return fallbackGalleryPosts;
  }
}

export async function listGalleryPostsPage(rawPage?: string | number | null, pageSize = 9): Promise<GalleryPostPage> {
  try {
    const countRows = await supabaseRest<Array<{ id: string }>>("gallery_posts?select=id&is_published=eq.true&limit=10000");

    if (countRows.length === 0) {
      return fallbackGalleryPage(rawPage, pageSize);
    }

    const meta = normalizeGalleryPage(rawPage, countRows.length, pageSize);
    const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
      `gallery_posts?select=${gallerySelect}&is_published=eq.true&order=sort_order.asc,created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
    );

    return {
      ...meta,
      items: rows.map(toGalleryPost),
    };
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      const countRows = await supabaseRest<Array<{ id: string }>>("gallery_posts?select=id&is_published=eq.true&limit=10000");

      if (countRows.length === 0) {
        return fallbackGalleryPage(rawPage, pageSize);
      }

      const meta = normalizeGalleryPage(rawPage, countRows.length, pageSize);
      const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
        `gallery_posts?select=${legacyGallerySelect}&is_published=eq.true&order=sort_order.asc,created_at.desc&limit=${meta.pageSize}&offset=${meta.offset}`,
      );

      return {
        ...meta,
        items: rows.map(toGalleryPost),
      };
    }

    return fallbackGalleryPage(rawPage, pageSize);
  }
}

export async function getGalleryPost(id: string): Promise<GalleryPost | null> {
  if (!uuidPattern.test(id)) {
    return fallbackById(id);
  }

  try {
    const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
      `gallery_posts?select=${gallerySelect}&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`,
    );

    return rows[0] ? toGalleryPost(rows[0]) : null;
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      return getLegacyGalleryPost(id);
    }

    return fallbackById(id);
  }
}

export async function listAdminGalleryPosts(limit = 100): Promise<GalleryPost[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  try {
    const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
      `gallery_posts?select=${gallerySelect}&order=created_at.desc&limit=${safeLimit}`,
    );

    return rows.map(toGalleryPost);
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      return listLegacyAdminGalleryPosts(safeLimit);
    }

    throw error;
  }
}

export async function createGalleryPost(input: CreateGalleryPostInput) {
  try {
    const [created] = await supabaseRest<SupabaseGalleryPostRow[]>("gallery_posts?select=id", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: input.title,
        image_url: input.imageUrls[0],
        image_urls: input.imageUrls,
        content: input.content,
        is_published: input.isPublished,
        sort_order: 0,
      }),
    });

    return created;
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      return createLegacyGalleryPost(input);
    }

    throw error;
  }
}

export async function updateGalleryPost(input: UpdateGalleryPostInput) {
  try {
    const [updated] = await supabaseRest<Array<{ id: string }>>(
      `gallery_posts?select=id&id=eq.${encodeURIComponent(input.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          title: input.title,
          image_url: input.imageUrls[0],
          image_urls: input.imageUrls,
          content: input.content,
          is_published: input.isPublished,
        }),
      },
    );

    return updated;
  } catch (error) {
    if (isMissingGalleryImageUrlsColumnError(error)) {
      return updateLegacyGalleryPost(input);
    }

    throw error;
  }
}

export async function deleteGalleryPost(id: string) {
  const rows = await supabaseRest<SupabaseGalleryPostRow[]>(
    `gallery_posts?select=${gallerySelect}&id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=representation",
      },
    },
  );

  return rows[0] ? toGalleryPost(rows[0]) : null;
}
