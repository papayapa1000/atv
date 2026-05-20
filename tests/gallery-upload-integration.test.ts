import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin gallery action uploads files and stores gallery image urls", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/gallery/repository.ts", "utf8");
  const uploadSource = readFileSync("src/lib/gallery/uploads.ts", "utf8");
  const imageCompressionSource = readFileSync("src/lib/images/compression.ts", "utf8");
  const migrationSource = readFileSync("supabase/migrations/20260519060000_add_gallery_image_urls.sql", "utf8");
  const storageMigrationSource = readFileSync("supabase/migrations/20260520001000_create_gallery_images_bucket.sql", "utf8");

  assert.equal(actionSource.includes("formData.getAll(\"imageFiles\")"), true);
  assert.equal(actionSource.includes("saveUploadedGalleryImages"), true);
  assert.equal(repositorySource.includes("image_urls"), true);
  assert.equal(repositorySource.includes("legacyGallerySelect"), true);
  assert.equal(repositorySource.includes("isMissingGalleryImageUrlsColumnError"), true);
  assert.equal(repositorySource.includes("return listLegacyAdminGalleryPosts(safeLimit);"), true);
  assert.equal(repositorySource.includes("return createLegacyGalleryPost(input);"), true);
  assert.equal(repositorySource.includes("normalizeGalleryImageUrls(row.image_url, row.image_urls)"), true);
  assert.equal(repositorySource.includes("image_url: serializeLegacyGalleryImageUrl(input.imageUrls)"), true);
  assert.equal(uploadSource.includes("uploadSupabaseStorageObject"), true);
  assert.equal(uploadSource.includes("compressUploadedImageForStorage"), true);
  assert.equal(uploadSource.includes("gallery-images"), true);
  assert.equal(uploadSource.includes("node:fs/promises"), false);
  assert.equal(uploadSource.includes(".catch(() => null)"), false);
  assert.equal(uploadSource.includes("/uploads/gallery/"), false);
  assert.equal(imageCompressionSource.includes("sharp"), true);
  assert.equal(imageCompressionSource.includes(".webp("), true);
  assert.equal(imageCompressionSource.includes("contentType: \"image/webp\""), true);
  assert.equal(migrationSource.includes("add column if not exists image_urls text[] not null default '{}'"), true);
  assert.equal(migrationSource.includes("cardinality(image_urls) between 1 and 8"), true);
  assert.equal(storageMigrationSource.includes("gallery-images"), true);
  assert.equal(storageMigrationSource.includes("storage.buckets"), true);
});

test("gallery detail renders all attached images", () => {
  const detailSource = readFileSync("src/app/gallery/[id]/page.tsx", "utf8");

  assert.equal(detailSource.includes("const [mainImageUrl, ...extraImageUrls] = post.imageUrls"), true);
  assert.equal(detailSource.includes("extraImageUrls.map"), true);
  assert.equal(detailSource.includes("첨부 이미지"), true);
});
