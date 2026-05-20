import assert from "node:assert/strict";
import test from "node:test";
import { normalizeStayPage } from "../src/lib/stay/pagination";
import { normalizeStayPostForm, validateStayPostForm } from "../src/lib/stay/validation";

test("normalizes and validates stay post data", () => {
  const imageFiles = [new File(["image"], "stay.jpg", { type: "image/jpeg" })];
  const normalized = normalizeStayPostForm({
    title: " 청풍호 전망 펜션 ",
    price: " 1박 120,000원부터 ",
    content: " 예약 안내는 https://example.com/stay 에서 확인하세요. ",
    isPublished: "on",
    imageFiles,
  });

  assert.deepEqual(normalized, {
    title: "청풍호 전망 펜션",
    price: "1박 120,000원부터",
    content: "예약 안내는 https://example.com/stay 에서 확인하세요.",
    isPublished: true,
    imageFiles,
  });
  assert.deepEqual(validateStayPostForm(normalized), { ok: true, data: normalized });
});

test("allows up to ten stay images", () => {
  const imageFiles = Array.from({ length: 10 }, (_, index) => new File(["image"], `stay-${index}.webp`, { type: "image/webp" }));
  const result = validateStayPostForm({
    title: "단체 숙박",
    price: "문의",
    content: "이미지 열 장을 포함한 숙박 안내입니다.",
    isPublished: true,
    imageFiles,
  });

  assert.deepEqual(result, {
    ok: true,
    data: {
      title: "단체 숙박",
      price: "문의",
      content: "이미지 열 장을 포함한 숙박 안내입니다.",
      isPublished: true,
      imageFiles,
    },
  });
});

test("allows stay edit validation without replacement image files", () => {
  const result = validateStayPostForm(
    {
      title: "숙박 정보 수정",
      price: "문의",
      content: "기존 숙박 이미지를 유지하면서 설명만 수정합니다.",
      isPublished: true,
      imageFiles: [],
    },
    { requireImages: false },
  );

  assert.equal(result.ok, true);
});

test("rejects missing and excessive stay images", () => {
  const missing = validateStayPostForm({
    title: "숙박 안내",
    price: "문의",
    content: "이미지가 없는 숙박 안내입니다.",
    isPublished: true,
    imageFiles: [],
  });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.match(missing.errors.imageFiles ?? "", /1장/);
  }

  const tooManyImages = Array.from({ length: 11 }, (_, index) => new File(["image"], `stay-${index}.jpg`, { type: "image/jpeg" }));
  const tooMany = validateStayPostForm({
    title: "숙박 안내",
    price: "문의",
    content: "이미지가 너무 많은 숙박 안내입니다.",
    isPublished: true,
    imageFiles: tooManyImages,
  });
  assert.equal(tooMany.ok, false);
  if (!tooMany.ok) {
    assert.match(tooMany.errors.imageFiles ?? "", /10장/);
  }
});

test("rejects stay images larger than 8MB", () => {
  const oversizedImage = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
  const result = validateStayPostForm({
    title: "대형 이미지 숙박",
    price: "문의",
    content: "파일 크기 제한 검증을 위한 숙박 안내입니다.",
    isPublished: true,
    imageFiles: [oversizedImage],
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageFiles ?? "", /8MB/);
  }
});

test("normalizes stay pagination to nine cards", () => {
  assert.deepEqual(normalizeStayPage("2", 20), {
    page: 2,
    pageSize: 9,
    totalCount: 20,
    totalPages: 3,
    offset: 9,
  });

  assert.equal(normalizeStayPage("999", 20).page, 3);
  assert.equal(normalizeStayPage("bad", 20).page, 1);
});
