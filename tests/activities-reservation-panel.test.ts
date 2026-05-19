import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("activities refund panel uses the neutral reservation card background", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");

  assert.equal(
    source.includes(
      'className="depth-mint depth-panel-quiet border border-lake/14 bg-lake/8 p-6 sm:p-8">\n              <h3 className="text-2xl font-bold">환불규정</h3>',
    ),
    false,
  );
  assert.equal(
    source.includes(
      'className="depth-surface depth-panel-quiet depth-panel-bottom-shadow border border-mist bg-surface p-6 sm:p-8">\n              <h3 className="text-2xl font-bold">환불규정</h3>',
    ),
    true,
  );
});

test("activities reservation panels use a gray bottom shadow", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");
  const styles = readFileSync("src/app/globals.css", "utf8");

  assert.equal((source.match(/depth-panel-bottom-shadow/g) ?? []).length, 2);
  assert.match(
    styles,
    /\.depth-panel-quiet\.depth-panel-bottom-shadow\s*{[\s\S]*box-shadow:[\s\S]*0 18px 28px -18px rgba\(107, 114, 128, 0\.72\)/,
  );
});
