import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeGalleryImageUrls,
  parseLegacyGalleryImageUrls,
  serializeLegacyGalleryImageUrl,
} from "../src/lib/gallery/image-urls";

test("normalizes gallery image urls from the current image_urls column", () => {
  assert.deepEqual(normalizeGalleryImageUrls("/uploads/gallery/cover.jpg", ["/uploads/gallery/cover.jpg", "/uploads/gallery/detail.jpg"]), [
    "/uploads/gallery/cover.jpg",
    "/uploads/gallery/detail.jpg",
  ]);
});

test("parses multiple gallery image urls from legacy image_url JSON", () => {
  const imageUrls = ["/uploads/gallery/one.jpg", "/uploads/gallery/two.webp"];

  assert.deepEqual(parseLegacyGalleryImageUrls(JSON.stringify(imageUrls)), imageUrls);
  assert.equal(serializeLegacyGalleryImageUrl(imageUrls), JSON.stringify(imageUrls));
});

test("keeps single legacy gallery image urls as a plain URL", () => {
  assert.deepEqual(parseLegacyGalleryImageUrls("/uploads/gallery/one.jpg"), ["/uploads/gallery/one.jpg"]);
  assert.equal(serializeLegacyGalleryImageUrl(["/uploads/gallery/one.jpg"]), "/uploads/gallery/one.jpg");
});
