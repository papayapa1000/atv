import nodemailer from "nodemailer";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/sitemap";
import type { ReservationEmailDeliverySettings } from "@/lib/admin/notification-settings-repository";
import { formatReservationTime, type NormalizedReservationForm } from "@/lib/reservations/validation";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

export type ReservationNotificationEmailInput = {
  reservation: NormalizedReservationForm;
  reservationId?: string;
  siteUrl?: string;
};

export function getSmtpConfigFromSettings(settings: ReservationEmailDeliverySettings): SmtpConfig | null {
  if (
    !settings.smtpHost ||
    !settings.smtpUser ||
    !settings.smtpPassword ||
    !settings.smtpFrom ||
    !Number.isInteger(settings.smtpPort) ||
    settings.smtpPort <= 0
  ) {
    return null;
  }

  return {
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpSecure,
    user: settings.smtpUser,
    password: settings.smtpPassword,
    from: settings.smtpFrom,
  };
}

export function buildReservationNotificationEmail({ reservation, reservationId, siteUrl = getSiteUrl() }: ReservationNotificationEmailInput) {
  const detailUrl = reservationId ? toAbsoluteUrl(siteUrl, `/reservation/board/${reservationId}`) : toAbsoluteUrl(siteUrl, "/admin/reservations");
  const reservationPeriod = reservation.reservationPeriod || "오전";
  const reservationTime = formatReservationTime(
    reservation.reservationDate,
    reservationPeriod,
    reservation.reservationHour,
    reservation.peopleCount,
  );
  const lines = [
    "새 예약 문의가 등록되었습니다.",
    "",
    `예약자: ${reservation.customerName}`,
    `연락처: ${reservation.phone}`,
    `일정: ${reservationTime}`,
    `이용 레저: ${reservation.leisureType || "예약 문의"}`,
    `입금자명: ${reservation.depositorName || "-"}`,
    "",
    "문의내용:",
    reservation.message || "-",
    "",
    `예약글 확인: ${detailUrl}`,
  ];

  return {
    subject: `[제천 수상레저] 새 예약 문의가 등록되었습니다 - ${reservation.customerName}`,
    text: lines.join("\n"),
  };
}

export async function sendReservationCreatedNotification(input: ReservationNotificationEmailInput) {
  const { getReservationEmailDeliverySettings } = await import("@/lib/admin/notification-settings-repository");
  const settings = await getReservationEmailDeliverySettings();

  if (!settings.reservationEmailEnabled) {
    return { sent: false, reason: "disabled" as const };
  }

  const smtpConfig = getSmtpConfigFromSettings(settings);

  if (!smtpConfig) {
    return { sent: false, reason: "missing-smtp-config" as const };
  }

  const email = buildReservationNotificationEmail(input);
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  });

  await transporter.sendMail({
    from: smtpConfig.from,
    to: settings.reservationRecipientEmail,
    subject: email.subject,
    text: email.text,
  });

  return { sent: true, reason: "sent" as const };
}
