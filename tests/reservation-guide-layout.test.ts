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

test("reservation guide uses a more prominent high contrast UI", () => {
  const source = readFileSync("src/components/home/ReservationGuide.tsx", "utf8");

  assert.equal(source.includes('className="bg-lake px-5 py-16 text-white lg:px-8 lg:py-20"'), true);
  assert.equal(source.includes('tone="dark"'), true);
  assert.equal(source.includes("depth-mint bg-foam"), false);
  assert.equal(source.includes("bg-surface-muted/52"), false);
  assert.equal(
    source.includes("border border-white/20 bg-white p-6 text-foreground shadow-[0_24px_50px_-32px_rgba(7,59,58,0.78)]"),
    true,
  );
  assert.equal(source.includes("border border-sun/28 bg-sun/12 px-3 py-2 text-deep"), true);
  assert.equal(source.includes("border border-sun/30 bg-sun/12 p-5 text-foreground"), true);
  assert.equal(source.includes("bg-white/95 p-6 text-foreground"), true);
});
