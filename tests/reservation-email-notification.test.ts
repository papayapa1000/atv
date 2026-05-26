import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildReservationNotificationEmail, getSmtpConfigFromSettings } from "../src/lib/notifications/reservation-email";

const reservation = {
  customerName: "홍길동",
  password: "1234",
  phone: "010-1234-5678",
  peopleCount: 4,
  reservationDate: "2026-07-17",
  reservationPeriod: "오후" as const,
  reservationHour: 2,
  leisureType: "수상스키",
  depositorName: "홍길동",
  message: "도착 전에 연락 주세요.",
  website: "",
};

test("builds a reservation notification email with key reservation details", () => {
  const email = buildReservationNotificationEmail({
    reservation,
    reservationId: "reservation-123",
    siteUrl: "https://example.com",
  });

  assert.equal(email.subject, "[제천 수상레저] 새 예약 문의가 등록되었습니다 - 홍길동");
  assert.equal(email.text.includes("예약자: 홍길동"), true);
  assert.equal(email.text.includes("연락처: 010-1234-5678"), true);
  assert.equal(email.text.includes("일정: 2026.07.17 / 오후 2시 (4인)"), true);
  assert.equal(email.text.includes("이용 레저: 수상스키"), true);
  assert.equal(email.text.includes("입금자명: 홍길동"), true);
  assert.equal(email.text.includes("https://example.com/reservation/board/reservation-123"), true);
});

test("builds SMTP configuration from database settings instead of environment variables", () => {
  assert.equal(
    getSmtpConfigFromSettings({
      reservationEmailEnabled: true,
      reservationRecipientEmail: "admin@example.com",
      smtpHost: "smtp.example.com",
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: "sender@example.com",
      smtpPassword: "",
      smtpPasswordConfigured: false,
      smtpFrom: "예약 알림 <sender@example.com>",
    }),
    null,
  );

  assert.deepEqual(
    getSmtpConfigFromSettings({
      reservationEmailEnabled: true,
      reservationRecipientEmail: "admin@example.com",
      smtpHost: "smtp.example.com",
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: "sender@example.com",
      smtpPassword: "secret-pass",
      smtpPasswordConfigured: true,
      smtpFrom: "예약 알림 <sender@example.com>",
    }),
    {
      host: "smtp.example.com",
      port: 465,
      secure: true,
      user: "sender@example.com",
      password: "secret-pass",
      from: "예약 알림 <sender@example.com>",
    },
  );

  const source = readFileSync("src/lib/notifications/reservation-email.ts", "utf8");
  assert.equal(source.includes("getSmtpConfigFromEnv"), false);
  assert.equal(source.includes("process.env"), false);
});

test("reservation create action sends admin notification after saving without blocking redirects", () => {
  const actionSource = readFileSync("src/app/reservation/actions.ts", "utf8");

  const saveIndex = actionSource.indexOf("const created = await createReservationPost(result.data)");
  const notifyIndex = actionSource.indexOf("await sendReservationCreatedNotification");
  const redirectIndex = actionSource.indexOf('redirect("/reservation/board?created=1")');

  assert.equal(actionSource.includes("sendReservationCreatedNotification"), true);
  assert.equal(saveIndex > -1, true);
  assert.equal(notifyIndex > saveIndex, true);
  assert.equal(notifyIndex < redirectIndex, true);
  assert.equal(actionSource.includes("Reservation notification email failed"), true);
});
