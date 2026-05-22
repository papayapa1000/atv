import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("nearby section uses a concise follow-up course headline", () => {
  const source = readFileSync("src/app/water-ski-atv/page.tsx", "utf8");

  assert.equal(source.includes("레저 후 둘러보기 좋은 청풍호 주변 명소"), true);
  assert.equal(source.includes("주변관광지와 함께 하루 일정을 잡기 좋습니다"), false);
});

test("kakao map button uses a filled lake style", () => {
  const source = readFileSync("src/app/water-ski-atv/page.tsx", "utf8");

  assert.equal(source.includes("카카오맵"), true);
  assert.equal(source.includes("border border-lake bg-lake px-5 py-3 text-sm font-bold text-white"), true);
  assert.equal(source.includes("hover:border-forest hover:bg-forest hover:text-white"), true);
  assert.equal(source.includes("border border-lake/20 bg-surface/72 px-5 py-3 text-sm font-bold text-lake"), false);
});

test("location section uses the updated road address", () => {
  const source = readFileSync("src/app/water-ski-atv/page.tsx", "utf8");
  const oldLotAddress = "\uc131\ub0b4\ub9ac 157";

  assert.equal(source.includes("충북 제천시 금성면 청풍호로 1542-5"), true);
  assert.equal(source.includes(oldLotAddress), false);
  assert.equal(source.includes("/images/kakao-map-cheongpungho-1542-5.webp"), true);
});
