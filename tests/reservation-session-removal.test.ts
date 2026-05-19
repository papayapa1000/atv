import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const reservationSourceFiles = [
  "src/app/reservation/board/[id]/actions.ts",
  "src/app/reservation/board/[id]/page.tsx",
  "src/lib/reservations/repository.ts",
];

test("reservation detail access does not use persistent view sessions", () => {
  const combinedSource = reservationSourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

  assert.equal(combinedSource.includes("reservation_view_sessions"), false);
  assert.equal(combinedSource.includes("getReservationAccessSession"), false);
  assert.equal(combinedSource.includes("issueReservationAccessSession"), false);
});
