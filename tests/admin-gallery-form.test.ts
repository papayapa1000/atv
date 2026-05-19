import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin gallery form does not show the image path helper notice", () => {
  const source = readFileSync("src/components/admin/AdminGalleryPostForm.tsx", "utf8");

  assert.equal(source.includes("현재는 public/images 안의 이미지 경로를 등록합니다."), false);
  assert.equal(source.includes("/images/motorboat.webp"), false);
  assert.equal(source.includes('name="imageUrl"'), false);
  assert.equal(source.includes('name="imageFiles"'), true);
  assert.equal(source.includes('type="file"'), true);
  assert.equal(source.includes("multiple"), true);
  assert.equal(source.includes("이미지는 최대 8장"), true);
  assert.equal(source.includes("갤러리 등록"), true);
});
