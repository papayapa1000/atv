import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPageMetadata,
  buildRootMetadata,
  formatSeoTitle,
  getLocalBusinessJsonLd,
  siteName,
  truncateSeoDescription,
} from "../src/lib/seo";

test("root metadata defines site-wide SEO defaults", () => {
  const metadata = buildRootMetadata("https://www.example.com");
  const twitter = metadata.twitter as { card?: string };

  assert.equal(metadata.metadataBase?.toString(), "https://www.example.com/");
  assert.equal(metadata.title, siteName);
  assert.equal(metadata.openGraph?.siteName, siteName);
  assert.equal(twitter.card, "summary_large_image");
});

test("page metadata includes canonical, OG, Twitter, keywords, and robot policy", () => {
  const metadata = buildPageMetadata(
    {
      title: "즐길거리",
      description: "청풍호 수상스키, 웨이크보드, 모터보트, ATV 이용요금과 예약 안내를 확인하세요.",
      path: "/activities",
      keywords: ["제천 ATV"],
    },
    "https://www.example.com",
  );

  assert.equal(metadata.title, `즐길거리 | ${siteName}`);
  assert.deepEqual(metadata.alternates, {
    canonical: "https://www.example.com/activities",
  });
  assert.equal(metadata.openGraph?.url, "https://www.example.com/activities");
  assert.equal(metadata.openGraph?.locale, "ko_KR");
  assert.equal(metadata.twitter?.title, `즐길거리 | ${siteName}`);
  assert.equal(Array.isArray(metadata.keywords), true);
  assert.equal((metadata.keywords as string[]).includes("제천 ATV"), true);
  assert.deepEqual(metadata.robots, {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  });
});

test("page metadata can explicitly mark thin or private pages as noindex", () => {
  const metadata = buildPageMetadata(
    {
      title: "예약글 확인",
      description: "예약글 비밀번호 확인 후 문의 내용과 답글을 확인하세요.",
      path: "/reservation/board/example",
      noIndex: true,
    },
    "https://www.example.com",
  );

  assert.deepEqual(metadata.robots, {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  });
});

test("SEO title formatting and descriptions avoid duplication and overlong snippets", () => {
  assert.equal(formatSeoTitle(siteName), siteName);
  assert.equal(formatSeoTitle(`갤러리 | ${siteName}`), `갤러리 | ${siteName}`);
  assert.equal(formatSeoTitle("갤러리"), `갤러리 | ${siteName}`);

  const longDescription = "청풍호 ".repeat(80);
  const truncated = truncateSeoDescription(longDescription);

  assert.equal(truncated.length <= 155, true);
  assert.equal(truncated.endsWith("..."), true);
});

test("local business structured data exposes business contact and canonical URL", () => {
  const jsonLd = getLocalBusinessJsonLd("https://www.example.com");

  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.equal(jsonLd["@type"], "LocalBusiness");
  assert.equal(jsonLd.url, "https://www.example.com/");
  assert.equal(jsonLd.telephone, "010-4634-5020");
  assert.equal(jsonLd.address.addressLocality, "제천시");
  assert.equal(jsonLd.hasOfferCatalog.itemListElement.length > 0, true);
});
