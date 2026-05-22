import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const boardSource = readFileSync("src/components/home/ShowcaseGuide.tsx", "utf8");
const detailSource = readFileSync("src/app/showcase/[id]/page.tsx", "utf8");
const writePageSource = readFileSync("src/app/showcase/write/page.tsx", "utf8");
const writeFormSource = readFileSync("src/components/showcase/ShowcaseWriteForm.tsx", "utf8");

test("showcase board uses a taller fixed board area", () => {
  assert.match(boardSource, /min-h-\[45rem\]/);
});

test("showcase board rows link to detail pages", () => {
  assert.match(boardSource, /href=\{`\/showcase\/\$\{post\.id\}`\}/);
});

test("showcase board includes the Naver blog guide link", () => {
  assert.match(boardSource, /https:\/\/blog\.naver\.com\/dori0924/);
  assert.match(boardSource, /네이버 블로그 안내/);
  assert.match(boardSource, /네이버 블로그 이동하기/);
});

test("showcase board places the Naver blog guide outside and above the board card", () => {
  assert.match(boardSource, /<div className="grid gap-4">\s*<div className="flex flex-col gap-3 border border-sunset\/20 bg-sun\/8/);
  assert.ok(boardSource.indexOf("네이버 블로그 안내") < boardSource.indexOf("grid min-h-[45rem]"));
  assert.ok(boardSource.indexOf("네이버 블로그 안내") < boardSource.indexOf('<h2 className="text-2xl font-bold">자랑하기 게시판</h2>'));
});

test("showcase Naver blog button uses a warm color distinct from the write button", () => {
  assert.match(boardSource, /border border-sun bg-sun px-3\.5 py-2/);
  assert.match(boardSource, /hover:border-sunset hover:bg-sunset/);
  assert.match(boardSource, /border border-lake bg-lake px-4 py-2\.5/);
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

test("showcase write page guides SNS URLs and video links", () => {
  assert.match(writeFormSource, /공유할 URL을 함께 입력해 주세요\.\\n자신의 인스타그램, 페이스북 등 SNS URL을 공유해주시면 좋습니다\./);
  assert.match(writePageSource, /영상은 링크만 가능합니다\./);
});

test("showcase write page keeps the label below the back link", () => {
  assert.match(writePageSource, /mt-8 flex w-fit border-b/);
  assert.doesNotMatch(writePageSource, /mt-8 inline-flex border-b/);
});

test("showcase detail page auto-links URLs written in content", () => {
  assert.match(detailSource, /renderLinkedContent/);
  assert.match(detailSource, /target="_blank"/);
});
