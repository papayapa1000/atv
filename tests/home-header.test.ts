import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home header does not render the JC logo badge", () => {
  const source = readFileSync("src/components/home/Header.tsx", "utf8");

  assert.equal(source.includes(">JC</span>"), false);
  assert.equal(source.includes("제천 ATV & 수상레저"), true);
});

test("header dropdown sub menu links do not use an orange focus border", () => {
  const source = readFileSync("src/components/home/Header.tsx", "utf8");

  assert.equal(source.includes("focus:ring-sun"), false);
  assert.equal(source.includes("focus:ring-lake/35"), true);
});
