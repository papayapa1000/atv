import assert from "node:assert/strict";
import test from "node:test";

test("next image config allows Supabase public storage images", async () => {
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example-project.supabase.co";

  try {
    const { default: nextConfig } = await import(`../next.config.ts?test=${Date.now()}`);
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];

    assert.equal(
      remotePatterns.some(
        (pattern) =>
          !(pattern instanceof URL) &&
          pattern.protocol === "https" &&
          pattern.hostname === "example-project.supabase.co" &&
          pattern.pathname === "/storage/v1/object/public/**",
      ),
      true,
    );
  } finally {
    if (previousSupabaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = previousSupabaseUrl;
    }
  }
});
