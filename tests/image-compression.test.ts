import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("image uploads are compressed before Supabase Storage upload", () => {
  const compressionSource = readFileSync("src/lib/images/compression.ts", "utf8");
  const galleryUploadSource = readFileSync("src/lib/gallery/uploads.ts", "utf8");
  const showcaseUploadSource = readFileSync("src/lib/showcase/uploads.ts", "utf8");
  const stayUploadSource = readFileSync("src/lib/stay/uploads.ts", "utf8");
  const packageSource = readFileSync("package.json", "utf8");

  assert.equal(packageSource.includes("\"sharp\""), true);
  assert.equal(compressionSource.includes("sharp"), true);
  assert.equal(compressionSource.includes("resize({"), true);
  assert.equal(compressionSource.includes("withoutEnlargement: true"), true);
  assert.equal(compressionSource.includes(".webp({ quality:"), true);
  assert.equal(compressionSource.includes("contentType: \"image/webp\""), true);
  assert.equal(galleryUploadSource.includes("compressUploadedImageForStorage"), true);
  assert.equal(showcaseUploadSource.includes("compressUploadedImageForStorage"), true);
  assert.equal(stayUploadSource.includes("compressUploadedImageForStorage"), true);
});
