import type { MetadataRoute } from "next";
import { buildRobotsConfig, getSiteUrl } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsConfig(getSiteUrl());
}
