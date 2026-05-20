import type { NextConfig } from "next";

const supabaseImageRemotePattern = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  try {
    return {
      protocol: "https" as const,
      hostname: new URL(supabaseUrl).hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
})();

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  {
    protocol: "https",
    hostname: "tour.jecheon.go.kr",
    pathname: "/tour/**",
  },
  {
    protocol: "https",
    hostname: "img.youtube.com",
    pathname: "/vi/**",
  },
  {
    protocol: "https",
    hostname: "i.ytimg.com",
    pathname: "/vi/**",
  },
];

if (supabaseImageRemotePattern) {
  remotePatterns.push(supabaseImageRemotePattern);
}

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;
