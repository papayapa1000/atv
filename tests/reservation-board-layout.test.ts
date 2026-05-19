import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("reservation board rows use compact mobile layout classes", () => {
  const source = readFileSync("src/app/reservation/board/page.tsx", "utf8");

  assert.equal(source.includes("grid-cols-[1fr_auto]"), true);
  assert.equal(source.includes("p-3"), true);
  assert.equal(source.includes("sm:p-5"), true);
  assert.equal(source.includes("hidden h-9 w-9"), true);
  assert.equal(source.includes("text-sm"), true);
  assert.equal(source.includes("sm:text-base"), true);
});

test("reservation board rows use depth styling", () => {
  const source = readFileSync("src/app/reservation/board/page.tsx", "utf8");

  assert.equal(source.includes("shadow-[0_12px_20px_-16px_rgba(107,114,128,0.65)]"), true);
  assert.equal(source.includes("hover:-translate-y-0.5"), true);
  assert.equal(source.includes("hover:shadow-[0_16px_28px_-16px_rgba(75,85,99,0.7)]"), true);
  assert.equal(source.includes("focus-visible:ring-lake/30"), true);
});

test("reservation board status badges use gray pending and orange cancelled colors", () => {
  const source = readFileSync("src/app/reservation/board/page.tsx", "utf8");

  assert.equal(source.includes('return "border-gray-300 bg-gray-100 text-gray-700";'), true);
  assert.equal(source.includes('return "border-sun bg-sun text-white";'), true);
  assert.equal(source.includes('return "border-sun/30 bg-sun/24 text-deep";'), false);
  assert.equal(source.includes('return "border-foreground/12 bg-surface-muted text-ink-muted";'), false);
});
