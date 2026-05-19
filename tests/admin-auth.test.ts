import assert from "node:assert/strict";
import test from "node:test";
import { hashSessionToken } from "../src/lib/admin/crypto";
import { normalizeAdminReservationUpdate, validateAdminReservationUpdate } from "../src/lib/admin/validation";
import { getStatusLabel } from "../src/lib/reservations/validation";

test("compares admin login against the stored plain password value", () => {
  const storedPassword: string = "Admin-Password-2026!";

  assert.equal("Admin-Password-2026!" === storedPassword, true);
  assert.equal("wrong-password" === storedPassword, false);
});

test("hashes admin session tokens deterministically", () => {
  assert.equal(hashSessionToken("abc123"), hashSessionToken("abc123"));
  assert.notEqual(hashSessionToken("abc123"), "abc123");
});

test("normalizes and validates admin reservation updates", () => {
  const data = normalizeAdminReservationUpdate({
    status: "confirmed",
    adminNote: " 예약 확정되었습니다. ",
  });
  const result = validateAdminReservationUpdate(data);

  assert.deepEqual(data, {
    status: "confirmed",
    adminNote: "예약 확정되었습니다.",
  });
  assert.equal(result.ok, true);
});

test("rejects invalid admin reservation updates", () => {
  const result = validateAdminReservationUpdate(
    normalizeAdminReservationUpdate({
      status: "done",
      adminNote: "a".repeat(2001),
    }),
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.status ?? "", /상태/);
  assert.match(result.errors.adminNote ?? "", /1,000자/);
});

test("uses public reservation status labels requested for the board", () => {
  assert.equal(getStatusLabel("pending"), "예약대기");
  assert.equal(getStatusLabel("confirmed"), "예약완료");
  assert.equal(getStatusLabel("cancelled"), "예약취소");
});
