import type { MetadataRoute } from "next";
import { listGalleryPosts } from "@/lib/gallery/repository";
import {
  buildContentSitemapEntries,
  buildStaticSitemapEntries,
  getSiteUrl,
  type SitemapContentPost,
} from "@/lib/sitemap";
import { listShowcasePostsPage } from "@/lib/showcase/repository";
import { listStayPostsPage } from "@/lib/stay/repository";
import { listVideoPostsPage } from "@/lib/videos/repository";

export const dynamic = "force-dynamic";

type SitemapPostPage<T extends SitemapContentPost> = {
  items: T[];
  totalPages: number;
};

const pageSize = 24;

async function listAllPagedPosts<T extends SitemapContentPost>(loadPage: (page: number, pageSize: number) => Promise<SitemapPostPage<T>>) {
  const firstPage = await loadPage(1, pageSize);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) => loadPage(index + 2, pageSize)),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const [galleryPosts, showcasePosts, stayPosts, videoPosts] = await Promise.all([
    listGalleryPosts(),
    listAllPagedPosts(listShowcasePostsPage),
    listAllPagedPosts(listStayPostsPage),
    listAllPagedPosts(listVideoPostsPage),
  ]);

  return [
    ...buildStaticSitemapEntries(siteUrl, lastModified),
    ...buildContentSitemapEntries(siteUrl, "gallery", galleryPosts),
    ...buildContentSitemapEntries(siteUrl, "showcase", showcasePosts),
    ...buildContentSitemapEntries(siteUrl, "stay", stayPosts),
    ...buildContentSitemapEntries(siteUrl, "videos", videoPosts),
  ];
}
