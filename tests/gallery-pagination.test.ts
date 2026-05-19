import assert from "node:assert/strict";
import test from "node:test";
import { normalizeGalleryPage } from "../src/lib/gallery/pagination";

test("normalizes gallery pagination from URL state", () => {
  assert.deepEqual(normalizeGalleryPage("1", 18), {
    page: 1,
    pageSize: 9,
    totalCount: 18,
    totalPages: 2,
    offset: 0,
  });

  assert.deepEqual(normalizeGalleryPage("2", 6, 3), {
    page: 2,
    pageSize: 3,
    totalCount: 6,
    totalPages: 2,
    offset: 3,
  });

  assert.equal(normalizeGalleryPage("999", 6, 3).page, 2);
  assert.equal(normalizeGalleryPage("bad", 6, 3).page, 1);
  assert.equal(normalizeGalleryPage("-1", 6, 3).page, 1);
});
