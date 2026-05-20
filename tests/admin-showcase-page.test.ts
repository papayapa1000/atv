import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin showcase page links each post to its public detail page without a board shortcut", () => {
  const source = readFileSync("src/app/admin/showcase/page.tsx", "utf8");

  assert.equal(source.includes("공개 게시판 보기"), false);
  assert.equal(source.includes('href="/showcase"'), false);
  assert.equal(source.includes('import Link from "next/link";'), true);
  assert.equal(source.includes("href={`/showcase/${post.id}`}"), true);
  assert.equal(source.includes("상세페이지 보기"), true);
  assert.equal(source.includes("자랑하기 관리"), true);
});

test("admin showcase list uses the public board style instead of image cards", () => {
  const source = readFileSync("src/app/admin/showcase/page.tsx", "utf8");

  assert.equal(source.includes("border border-mist bg-white p-5 shadow-[0_24px_52px_-38px_rgba(7,59,58,0.42)]"), true);
  assert.equal(source.includes("divide-y divide-mist"), true);
  assert.equal(source.includes("sm:grid-cols-[minmax(0,1fr)_9rem_auto]"), true);
  assert.equal(source.includes("deleteAdminShowcasePostAction"), true);
  assert.equal(source.includes("AdminDeleteConfirmButton"), true);
  assert.equal(source.includes("md:grid-cols-2 xl:grid-cols-3"), false);
  assert.equal(source.includes("aspect-[16/10]"), false);
  assert.equal(source.includes("ImageSquare"), false);
});
