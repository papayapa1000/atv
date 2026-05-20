import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin gallery form does not show the image path helper notice", () => {
  const source = readFileSync("src/components/admin/AdminGalleryPostForm.tsx", "utf8");

  assert.equal(source.includes("현재는 public/images 안의 이미지 경로를 등록합니다."), false);
  assert.equal(source.includes("/images/motorboat.webp"), false);
  assert.equal(source.includes('name="imageUrl"'), false);
  assert.equal(source.includes("AdminGalleryImageFileFields"), true);
  assert.equal(source.includes("갤러리 등록"), true);
});

test("admin gallery form adds image inputs one at a time with cancel controls", () => {
  const fieldsSource = readFileSync("src/components/admin/AdminGalleryImageFileFields.tsx", "utf8");

  assert.equal(fieldsSource.includes("maxImageFileCount = 8"), true);
  assert.equal(fieldsSource.includes('name="imageFiles"'), true);
  assert.equal(fieldsSource.includes('type="file"'), true);
  assert.equal(fieldsSource.includes("multiple"), false);
  assert.equal(fieldsSource.includes("첨부 취소"), true);
  assert.equal(fieldsSource.includes("addEmptySlot"), true);
  assert.equal(fieldsSource.includes("break-all"), true);
  assert.equal(fieldsSource.includes("sm:flex-row"), false);
});
