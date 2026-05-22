import type { Metadata } from "next";
import { businessInfo, phoneNumber, programCards } from "@/lib/site-data";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/sitemap";

export const siteName = "제천 수상레저 & 청풍 ATV";
export const siteDescription =
  "청풍호에서 수상스키, 웨이크보드, 모터보트, 수상 놀이기구, ATV, 단체 워크숍을 한 번에 상담하고 예약할 수 있는 제천 레저 홈페이지입니다.";

export const defaultSeoImage = {
  path: "/images/main-slider/main-hero-00.webp",
  width: 1920,
  height: 1080,
  alt: "청풍호 석양을 가로지르는 모터보트",
} as const;

const baseKeywords = [
  "제천 수상레저",
  "청풍호 수상레저",
  "청풍 ATV",
  "제천 ATV",
  "청풍호 수상스키",
  "제천 웨이크보드",
  "청풍호 모터보트",
  "제천 단체 워크숍",
];

export type SeoImage = {
  path: string;
  width?: number;
  height?: number;
  alt: string;
};

export type PageMetadataOptions = {
  title?: string;
  description?: string;
  path: string;
  image?: SeoImage;
  keywords?: string[];
  noIndex?: boolean;
};

export function formatSeoTitle(title = siteName) {
  if (title === siteName || title.includes(siteName)) {
    return title;
  }

  return `${title} | ${siteName}`;
}

export function truncateSeoDescription(description: string, maxLength = 155) {
  const normalized = description.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(maxLength - 3, 0)).trimEnd()}...`;
}

function buildRobotsMetadata(noIndex = false): Metadata["robots"] {
  if (noIndex) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

function uniqueKeywords(keywords: string[] = []) {
  return Array.from(new Set([...baseKeywords, ...keywords]));
}

function buildOgImage(siteUrl: string, image: SeoImage = defaultSeoImage) {
  return {
    url: toAbsoluteUrl(siteUrl, image.path),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export function buildRootMetadata(siteUrl = getSiteUrl()): Metadata {
  const title = siteName;
  const description = siteDescription;
  const image = buildOgImage(siteUrl);

  return {
    metadataBase: new URL(`${siteUrl.replace(/\/+$/, "")}/`),
    title,
    description,
    applicationName: siteName,
    authors: [{ name: businessInfo.name }],
    creator: businessInfo.name,
    publisher: businessInfo.name,
    keywords: uniqueKeywords(),
    referrer: "origin-when-cross-origin",
    icons: {
      icon: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(siteUrl, "/"),
      siteName,
      images: [image],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function buildPageMetadata(options: PageMetadataOptions, siteUrl = getSiteUrl()): Metadata {
  const title = formatSeoTitle(options.title);
  const description = truncateSeoDescription(options.description ?? siteDescription);
  const image = buildOgImage(siteUrl, options.image);
  const canonical = toAbsoluteUrl(siteUrl, options.path);

  return {
    title,
    description,
    keywords: uniqueKeywords(options.keywords),
    alternates: {
      canonical,
    },
    robots: buildRobotsMetadata(options.noIndex),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: [image],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function getLocalBusinessJsonLd(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.name,
    alternateName: siteName,
    description: siteDescription,
    url: toAbsoluteUrl(siteUrl, "/"),
    image: [toAbsoluteUrl(siteUrl, defaultSeoImage.path)],
    telephone: phoneNumber,
    priceRange: "KRW",
    openingHours: "Mo-Su 09:00-19:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "금성면 청풍호로 1482",
      addressLocality: "제천시",
      addressRegion: "충청북도",
      postalCode: businessInfo.postalCode,
      addressCountry: "KR",
    },
    areaServed: ["제천", "청풍호", "충청북도"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "제천 청풍호 레저 프로그램",
      itemListElement: programCards.map((program, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: program.title,
          description: program.description,
        },
      })),
    },
  };
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
