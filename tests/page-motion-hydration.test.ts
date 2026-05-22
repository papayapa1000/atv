import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("page motion does not render client-only motion preference attributes during hydration", () => {
  const source = readFileSync("src/components/motion/PageMotion.tsx", "utf8");

  assert.equal(source.includes("useReducedMotion"), false);
  assert.equal(source.includes("matchMedia"), false);
  assert.equal(source.includes("prefers-reduced-motion"), false);
  assert.equal(source.includes("data-prefers-reduced-motion"), false);
  assert.equal(source.includes("useState(false)"), true);
  assert.equal(source.includes('const motionParam = new URLSearchParams(window.location.search).get("motion");'), true);
  assert.equal(source.includes('setIsDebugMode(motionParam === "debug");'), true);
  assert.equal(source.includes('motionParam === "off" || motionParam === "reduce"'), true);
  assert.equal(source.includes("const shouldReduceMotion = isMotionDisabled;"), true);
});
