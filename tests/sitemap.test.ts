import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContentSitemapEntries,
  buildRobotsConfig,
  buildStaticSitemapEntries,
  getSiteUrl,
  publicSitemapPaths,
} from "../src/lib/sitemap";

test("getSiteUrl normalizes explicit and Vercel deployment URLs", () => {
  assert.equal(
    getSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://www.example.com/",
    }),
    "https://www.example.com",
  );

  assert.equal(
    getSiteUrl({
      VERCEL_PROJECT_PRODUCTION_URL: "jecheon.example.com",
    }),
    "https://jecheon.example.com",
  );

  assert.equal(getSiteUrl({}), "http://localhost:3000");
});

test("static sitemap paths include only public indexable routes", () => {
  assert.deepEqual(publicSitemapPaths, ["/", "/water-ski-atv", "/activities", "/reservation", "/reservation/board", "/gallery", "/videos", "/showcase", "/stay"]);

  const entries = buildStaticSitemapEntries("https://www.example.com", new Date("2026-05-22T00:00:00.000Z"));
  const urls = entries.map((entry) => entry.url);

  assert.equal(urls.includes("https://www.example.com/admin"), false);
  assert.equal(urls.includes("https://www.example.com/reservation/write"), false);
  assert.equal(urls.includes("https://www.example.com/showcase/write"), false);
  assert.equal(urls.includes("https://www.example.com/uploads/stay/example.jpg"), false);
  assert.equal(urls[0], "https://www.example.com/");
  assert.equal(urls.includes("https://www.example.com/gallery"), true);
});

test("content sitemap entries use detail routes and post creation dates", () => {
  const entries = buildContentSitemapEntries("https://www.example.com", "gallery", [
    { id: "sunset motorboat", createdAt: "2026-05-01T09:00:00.000Z" },
    { id: "atv-family", createdAt: "2026-05-02T09:00:00.000Z" },
  ]);

  assert.deepEqual(
    entries.map((entry) => entry.url),
    ["https://www.example.com/gallery/sunset%20motorboat", "https://www.example.com/gallery/atv-family"],
  );
  assert.deepEqual(
    entries.map((entry) => entry.lastModified?.toString()),
    [new Date("2026-05-01T09:00:00.000Z").toString(), new Date("2026-05-02T09:00:00.000Z").toString()],
  );
});

test("robots config points crawlers to the generated sitemap and blocks private paths", () => {
  const robots = buildRobotsConfig("https://www.example.com");

  assert.equal(robots.sitemap, "https://www.example.com/sitemap.xml");
  assert.deepEqual(robots.rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/reservation/write", "/reservation/board/", "/showcase/write", "/uploads"],
  });
});
