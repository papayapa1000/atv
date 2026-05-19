import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("site footer uses a unified black background with white text", () => {
  const source = readFileSync("src/components/home/Footer.tsx", "utf8");

  assert.equal(source.includes("depth-surface"), false);
  assert.equal(source.includes("bg-surface"), false);
  assert.equal(source.includes("text-foreground"), false);
  assert.equal(source.includes('className="border-t border-white/10 bg-black px-5 py-10 text-white lg:px-8"'), true);
  assert.equal(source.includes("text-white/70"), true);
  assert.equal(source.includes("text-white/50"), true);
});
