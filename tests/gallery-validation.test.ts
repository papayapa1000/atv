import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeGalleryPostForm,
  validateGalleryPostForm,
} from "../src/lib/gallery/validation";

test("normalizes and validates gallery post data", () => {
  const imageFiles = [new File(["image"], "gallery.jpg", { type: "image/jpeg" })];
  const normalized = normalizeGalleryPostForm({
    title: " 청풍호 석양 아래 모터보트 ",
    content: " 상세페이지에 표시할 설명입니다. ",
    imageFiles,
    isPublished: "on",
  });

  assert.deepEqual(normalized, {
    title: "청풍호 석양 아래 모터보트",
    content: "상세페이지에 표시할 설명입니다.",
    imageFiles,
    isPublished: true,
  });
  assert.deepEqual(validateGalleryPostForm(normalized), { ok: true, data: normalized });
});

test("allows up to eight gallery image files", () => {
  const imageFiles = Array.from({ length: 8 }, (_, index) => new File(["image"], `gallery-${index}.webp`, { type: "image/webp" }));
  const normalized = normalizeGalleryPostForm({
    title: "갤러리 업로드",
    content: "첨부파일 기반 갤러리 등록입니다.",
    imageFiles,
    isPublished: "on",
  });

  assert.equal(normalized.imageFiles.length, 8);
  assert.deepEqual(validateGalleryPostForm(normalized), { ok: true, data: normalized });
});

test("rejects missing and excessive gallery image files", () => {
  const missing = validateGalleryPostForm({
    title: "이미지 없음",
    content: "이미지가 없으면 등록할 수 없습니다.",
    imageFiles: [],
    isPublished: true,
  });

  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.match(missing.errors.imageFiles ?? "", /1장/);
  }

  const tooManyImages = Array.from({ length: 9 }, (_, index) => new File(["image"], `gallery-${index}.jpg`, { type: "image/jpeg" }));
  const tooMany = validateGalleryPostForm({
    title: "이미지 초과",
    content: "이미지는 최대 8장까지만 등록합니다.",
    imageFiles: tooManyImages,
    isPublished: true,
  });

  assert.equal(tooMany.ok, false);
  if (!tooMany.ok) {
    assert.match(tooMany.errors.imageFiles ?? "", /8장/);
  }
});

test("rejects gallery image files larger than 8MB", () => {
  const oversizedImage = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
  const result = validateGalleryPostForm({
    title: "큰 이미지",
    content: "파일 크기 제한 확인입니다.",
    imageFiles: [oversizedImage],
    isPublished: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageFiles ?? "", /8MB/);
  }
});

test("rejects unsupported gallery image file types", () => {
  const svgImage = new File(["<svg />"], "gallery.svg", { type: "image/svg+xml" });
  const result = validateGalleryPostForm({
    title: "지원하지 않는 이미지",
    content: "jpg, png, webp 외 형식은 등록하지 않습니다.",
    imageFiles: [svgImage],
    isPublished: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageFiles ?? "", /jpg, png, webp/);
  }
});
