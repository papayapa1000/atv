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

test("activities page highlights which deposit account applies to ATV versus other activities", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");

  assert.equal(source.includes('import { DepositAccountGuide } from "@/components/reservation/DepositAccountGuide";'), true);
  assert.equal(source.includes('<DepositAccountGuide headingLevel="h3" />'), true);
});

test("activities reservation notes start operating hours at 09:00", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");

  assert.equal(source.includes("운행시간은 오전 09:00부터 오후 19:00까지입니다."), true);
  assert.equal(source.includes("운행시간은 오전 07:00부터 오후 19:00까지입니다."), false);
});

test("activities page shows updated water sports and ATV pricing", () => {
  const source = readFileSync("src/app/activities/page.tsx", "utf8");

  assert.equal(source.includes('{ label: "초보강습", value: "80,000원", note: "지상교육, 봉 1회, 로프 1회, 장비 무상대여" }'), true);
  assert.equal(source.includes('{ label: "아웃보트", value: "28,000원", note: "무상장비 대여 가능" }'), true);
  assert.equal(source.includes('{ label: "매직보트", value: "33,000원", note: "무상장비 대여 가능" }'), true);
  assert.equal(source.includes('{ label: "1인용", value: "30,000원" }'), true);
  assert.equal(source.includes('{ label: "2인용 버기카", value: "60,000원" }'), true);
  assert.equal(source.includes('quote: "안전교육 및 레저보험이 가입되어 있어 안전합니다."'), true);
  assert.equal(source.includes('{ label: "안내", value: "안전교육·레저보험 가입"'), false);
  assert.equal(source.includes("1인용과 2인용 모두 동일 요금"), false);
  assert.equal(source.includes("1인용\", value: \"25,000원"), false);
});
