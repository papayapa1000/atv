import type { MetadataRoute } from "next";

export type SitemapEnv = Record<string, string | undefined>;
export type SitemapContentPost = {
  id: string;
  createdAt: string | Date;
};

type SitemapChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type StaticRouteMetadata = {
  changeFrequency: SitemapChangeFrequency;
  priority: number;
};

export const publicSitemapPaths = [
  "/",
  "/water-ski-atv",
  "/activities",
  "/reservation",
  "/reservation/board",
  "/gallery",
  "/videos",
  "/showcase",
  "/stay",
] as const;

export const robotsDisallowPaths = ["/admin", "/reservation/write", "/reservation/board/", "/showcase/write", "/uploads"] as const;

const staticRouteMetadata: Record<(typeof publicSitemapPaths)[number], StaticRouteMetadata> = {
  "/": { changeFrequency: "daily", priority: 1 },
  "/water-ski-atv": { changeFrequency: "weekly", priority: 0.9 },
  "/activities": { changeFrequency: "weekly", priority: 0.8 },
  "/reservation": { changeFrequency: "weekly", priority: 0.8 },
  "/reservation/board": { changeFrequency: "daily", priority: 0.7 },
  "/gallery": { changeFrequency: "daily", priority: 0.7 },
  "/videos": { changeFrequency: "daily", priority: 0.7 },
  "/showcase": { changeFrequency: "daily", priority: 0.7 },
  "/stay": { changeFrequency: "weekly", priority: 0.7 },
};

function withHttpsProtocol(hostOrUrl: string) {
  return /^https?:\/\//i.test(hostOrUrl) ? hostOrUrl : `https://${hostOrUrl}`;
}

export function getSiteUrl(env: SitemapEnv = process.env) {
  const rawUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim() || "http://localhost:3000";

  return withHttpsProtocol(rawUrl).replace(/\/+$/, "");
}

export function toAbsoluteUrl(siteUrl: string, path: string) {
  return new URL(path, `${siteUrl.replace(/\/+$/, "")}/`).toString();
}

export function buildStaticSitemapEntries(siteUrl: string, lastModified = new Date()): MetadataRoute.Sitemap {
  return publicSitemapPaths.map((path) => ({
    url: toAbsoluteUrl(siteUrl, path),
    lastModified,
    ...staticRouteMetadata[path],
  }));
}

export function buildContentSitemapEntries(siteUrl: string, segment: string, posts: SitemapContentPost[]): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: toAbsoluteUrl(siteUrl, `/${segment}/${encodeURIComponent(post.id)}`),
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
}

export function buildRobotsConfig(siteUrl: string): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...robotsDisallowPaths],
    },
    sitemap: toAbsoluteUrl(siteUrl, "/sitemap.xml"),
  };
}
