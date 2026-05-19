import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedGalleryImageSource,
  normalizeGalleryPostForm,
  validateGalleryPostForm,
} from "../src/lib/gallery/validation";

test("normalizes and validates gallery post data", () => {
  const normalized = normalizeGalleryPostForm({
    title: " 청풍호 석양 아래 모터보트 ",
    imageUrl: " /images/motorboat.webp ",
    content: " 상세페이지에 표시할 설명입니다. ",
    isPublished: "on",
  });

  assert.deepEqual(normalized, {
    title: "청풍호 석양 아래 모터보트",
    imageUrl: "/images/motorboat.webp",
    content: "상세페이지에 표시할 설명입니다.",
    isPublished: true,
  });
  assert.deepEqual(validateGalleryPostForm(normalized), { ok: true, data: normalized });
});

test("rejects unsupported gallery image URLs", () => {
  assert.equal(isAllowedGalleryImageSource("/images/hero-sunset-boat.webp"), true);
  assert.equal(isAllowedGalleryImageSource("https://tour.jecheon.go.kr/tour/example.webp"), true);
  assert.equal(isAllowedGalleryImageSource("https://example.com/image.webp"), false);

  const result = validateGalleryPostForm({
    title: "외부 이미지",
    imageUrl: "https://example.com/image.webp",
    content: "허용되지 않은 이미지 URL입니다.",
    isPublished: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageUrl ?? "", /이미지/);
  }
});
