import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("hero location CTA uses a cohesive filled lake color", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes('href="/water-ski-atv#location"'), true);
  assert.equal(source.includes("border border-lake bg-lake"), true);
  assert.equal(source.includes("text-white"), true);
  assert.equal(source.includes("hover:border-forest hover:bg-forest"), true);
  assert.equal(source.includes("bg-surface/72 px-6 py-3 text-sm font-extrabold text-lake"), false);
});

test("hero phone CTA uses darker orange on hover", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("전화예약 바로하기"), true);
  assert.equal(source.includes("border border-sun bg-sun"), true);
  assert.equal(source.includes("hover:border-sunset hover:bg-sunset hover:text-white"), true);
  assert.equal(source.includes("hover:bg-lake hover:text-white active:scale-[0.98]"), false);
});

test("hero headline uses a clear leisure-focused message", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("제천 청풍호에서 즐기는"), true);
  assert.equal(source.includes("수상레저와 ATV"), true);
  assert.equal(source.includes("하루를 크게 씁니다"), false);
});

test("hero body copy explains the lake and ATV experience naturally", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("청풍호의 물살 위 수상레저와 호반 산길을 달리는 ATV를 한곳에서 즐겨보세요."), true);
  assert.equal(source.includes("인원과 일정에 맞춰 알맞은 코스를 안내해 드립니다."), true);
  assert.equal(source.includes("전화 한 번으로 종목과 시간대를 바로 맞춥니다"), false);
  assert.equal(source.includes("하루 일정으로 정리해 드립니다"), false);
});

test("hero text panel sits closer to the top of the hero", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("mt-0 max-w-[36rem]"), true);
  assert.equal(source.includes("lg:mt-0"), true);
  assert.equal(source.includes("mt-7 max-w-[36rem]"), false);
  assert.equal(source.includes("lg:mt-7"), false);
});

test("hero top lake and open-time badge is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("Jecheon Cheongpung Lake"), false);
  assert.equal(source.includes("Open 07:00-19:00"), false);
  assert.equal(source.includes("MapPin"), false);
});

test("hero category badge is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("Water Leisure / ATV / Boat Tour"), false);
  assert.equal(source.includes("supanova-badge mb-4"), false);
});

test("hero information panel is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("heroHighlights"), false);
  assert.equal(source.includes("<dl"), false);
  assert.equal(source.includes("border border-white/18 bg-forest/82"), false);
  assert.equal(source.includes("text-white shadow-[0_20px_54px_-38px_rgba(5,47,45,0.82)] backdrop-blur-md"), false);
  assert.equal(source.includes("border border-surface/72 bg-surface/64 p-1.5 text-sm text-foreground backdrop-blur-sm"), false);
});
