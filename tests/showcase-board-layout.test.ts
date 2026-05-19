import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const boardSource = readFileSync("src/components/home/ShowcaseGuide.tsx", "utf8");
const detailSource = readFileSync("src/app/showcase/[id]/page.tsx", "utf8");
const writeFormSource = readFileSync("src/components/showcase/ShowcaseWriteForm.tsx", "utf8");

test("showcase board uses a taller fixed board area", () => {
  assert.match(boardSource, /min-h-\[45rem\]/);
});

test("showcase board rows link to detail pages", () => {
  assert.match(boardSource, /href=\{`\/showcase\/\$\{post\.id\}`\}/);
});

test("showcase board uses a simple list surface instead of a table strip", () => {
  assert.match(boardSource, /bg-white p-5 shadow-\[0_24px_52px_-38px_rgba\(7,59,58,0\.42\)\]/);
  assert.match(boardSource, /divide-y divide-mist/);
  assert.match(boardSource, /sm:grid-cols-\[minmax\(0,1fr\)_9rem\]/);
  assert.doesNotMatch(boardSource, /grid-cols-\[1fr_5\.5rem_6\.5rem\]/);
  assert.doesNotMatch(boardSource, /odd:bg-white/);
  assert.doesNotMatch(boardSource, /even:bg-foam/);
});

test("showcase detail page loads a single post", () => {
  assert.match(detailSource, /getShowcasePost/);
  assert.match(detailSource, /자랑하기 게시판으로/);
});

test("showcase write form does not expose a separate link field", () => {
  assert.doesNotMatch(writeFormSource, /name="linkUrl"/);
  assert.doesNotMatch(writeFormSource, />링크</);
});

test("showcase detail page auto-links URLs written in content", () => {
  assert.match(detailSource, /renderLinkedContent/);
  assert.match(detailSource, /target="_blank"/);
});
