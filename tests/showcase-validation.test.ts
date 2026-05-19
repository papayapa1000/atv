import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedShowcaseLink,
  normalizeShowcasePage,
  normalizeShowcasePostForm,
  validateShowcasePostForm,
} from "../src/lib/showcase/validation";

test("normalizes and validates showcase post data with a link", () => {
  const normalized = normalizeShowcasePostForm({
    authorName: " 홍길동 ",
    title: " 청풍호 수상레저 후기 ",
    content: " 가족과 함께 즐긴 수상레저 후기입니다. ",
    linkUrl: " https://www.instagram.com/p/example/ ",
    imageFiles: [],
  });

  assert.deepEqual(normalized, {
    authorName: "홍길동",
    title: "청풍호 수상레저 후기",
    content: "가족과 함께 즐긴 수상레저 후기입니다.",
    linkUrl: "https://www.instagram.com/p/example/",
    imageFiles: [],
  });
  assert.deepEqual(validateShowcasePostForm(normalized), { ok: true, data: normalized });
});

test("allows only http and https showcase links", () => {
  assert.equal(isAllowedShowcaseLink("https://www.instagram.com/p/example/"), true);
  assert.equal(isAllowedShowcaseLink("http://example.com/review"), true);
  assert.equal(isAllowedShowcaseLink("javascript:alert(1)"), false);

  const result = validateShowcasePostForm({
    authorName: "홍길동",
    title: "후기 링크",
    content: "링크 검증을 위한 후기입니다.",
    linkUrl: "javascript:alert(1)",
    imageFiles: [],
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.linkUrl ?? "", /링크/);
  }
});

test("allows up to five showcase image files", () => {
  const imageFiles = Array.from({ length: 5 }, (_, index) => new File(["image"], `review-${index}.jpg`, { type: "image/jpeg" }));
  const normalized = normalizeShowcasePostForm({
    authorName: "홍길동",
    title: "사진 후기",
    content: "사진 다섯 장을 포함한 후기입니다.",
    linkUrl: "",
    imageFiles,
  });

  assert.equal(normalized.imageFiles.length, 5);
  assert.deepEqual(validateShowcasePostForm(normalized), { ok: true, data: normalized });
});

test("rejects more than five showcase image files", () => {
  const imageFiles = Array.from({ length: 6 }, (_, index) => new File(["image"], `review-${index}.jpg`, { type: "image/jpeg" }));
  const result = validateShowcasePostForm({
    authorName: "홍길동",
    title: "사진 후기",
    content: "사진 여섯 장을 포함한 후기입니다.",
    linkUrl: "",
    imageFiles,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageFiles ?? "", /5장/);
  }
});

test("rejects showcase image files larger than 8MB", () => {
  const oversizedImage = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
  const result = validateShowcasePostForm({
    authorName: "홍길동",
    title: "큰 사진 후기",
    content: "용량 제한 검증을 위한 후기입니다.",
    linkUrl: "",
    imageFiles: [oversizedImage],
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.imageFiles ?? "", /8MB/);
  }
});

test("normalizes showcase board pagination to twelve rows", () => {
  assert.deepEqual(normalizeShowcasePage("2", 25), {
    page: 2,
    pageSize: 12,
    totalCount: 25,
    totalPages: 3,
    offset: 12,
  });
});
