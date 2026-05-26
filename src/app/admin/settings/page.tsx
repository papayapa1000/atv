import type { Metadata } from "next";
import { AdminEmailSettingsForm } from "@/components/admin/AdminEmailSettingsForm";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import {
  DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
  DEFAULT_SMTP_FROM,
  DEFAULT_SMTP_HOST,
  DEFAULT_SMTP_PORT,
  DEFAULT_SMTP_SECURE,
  DEFAULT_SMTP_USER,
  type ReservationEmailSettings,
} from "@/lib/admin/notification-settings";
import { getReservationEmailSettings } from "@/lib/admin/notification-settings-repository";
import { requireAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 설정 | 제천 수상레저 & 청풍 ATV",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminSettingsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  await requireAdminSession();
  const params = searchParams ? await searchParams : {};
  let settings: ReservationEmailSettings = {
    reservationEmailEnabled: true,
    reservationRecipientEmail: DEFAULT_RESERVATION_NOTIFICATION_EMAIL,
    smtpHost: DEFAULT_SMTP_HOST,
    smtpPort: DEFAULT_SMTP_PORT,
    smtpSecure: DEFAULT_SMTP_SECURE,
    smtpUser: DEFAULT_SMTP_USER,
    smtpFrom: DEFAULT_SMTP_FROM,
    smtpPasswordConfigured: false,
  };
  let loadError = "";

  try {
    settings = await getReservationEmailSettings();
  } catch {
    loadError = "메일 설정을 불러오지 못했습니다. Supabase admin_site_settings 테이블을 확인해 주세요.";
  }

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="settings" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[960px]">
          <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">Settings</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">관리자 설정</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
            예약글이 등록될 때 관리자에게 발송되는 이메일 알림 수신 정보를 관리합니다.
          </p>

          {params.saved ? (
            <div className="mt-8 border border-lake/20 bg-surface px-5 py-4 text-sm font-bold text-lake">메일 설정이 저장되었습니다.</div>
          ) : null}

          {params.error || loadError ? (
            <div className="mt-8 border border-sunset/25 bg-surface px-5 py-4 text-sm font-bold text-sunset">
              {loadError || "메일 설정을 저장하지 못했습니다. 이메일 주소를 확인해 주세요."}
            </div>
          ) : null}

          <section className="mt-8 border border-foreground/12 bg-surface p-5 sm:p-6" aria-labelledby="reservation-email-settings-title">
            <h2 id="reservation-email-settings-title" className="text-xl font-semibold">
              예약 알림 메일
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/58">
              발송 계정 비밀번호는 관리자 화면에 저장하지 않습니다. 서버의 SMTP 환경변수로만 관리합니다.
            </p>
            <div className="mt-6">
              <AdminEmailSettingsForm settings={settings} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
