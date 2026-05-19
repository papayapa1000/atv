import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin gallery action uploads files and stores gallery image urls", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/gallery/repository.ts", "utf8");
  const uploadSource = readFileSync("src/lib/gallery/uploads.ts", "utf8");
  const migrationSource = readFileSync("supabase/migrations/20260519060000_add_gallery_image_urls.sql", "utf8");

  assert.equal(actionSource.includes("formData.getAll(\"imageFiles\")"), true);
  assert.equal(actionSource.includes("saveUploadedGalleryImages"), true);
  assert.equal(repositorySource.includes("image_urls"), true);
  assert.equal(repositorySource.includes("const imageUrls = row.image_urls?.length ? row.image_urls : [row.image_url];"), true);
  assert.equal(repositorySource.includes("image_url: input.imageUrls[0]"), true);
  assert.equal(uploadSource.includes("public\", \"uploads\", \"gallery\""), true);
  assert.equal(uploadSource.includes("return `/uploads/gallery/${fileName}`;"), true);
  assert.equal(migrationSource.includes("add column if not exists image_urls text[] not null default '{}'"), true);
  assert.equal(migrationSource.includes("cardinality(image_urls) between 1 and 8"), true);
});

test("gallery detail renders all attached images", () => {
  const detailSource = readFileSync("src/app/gallery/[id]/page.tsx", "utf8");

  assert.equal(detailSource.includes("const [mainImageUrl, ...extraImageUrls] = post.imageUrls"), true);
  assert.equal(detailSource.includes("extraImageUrls.map"), true);
  assert.equal(detailSource.includes("첨부 이미지"), true);
});
