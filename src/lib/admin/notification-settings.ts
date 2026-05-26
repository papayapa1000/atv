export const DEFAULT_RESERVATION_NOTIFICATION_EMAIL = "lallafm1984@gmail.com";
export const DEFAULT_SMTP_HOST = "smtp.gmail.com";
export const DEFAULT_SMTP_PORT = 465;
export const DEFAULT_SMTP_SECURE = true;
export const DEFAULT_SMTP_USER = "lallafm1984@gmail.com";
export const DEFAULT_SMTP_FROM = "제천 수상레저 예약 알림 <lallafm1984@gmail.com>";

export type ReservationEmailSettings = {
  reservationEmailEnabled: boolean;
  reservationRecipientEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpFrom: string;
  smtpPasswordConfigured: boolean;
};

export type ReservationEmailSettingsUpdate = ReservationEmailSettings & {
  smtpPassword: string;
};

export type ReservationEmailSettingsValidationResult =
  | { ok: true; data: ReservationEmailSettingsUpdate }
  | { ok: false; errors: Record<string, string> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeReservationEmailSettingsForm(input: {
  reservationEmailEnabled: unknown;
  reservationRecipientEmail: unknown;
  smtpHost?: unknown;
  smtpPort?: unknown;
  smtpSecure?: unknown;
  smtpUser?: unknown;
  smtpPassword?: unknown;
  smtpFrom?: unknown;
  smtpPasswordConfigured?: unknown;
}): ReservationEmailSettingsUpdate {
  const smtpPort = Number.parseInt(typeof input.smtpPort === "string" ? input.smtpPort.trim() : String(input.smtpPort ?? DEFAULT_SMTP_PORT), 10);

  return {
    reservationEmailEnabled: input.reservationEmailEnabled === "on" || input.reservationEmailEnabled === true,
    reservationRecipientEmail:
      typeof input.reservationRecipientEmail === "string"
        ? input.reservationRecipientEmail.trim()
        : DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
    smtpHost: typeof input.smtpHost === "string" ? input.smtpHost.trim() : DEFAULT_SMTP_HOST,
    smtpPort: Number.isInteger(smtpPort) ? smtpPort : 0,
    smtpSecure: input.smtpSecure === "on" || input.smtpSecure === true,
    smtpUser: typeof input.smtpUser === "string" ? input.smtpUser.trim() : DEFAULT_SMTP_USER,
    smtpPassword: typeof input.smtpPassword === "string" ? input.smtpPassword.trim() : "",
    smtpFrom: typeof input.smtpFrom === "string" ? input.smtpFrom.trim() : DEFAULT_SMTP_FROM,
    smtpPasswordConfigured: input.smtpPasswordConfigured === "true" || input.smtpPasswordConfigured === true,
  };
}

export function validateReservationEmailSettings(
  settings: ReservationEmailSettingsUpdate,
  options: { requireSmtpPassword?: boolean } = {},
): ReservationEmailSettingsValidationResult {
  const errors: Record<string, string> = {};

  if (!emailPattern.test(settings.reservationRecipientEmail)) {
    errors.reservationRecipientEmail = "예약 알림을 받을 이메일 주소를 올바르게 입력해 주세요.";
  }

  if (settings.reservationRecipientEmail.length > 254) {
    errors.reservationRecipientEmail = "이메일 주소는 254자 이하로 입력해 주세요.";
  }

  if (!settings.smtpHost || settings.smtpHost.length > 255) {
    errors.smtpHost = "SMTP 서버 주소를 입력해 주세요.";
  }

  if (!Number.isInteger(settings.smtpPort) || settings.smtpPort < 1 || settings.smtpPort > 65535) {
    errors.smtpPort = "SMTP 포트는 1-65535 사이의 숫자로 입력해 주세요.";
  }

  if (!settings.smtpUser || settings.smtpUser.length > 254) {
    errors.smtpUser = "SMTP 계정을 입력해 주세요.";
  }

  if (options.requireSmtpPassword && !settings.smtpPassword) {
    errors.smtpPassword = "SMTP 비밀번호를 입력해 주세요.";
  }

  if (settings.smtpPassword.length > 500) {
    errors.smtpPassword = "SMTP 비밀번호는 500자 이하로 입력해 주세요.";
  }

  if (!settings.smtpFrom || settings.smtpFrom.length > 320) {
    errors.smtpFrom = "발신자 정보를 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: settings };
}
