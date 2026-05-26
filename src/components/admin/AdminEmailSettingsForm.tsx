import { updateAdminEmailSettingsAction } from "@/app/admin/actions";
import type { ReservationEmailSettings } from "@/lib/admin/notification-settings";

type AdminEmailSettingsFormProps = {
  settings: ReservationEmailSettings;
};

export function AdminEmailSettingsForm({ settings }: AdminEmailSettingsFormProps) {
  return (
    <form action={updateAdminEmailSettingsAction} className="grid gap-5">
      <label className="flex items-start gap-3 border border-foreground/12 bg-foam px-4 py-4">
        <input
          name="reservationEmailEnabled"
          type="checkbox"
          defaultChecked={settings.reservationEmailEnabled}
          className="mt-1 h-4 w-4 accent-lake"
        />
        <span>
          <span className="block text-sm font-bold text-foreground">새 예약글 등록 시 관리자 이메일 알림 받기</span>
          <span className="mt-1 block text-xs leading-6 text-foreground/58">
            아래 SMTP 설정이 저장되어 있을 때만 실제 메일이 발송됩니다.
          </span>
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-bold text-foreground">알림 받을 이메일</span>
        <input
          name="reservationRecipientEmail"
          type="email"
          required
          maxLength={254}
          defaultValue={settings.reservationRecipientEmail}
          className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
        />
      </label>

      <div className="grid gap-4 border border-foreground/12 bg-foam p-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-foreground">SMTP 서버</span>
          <input
            name="smtpHost"
            required
            maxLength={255}
            defaultValue={settings.smtpHost}
            placeholder="smtp.gmail.com"
            className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-foreground">SMTP 포트</span>
          <input
            name="smtpPort"
            type="number"
            required
            min={1}
            max={65535}
            defaultValue={settings.smtpPort}
            className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-foreground">SMTP 계정</span>
          <input
            name="smtpUser"
            required
            maxLength={254}
            defaultValue={settings.smtpUser}
            placeholder="lallafm1984@gmail.com"
            className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-foreground">SMTP 비밀번호</span>
          <input
            name="smtpPassword"
            type="password"
            maxLength={500}
            placeholder={settings.smtpPasswordConfigured ? "저장된 비밀번호 유지" : "앱 비밀번호 입력"}
            className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
          />
          <span className="mt-1 block text-xs leading-6 text-foreground/58">
            {settings.smtpPasswordConfigured ? "새 비밀번호를 입력하면 기존 값이 교체됩니다." : "처음 설정할 때는 SMTP 비밀번호가 필요합니다."}
          </span>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-bold text-foreground">발신자</span>
          <input
            name="smtpFrom"
            required
            maxLength={320}
            defaultValue={settings.smtpFrom}
            placeholder="제천 수상레저 예약 알림 <lallafm1984@gmail.com>"
            className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none focus:border-lake"
          />
        </label>

        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            name="smtpSecure"
            type="checkbox"
            defaultChecked={settings.smtpSecure}
            className="mt-1 h-4 w-4 accent-lake"
          />
          <span>
            <span className="block text-sm font-bold text-foreground">SSL/TLS 보안 연결 사용</span>
            <span className="mt-1 block text-xs leading-6 text-foreground/58">Gmail 465 포트는 보안 연결을 켜야 합니다.</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="spring inline-flex w-fit items-center justify-center bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-sunset hover:text-white"
      >
        메일 설정 저장
      </button>
    </form>
  );
}
