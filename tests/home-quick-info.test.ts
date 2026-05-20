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
  assert.equal(source.includes("useState<string | null>(defaultServiceTitle)"), true);
  assert.equal(source.includes("serviceTabs.find((item) => item.title === selectedTitle)"), true);
  assert.equal(source.includes("setOpenMobileTitle((currentTitle) => (currentTitle === title ? null : title))"), true);
  assert.equal(source.includes("onClick={() => handleServiceClick(item.title)}"), true);
  assert.equal(source.includes("aria-expanded={isMobileOpen}"), true);
  assert.equal(source.includes('role="tablist"'), false);
  assert.equal(source.includes("aria-selected={item.title === featured.title}"), false);
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

test("home quick info list is vertically scrollable on desktop only", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("lg:max-h-[18rem]"), true);
  assert.equal(source.includes("lg:overflow-y-auto"), true);
  assert.equal(source.includes("lg:pr-2"), true);
});

test("home quick info uses inline mobile details and desktop-only media panel", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes("function MobileQuickInfoDetail"), true);
  assert.equal(source.includes('import { AnimatePresence, motion } from "motion/react";'), true);
  assert.equal(source.includes("initial={{ height: 0, opacity: 0, y: -12, scaleY: 0.96 }}"), true);
  assert.equal(source.includes('animate={{ height: "auto", opacity: 1, y: 0, scaleY: 1 }}'), true);
  assert.equal(source.includes("exit={{ height: 0, opacity: 0, y: -12, scaleY: 0.96 }}"), true);
  assert.equal(source.includes("<AnimatePresence initial={false}>"), true);
  assert.equal(source.includes("data-mobile-quick-info-panel"), true);
  assert.equal(source.includes("data-motion-skip"), true);
  assert.equal(source.includes("lg:hidden"), true);
  assert.equal(source.includes("function DesktopQuickInfoPanel"), true);
  assert.equal(source.includes('id="quick-info-desktop-panel"'), true);
  assert.equal(source.includes("hidden rounded-[2rem] bg-surface/72 p-1.5 lg:col-span-7 lg:block"), true);
});

test("home quick info course selector arrows do not slide on hover", () => {
  const source = readFileSync("src/components/home/QuickInfo.tsx", "utf8");

  assert.equal(source.includes('className={`h-4 w-4 transition-transform duration-300 ${isMobileOpen ? "rotate-90 lg:rotate-0" : ""}`}'), true);
  assert.equal((source.match(/group-hover:translate-x-1/g) ?? []).length, 1);
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
  assert.equal(source.includes("service.prices.map"), true);
});
