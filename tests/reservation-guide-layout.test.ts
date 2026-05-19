import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("reservation guide uses a text-first procedure panel without the workshop image", () => {
  const source = readFileSync("src/components/home/ReservationGuide.tsx", "utf8");

  assert.equal(source.includes("next/image"), false);
  assert.equal(source.includes("workshop.webp"), false);
  assert.equal(source.includes("4단계"), true);
  assert.equal(source.includes("grid grid-cols-[2.75rem_1fr]"), true);
});

test("reservation guide uses the shared light page background", () => {
  const source = readFileSync("src/components/home/ReservationGuide.tsx", "utf8");

  assert.equal(source.includes('className="depth-mint bg-foam px-5 py-14 text-foreground lg:px-8 lg:py-20"'), true);
  assert.equal(source.includes('tone="dark"'), false);
  assert.equal(source.includes('className="bg-lake px-5 py-16 text-white lg:px-8 lg:py-20"'), false);
  assert.equal(source.includes("bg-surface-muted/52"), false);
});

test("reservation guide uses a redesigned information layout", () => {
  const source = readFileSync("src/components/home/ReservationGuide.tsx", "utf8");

  assert.equal(source.includes("lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.65fr)]"), true);
  assert.equal(source.includes("예약 전 확인할 내용"), true);
  assert.equal(source.includes("예약 절차"), true);
  assert.equal(source.includes("안전 안내"), true);
  assert.equal(source.includes("환불규정"), true);
  assert.equal(source.includes("border border-mist bg-white p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)]"), true);
  assert.equal(source.includes("border border-sun/28 bg-sun/12 px-3 py-2 text-deep"), false);
  assert.equal(source.includes("bg-white/95 p-6 text-foreground"), false);
});
