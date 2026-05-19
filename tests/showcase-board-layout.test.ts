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

test("showcase board alternates odd and even row backgrounds", () => {
  assert.match(boardSource, /odd:bg-white/);
  assert.match(boardSource, /even:bg-foam/);
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
