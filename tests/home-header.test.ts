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

test("mobile header uses a popup menu instead of horizontal scrolling navigation", () => {
  const source = readFileSync("src/components/home/Header.tsx", "utf8");

  assert.equal(source.includes('aria-label="모바일 주요 메뉴"'), false);
  assert.equal(source.includes("overflow-x-auto rounded-full"), false);
  assert.equal(source.includes('aria-label={isMobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}'), true);
  assert.equal(source.includes('aria-expanded={isMobileMenuOpen}'), true);
  assert.equal(source.includes('aria-controls="mobile-site-menu"'), true);
  assert.equal(source.includes('id="mobile-site-menu"'), true);
  assert.equal(source.includes('aria-label="모바일 메뉴"'), true);
});
