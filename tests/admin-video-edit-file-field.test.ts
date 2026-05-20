import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin video edit modal shows the registered file name and replacement state", () => {
  const modalSource = readFileSync("src/components/admin/AdminVideoPostEditModal.tsx", "utf8");
  const fieldSource = readFileSync("src/components/admin/AdminVideoFileReplacementField.tsx", "utf8");

  assert.equal(modalSource.includes("getVideoFileName(post.videoUrl)"), true);
  assert.equal(modalSource.includes("AdminVideoFileReplacementField"), true);
  assert.equal(fieldSource.includes("currentFileName"), true);
  assert.equal(fieldSource.includes("selectedFileName"), true);
  assert.equal(fieldSource.includes("등록된 영상 파일"), true);
  assert.equal(fieldSource.includes("새 영상 파일"), true);
  assert.equal(fieldSource.includes("첨부 취소"), true);
  assert.equal(fieldSource.includes('name="videoFile"'), true);
  assert.equal(fieldSource.includes('accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"'), true);
});
