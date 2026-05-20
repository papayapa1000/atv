import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home quick info headline explains the selectable course details", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("종목별 요금과 코스를 확인하세요"), true);
  assert.equal(source.includes("오늘 일정에 맞는 종목부터 고르세요"), false);
});

test("home quick info defaults to rides and updates detail from the list", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes('"use client"'), true);
  assert.equal(source.includes('const defaultServiceTitle = "플라이피쉬"'), true);
  assert.equal(source.includes("useState(defaultServiceTitle)"), true);
  assert.equal(source.includes("serviceTabs.find((item) => item.title === selectedTitle)"), true);
  assert.equal(source.includes("onClick={() => setSelectedTitle(item.title)}"), true);
  assert.equal(source.includes('role="tablist"'), true);
  assert.equal(source.includes('aria-selected={item.title === featured.title}'), true);
});

test("home quick info lists all twelve activity items", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");
  const expectedTitles = [
    "수상스키",
    "웨이크보드",
    "플라이피쉬",
    "바나나보트",
    "밴드웨곤",
    "땅콩보트",
    "빅마블",
    "자이언트마블",
    "G-Ral",
    "핵사곤",
    "모터보트",
    "ATV",
  ];

  for (const title of expectedTitles) {
    assert.equal(source.includes(`title: "${title}"`), true);
  }

  assert.equal(source.includes('title: "놀이기구"'), false);
  assert.equal((source.match(/href: "\/activities#/g) ?? []).length, 12);
});

test("home quick info list is vertically scrollable", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("max-h-[18rem]"), true);
  assert.equal(source.includes("overflow-y-auto"), true);
  assert.equal(source.includes("pr-2"), true);
});

test("home quick info operating hours show open and close times", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("07:00"), true);
  assert.equal(source.includes("오픈 시간"), true);
  assert.equal(source.includes("19:00"), true);
  assert.equal(source.includes("마감 시간"), true);
  assert.equal(source.includes("운영 시간은 07:00부터 19:00까지입니다."), true);
});

test("home quick info detail panel does not show the recommendation label", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("추천 흐름"), false);
  assert.equal(source.includes("선택 종목 자세히 보기"), true);
});

test("home quick info price rows do not show the orange divider tick", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("h-px w-10 shrink-0 bg-sun"), false);
  assert.equal(source.includes("featured.prices.map"), true);
});
