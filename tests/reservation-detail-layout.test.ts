import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("reservation detail reply form stays under the content section", () => {
  const source = readFileSync("src/components/reservation/ReservationDetailClient.tsx", "utf8");

  assert.equal(source.includes("<aside"), false);
  assert.equal(source.includes("ChatText"), false);
  assert.equal(source.includes("md:grid-cols-[1fr_auto]"), true);
});

test("reservation detail separates post body and replies visually", () => {
  const source = readFileSync("src/components/reservation/ReservationDetailClient.tsx", "utf8");

  assert.equal(source.includes("bg-white p-4"), true);
  assert.equal(source.includes("<RepliesList replies={state.replies} />"), true);
  assert.equal(source.includes('reply.authorType === "admin" ? "관리자" : "고객"'), true);
  assert.equal(source.includes("border-l-2 border-lake bg-foam/80"), false);
  assert.equal(source.includes("function replyToneClass"), true);
  assert.equal(source.includes("border-lake bg-white"), true);
  assert.equal(source.includes("border-sun bg-white"), true);
  assert.equal(source.includes("bg-lake/8"), false);
  assert.equal(source.includes("bg-sun/12"), false);
  assert.equal(source.includes("const tone = replyToneClass(reply.authorType)"), true);
});

test("locked reservation password form is centered", () => {
  const source = readFileSync("src/components/reservation/ReservationDetailClient.tsx", "utf8");

  assert.equal(source.includes("grid min-h-[18rem] w-full place-items-center"), true);
  assert.equal(source.includes("w-full max-w-[22rem] border border-foreground/12 bg-surface"), true);
});

test("reservation detail status badge uses the shared pending and cancelled colors", () => {
  const source = readFileSync("src/components/reservation/ReservationDetailClient.tsx", "utf8");

  assert.equal(source.includes('return "border-gray-300 bg-gray-100 text-gray-700";'), true);
  assert.equal(source.includes('return "border-sun bg-sun text-white";'), true);
  assert.equal(source.includes('return "border-sun/30 bg-sun/24 text-deep";'), false);
  assert.equal(source.includes('return "border-foreground/12 bg-surface-muted text-ink-muted";'), false);
});
