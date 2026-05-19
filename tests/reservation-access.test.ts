import assert from "node:assert/strict";
import test from "node:test";
import { normalizeReservationReply, validateReservationReply } from "../src/lib/reservations/reply-validation";

test("normalizes customer reservation replies", () => {
  assert.equal(normalizeReservationReply({ message: "  도착 시간이 30분 늦어집니다.  " }).message, "도착 시간이 30분 늦어집니다.");
});

test("validates customer reservation replies", () => {
  const valid = validateReservationReply(normalizeReservationReply({ message: "관리자 답글 확인했습니다." }));
  assert.equal(valid.ok, true);

  const empty = validateReservationReply(normalizeReservationReply({ message: "   " }));
  assert.equal(empty.ok, false);
  assert.match(empty.errors.message ?? "", /내용/);

  const tooLong = validateReservationReply(normalizeReservationReply({ message: "가".repeat(1001) }));
  assert.equal(tooLong.ok, false);
  assert.match(tooLong.errors.message ?? "", /1,000자/);
});
