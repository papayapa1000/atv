import assert from "node:assert/strict";
import test from "node:test";
import {
  getReservationBoardTitle,
  normalizeReservationBoardPage,
  formatReservationTime,
  maskPhoneNumber,
  normalizeReservationForm,
  validateReservationForm,
} from "../src/lib/reservations/validation";

test("normalizes valid reservation form data", () => {
  const data = normalizeReservationForm({
    customerName: " 홍길동 ",
    password: "1234",
    phone: "010-1234-5678",
    peopleCount: "5",
    reservationDate: "2026-05-19",
    reservationPeriod: "오후",
    reservationHour: "2",
    leisureType: "바나나보트",
    depositorName: " 홍길동 ",
    message: "도착 전에 연락 주세요.",
    website: "",
  });

  assert.deepEqual(data, {
    customerName: "홍길동",
    password: "1234",
    phone: "010-1234-5678",
    peopleCount: 5,
    reservationDate: "2026-05-19",
    reservationPeriod: "오후",
    reservationHour: 2,
    leisureType: "바나나보트",
    depositorName: "홍길동",
    message: "도착 전에 연락 주세요.",
    website: "",
  });
});

test("rejects non-Korean reservation names and same-day reservations", () => {
  const result = validateReservationForm(
    {
      customerName: "John",
      password: "1234",
      phone: "01012345678",
      peopleCount: 2,
      reservationDate: "2026-05-18",
      reservationPeriod: "오전",
      reservationHour: 10,
      leisureType: "ATV",
      depositorName: "홍길동",
      message: "",
      website: "",
    },
    "2026-05-18",
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.customerName ?? "", /국문/);
  assert.match(result.errors.reservationDate ?? "", /다음 날/);
});

test("masks phone numbers for public board display", () => {
  assert.equal(maskPhoneNumber("010-1234-5678"), "010-1234-····");
  assert.equal(maskPhoneNumber("01012345678"), "010-1234-····");
});

test("formats reservation time like the reference board", () => {
  assert.equal(formatReservationTime("2026-07-17", "오후", 1, 5), "2026.07.17 / 오후 1시 (5인)");
});

test("formats public board titles as customer reservation inquiries", () => {
  assert.equal(getReservationBoardTitle("임지수"), "임지수 님의 예약 문의");
});

test("normalizes reservation board pagination", () => {
  assert.deepEqual(normalizeReservationBoardPage("2", 23, 10), {
    page: 2,
    pageSize: 10,
    totalCount: 23,
    totalPages: 3,
    offset: 10,
  });

  assert.equal(normalizeReservationBoardPage("999", 23, 10).page, 3);
  assert.equal(normalizeReservationBoardPage("abc", 23, 10).page, 1);
  assert.equal(normalizeReservationBoardPage("1", 0, 10).totalPages, 1);
});
