import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("activity tabs do not render an orange underline on active state", () => {
  const source = readFileSync("src/components/home/ActivitiesScrollShowcase.tsx", "utf8");

  assert.equal(source.includes("border-lake bg-lake text-white"), true);
  assert.equal(source.includes("after:absolute"), false);
  assert.equal(source.includes("after:bg-sun"), false);
});
