import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin stay image uploads require Supabase Storage", () => {
  const uploadSource = readFileSync("src/lib/stay/uploads.ts", "utf8");
  const imageCompressionSource = readFileSync("src/lib/images/compression.ts", "utf8");
  const envSource = readFileSync(".env.example", "utf8");
  const readmeSource = readFileSync("supabase/README.md", "utf8");
  const storageMigrationSource = readFileSync("supabase/migrations/20260520003000_create_stay_images_bucket.sql", "utf8");

  assert.equal(uploadSource.includes("uploadSupabaseStorageObject"), true);
  assert.equal(uploadSource.includes("SUPABASE_STAY_IMAGES_BUCKET"), true);
  assert.equal(uploadSource.includes("stay-images"), true);
  assert.equal(uploadSource.includes("compressUploadedImageForStorage"), true);
  assert.equal(uploadSource.includes("node:fs/promises"), false);
  assert.equal(uploadSource.includes(".catch(() => null)"), false);
  assert.equal(uploadSource.includes("/uploads/stay/"), false);
  assert.equal(imageCompressionSource.includes("sharp"), true);
  assert.equal(imageCompressionSource.includes(".webp("), true);
  assert.equal(envSource.includes("SUPABASE_STAY_IMAGES_BUCKET=stay-images"), true);
  assert.equal(readmeSource.includes("Stay image uploads use the public Supabase Storage bucket `stay-images`"), true);
  assert.equal(storageMigrationSource.includes("storage.buckets"), true);
  assert.equal(storageMigrationSource.includes("stay-images"), true);
});
