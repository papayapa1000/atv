import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const files = [
  "src/app/activities/page.tsx",
  "src/app/reservation/board/page.tsx",
  "src/app/water-ski-atv/page.tsx",
  "src/app/admin/reservations/page.tsx",
  "src/components/admin/AdminGalleryPostForm.tsx",
  "src/components/admin/AdminLoginForm.tsx",
  "src/components/admin/AdminStayPostForm.tsx",
  "src/components/admin/AdminVideoPostForm.tsx",
  "src/components/home/ActivitiesScrollShowcase.tsx",
  "src/components/home/HomeOverview.tsx",
  "src/components/home/Pricing.tsx",
  "src/components/home/QuickInfo.tsx",
  "src/components/home/ReservationGuide.tsx",
  "src/components/home/ShowcaseGuide.tsx",
  "src/components/reservation/ReservationDetailClient.tsx",
  "src/components/reservation/ReservationWriteForm.tsx",
  "src/components/showcase/ShowcaseWriteForm.tsx",
];

function sourceLines() {
  return files.flatMap((file) =>
    readFileSync(join(process.cwd(), file), "utf8")
      .split(/\r?\n/)
      .map((line, index) => ({ file, line: index + 1, text: line })),
  );
}

test("orange filled buttons hover to darker orange, not teal or black", () => {
  const offenders = sourceLines().filter(
    ({ text }) => /(?:^|\s)bg-sun(?:\s|")/.test(text) && /hover:bg-(lake|forest|foreground)\b/.test(text),
  );

  assert.deepEqual(offenders, []);
});

test("lake filled buttons hover to darker lake, not orange", () => {
  const offenders = sourceLines().filter(
    ({ text }) => /(?:^|\s)bg-lake(?:\s|")/.test(text) && /hover:(border|bg)-sun\b/.test(text),
  );

  assert.deepEqual(offenders, []);
});
