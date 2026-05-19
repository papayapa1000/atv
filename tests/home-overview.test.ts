import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home gallery overview does not render category tag strip", () => {
  const source = readFileSync("src/components/home/HomeOverview.tsx", "utf8");

  assert.equal(source.includes('["수상레저", "ATV", "단체 이용"]'), false);
  assert.equal(source.includes("sm:grid-cols-3"), false);
  assert.equal(source.includes("사진으로 먼저 보는 현장 분위기"), true);
});
