import "server-only";

import { supabaseRest } from "@/lib/supabase/rest";
import {
  DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
  DEFAULT_SMTP_FROM,
  DEFAULT_SMTP_HOST,
  DEFAULT_SMTP_PORT,
  DEFAULT_SMTP_SECURE,
  DEFAULT_SMTP_USER,
  type ReservationEmailSettings,
  type ReservationEmailSettingsUpdate,
} from "./notification-settings";

type AdminSiteSettingsRow = {
  id: boolean;
  reservation_email_enabled: boolean;
  reservation_recipient_email: string;
  smtp_host?: string | null;
  smtp_port?: number | null;
  smtp_secure?: boolean | null;
  smtp_user?: string | null;
  smtp_password?: string | null;
  smtp_from?: string | null;
};

export type ReservationEmailDeliverySettings = ReservationEmailSettings & {
  smtpPassword: string;
};

const settingsSelect =
  "id,reservation_email_enabled,reservation_recipient_email,smtp_host,smtp_port,smtp_secure,smtp_user,smtp_password,smtp_from";

function toReservationEmailSettings(row?: AdminSiteSettingsRow | null): ReservationEmailDeliverySettings {
  const smtpPassword = row?.smtp_password ?? "";

  return {
    reservationEmailEnabled: row?.reservation_email_enabled ?? true,
    reservationRecipientEmail: row?.reservation_recipient_email ?? DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
    smtpHost: row?.smtp_host ?? DEFAULT_SMTP_HOST,
    smtpPort: row?.smtp_port ?? DEFAULT_SMTP_PORT,
    smtpSecure: row?.smtp_secure ?? DEFAULT_SMTP_SECURE,
    smtpUser: row?.smtp_user ?? DEFAULT_SMTP_USER,
    smtpPassword,
    smtpPasswordConfigured: Boolean(smtpPassword),
    smtpFrom: row?.smtp_from ?? DEFAULT_SMTP_FROM,
  };
}

export async function getReservationEmailSettings(): Promise<ReservationEmailSettings> {
  const rows = await supabaseRest<AdminSiteSettingsRow[]>(
    `admin_site_settings?select=${settingsSelect}&id=eq.true&limit=1`,
  );
  const settings = toReservationEmailSettings(rows[0]);

  return {
    reservationEmailEnabled: settings.reservationEmailEnabled,
    reservationRecipientEmail: settings.reservationRecipientEmail,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpSecure: settings.smtpSecure,
    smtpUser: settings.smtpUser,
    smtpFrom: settings.smtpFrom,
    smtpPasswordConfigured: settings.smtpPasswordConfigured,
  };
}

export async function getReservationEmailDeliverySettings(): Promise<ReservationEmailDeliverySettings> {
  const rows = await supabaseRest<AdminSiteSettingsRow[]>(
    `admin_site_settings?select=${settingsSelect}&id=eq.true&limit=1`,
  );

  return toReservationEmailSettings(rows[0]);
}

export async function updateReservationEmailSettings(settings: ReservationEmailSettingsUpdate) {
  await supabaseRest<AdminSiteSettingsRow[]>("admin_site_settings?on_conflict=id&select=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      id: true,
      reservation_email_enabled: settings.reservationEmailEnabled,
      reservation_recipient_email: settings.reservationRecipientEmail,
      smtp_host: settings.smtpHost,
      smtp_port: settings.smtpPort,
      smtp_secure: settings.smtpSecure,
      smtp_user: settings.smtpUser,
      smtp_password: settings.smtpPassword,
      smtp_from: settings.smtpFrom,
    }),
  });
}
