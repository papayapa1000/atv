import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin video server action form lets React manage multipart encoding", () => {
  const formSource = readFileSync("src/components/admin/AdminVideoPostForm.tsx", "utf8");
  const editFieldSource = readFileSync("src/components/admin/AdminVideoFileReplacementField.tsx", "utf8");
  const editModalSource = readFileSync("src/components/admin/AdminVideoPostEditModal.tsx", "utf8");

  assert.equal(formSource.includes('<form action={formAction} encType="multipart/form-data"'), false);
  assert.equal(formSource.includes('<form action={formAction} className="grid gap-6" onSubmit={handleSubmit}>'), true);
  assert.equal(formSource.includes("handleSubmit"), true);
  assert.equal(formSource.includes("uploadVideoFileDirectly"), true);
  assert.equal(formSource.includes('formData.delete("videoFile")'), true);
  assert.equal(formSource.includes('formData.set("uploadedVideoUrl"'), true);
  assert.equal(formSource.includes('name="videoFile"'), true);
  assert.equal(formSource.includes('type="file"'), true);
  assert.equal(editFieldSource.includes("selectedFile"), true);
  assert.equal(editFieldSource.includes("onFileSelected"), true);
  assert.equal(editModalSource.includes("uploadVideoFileDirectly"), true);
  assert.equal(editModalSource.includes('formData.delete("videoFile")'), true);
  assert.equal(editModalSource.includes('formData.set("uploadedVideoUrl"'), true);
});
