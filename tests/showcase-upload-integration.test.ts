import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("showcase action uploads images to Supabase Storage and stores image urls", () => {
  const actionSource = readFileSync("src/app/showcase/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/showcase/repository.ts", "utf8");
  const uploadSource = readFileSync("src/lib/showcase/uploads.ts", "utf8");
  const imageCompressionSource = readFileSync("src/lib/images/compression.ts", "utf8");
  const storageSource = readFileSync("src/lib/supabase/storage.ts", "utf8");
  const migrationSource = readFileSync("supabase/migrations/20260520000000_create_showcase_images_bucket.sql", "utf8");

  assert.equal(actionSource.includes("formData.getAll(\"imageFiles\")"), true);
  assert.equal(actionSource.includes("saveUploadedShowcaseImages"), true);
  assert.equal(repositorySource.includes("image_urls: input.imageUrls"), true);
  assert.equal(storageSource.includes("/storage/v1/object/"), true);
  assert.equal(storageSource.includes("/storage/v1/object/public/"), true);
  assert.equal(uploadSource.includes("showcase-images"), true);
  assert.equal(uploadSource.includes("compressUploadedImageForStorage"), true);
  assert.equal(uploadSource.includes("node:fs/promises"), false);
  assert.equal(uploadSource.includes("saveUploadedShowcaseImageLocally"), false);
  assert.equal(uploadSource.includes("/uploads/showcase/"), false);
  assert.equal(imageCompressionSource.includes("sharp"), true);
  assert.equal(imageCompressionSource.includes(".webp("), true);
  assert.equal(migrationSource.includes("insert into storage.buckets"), true);
  assert.equal(migrationSource.includes("showcase-images"), true);
  assert.equal(migrationSource.includes("image/jpeg"), true);
  assert.equal(migrationSource.includes("image/png"), true);
  assert.equal(migrationSource.includes("image/webp"), true);
});
