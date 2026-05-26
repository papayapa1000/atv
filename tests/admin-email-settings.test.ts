import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
  normalizeReservationEmailSettingsForm,
  validateReservationEmailSettings,
} from "../src/lib/admin/notification-settings";

test("normalizes and validates reservation notification email settings", () => {
  const normalized = normalizeReservationEmailSettingsForm({
    reservationEmailEnabled: "on",
    reservationRecipientEmail: " lallafm1984@gmail.com ",
    smtpHost: " smtp.gmail.com ",
    smtpPort: "465",
    smtpSecure: "on",
    smtpUser: " lallafm1984@gmail.com ",
    smtpPassword: " new-app-password ",
    smtpFrom: " 제천 수상레저 예약 알림 <lallafm1984@gmail.com> ",
  });
  const result = validateReservationEmailSettings(normalized);

  assert.equal(DEFAULT_RESERVATION_NOTIFICATION_EMAIL, "lallafm1984@gmail.com");
  assert.deepEqual(normalized, {
    reservationEmailEnabled: true,
    reservationRecipientEmail: "lallafm1984@gmail.com",
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: "lallafm1984@gmail.com",
    smtpPassword: "new-app-password",
    smtpFrom: "제천 수상레저 예약 알림 <lallafm1984@gmail.com>",
    smtpPasswordConfigured: false,
  });
  assert.equal(result.ok, true);
});

test("rejects invalid reservation notification email settings", () => {
  const result = validateReservationEmailSettings(
    normalizeReservationEmailSettingsForm({
      reservationEmailEnabled: "on",
      reservationRecipientEmail: "not-an-email",
      smtpHost: "",
      smtpPort: "99999",
      smtpSecure: "",
      smtpUser: "",
      smtpPassword: "",
      smtpFrom: "",
    }),
    { requireSmtpPassword: true },
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.reservationRecipientEmail ?? "", /이메일/);
  assert.match(result.errors.smtpHost ?? "", /SMTP 서버/);
  assert.match(result.errors.smtpPort ?? "", /포트/);
  assert.match(result.errors.smtpUser ?? "", /계정/);
  assert.match(result.errors.smtpPassword ?? "", /비밀번호/);
  assert.match(result.errors.smtpFrom ?? "", /발신/);
});

test("admin settings page and navigation expose reservation email settings", () => {
  const pageSource = readFileSync("src/app/admin/settings/page.tsx", "utf8");
  const formSource = readFileSync("src/components/admin/AdminEmailSettingsForm.tsx", "utf8");
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const topbarSource = readFileSync("src/components/admin/AdminTopbar.tsx", "utf8");
  const dashboardSource = readFileSync("src/app/admin/dashboard/page.tsx", "utf8");
  const migrationSource = readFileSync("supabase/migrations/20260526000000_create_admin_site_settings.sql", "utf8");
  const smtpMigrationSource = readFileSync("supabase/migrations/20260526010000_add_smtp_settings_to_admin_site_settings.sql", "utf8");

  assert.equal(pageSource.includes("getReservationEmailSettings"), true);
  assert.equal(pageSource.includes("AdminEmailSettingsForm"), true);
  assert.equal(formSource.includes("updateAdminEmailSettingsAction"), true);
  assert.equal(formSource.includes('name="reservationRecipientEmail"'), true);
  assert.equal(formSource.includes('type="email"'), true);
  assert.equal(formSource.includes('name="reservationEmailEnabled"'), true);
  assert.equal(formSource.includes('name="smtpHost"'), true);
  assert.equal(formSource.includes('name="smtpPort"'), true);
  assert.equal(formSource.includes('name="smtpSecure"'), true);
  assert.equal(formSource.includes('name="smtpUser"'), true);
  assert.equal(formSource.includes('name="smtpPassword"'), true);
  assert.equal(formSource.includes('name="smtpFrom"'), true);
  assert.equal(formSource.includes("defaultValue={settings.smtpPassword"), false);
  assert.equal(actionSource.includes("updateAdminEmailSettingsAction"), true);
  assert.equal(actionSource.includes("smtpPassword || existingSettings.smtpPassword"), true);
  assert.equal(topbarSource.includes('label: "설정"'), true);
  assert.equal(dashboardSource.includes('label: "설정"'), true);
  assert.equal(migrationSource.includes("admin_site_settings"), true);
  assert.equal(migrationSource.includes("smtp_password"), true);
  assert.equal(smtpMigrationSource.includes("add column if not exists smtp_password"), true);
  assert.equal(migrationSource.includes("lallafm1984@gmail.com"), true);
});
