import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin video server action form lets React manage multipart encoding", () => {
  const formSource = readFileSync("src/components/admin/AdminVideoPostForm.tsx", "utf8");

  assert.equal(formSource.includes('<form action={formAction} encType="multipart/form-data"'), false);
  assert.equal(formSource.includes('<form action={formAction} className="grid gap-6">'), true);
  assert.equal(formSource.includes('name="videoFile"'), true);
  assert.equal(formSource.includes('type="file"'), true);
});
