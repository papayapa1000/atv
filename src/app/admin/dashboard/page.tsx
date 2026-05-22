import type { Metadata } from "next";
import Link from "next/link";
import { BellSimple, CalendarCheck, ChatCircleText, HouseLine, ImageSquare, Video } from "@phosphor-icons/react/ssr";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireAdminSession } from "@/lib/admin/session";
import { formatStorageBytes, getSupabaseStorageUsageSummary } from "@/lib/supabase/storage-usage";

export const metadata: Metadata = {
  title: "관리자 대시보드 | 제천 수상레저 & 청풍 ATV",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const menuItems = [
  {
    label: "예약게시판",
    href: "/admin/reservations",
    description: "예약 상태 변경과 관리자 답글을 관리합니다.",
    icon: CalendarCheck,
    enabled: true,
  },
  {
    label: "갤러리",
    href: "/admin/gallery",
    description: "갤러리 상세페이지에 표시할 이미지와 설명을 등록합니다.",
    icon: ImageSquare,
    enabled: true,
  },
  {
    label: "동영상",
    href: "/admin/videos",
    description: "유튜브 링크와 영상 파일을 등록하고 노출 상태를 관리합니다.",
    icon: Video,
    enabled: true,
  },
  {
    label: "자랑하기",
    href: "/admin/showcase",
    description: "방문 후기 게시글과 첨부 사진을 확인하고 삭제합니다.",
    icon: ChatCircleText,
    enabled: true,
  },
  {
    label: "주변 숙박",
    href: "/admin/stay",
    description: "숙박 목록과 상세페이지에 표시할 가격, 이미지, 본문을 등록합니다.",
    icon: HouseLine,
    enabled: true,
  },
  {
    label: "공지사항",
    href: "/admin/notices",
    description: "추후 공지사항 작성과 수정 기능을 연결합니다.",
    icon: BellSimple,
    enabled: false,
  },
] as const;

const storageBucketLabels: Record<string, string> = {
  "gallery-images": "갤러리 게시판 이미지 용량",
  "showcase-images": "자랑하기 게시판 이미지 용량",
  "stay-images": "주변 숙박 이미지 용량",
  "video-files": "동영상 게시판 영상 용량",
};

function getStorageBucketLabel(bucket: string) {
  return storageBucketLabels[bucket] ?? `기타 저장소(${bucket})`;
}

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const storageUsage = await getSupabaseStorageUsageSummary();

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="dashboard" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">Dashboard</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">관리자 대시보드</h1>
          <section className="mt-8 border border-foreground/12 bg-surface p-5 sm:p-6" aria-labelledby="storage-usage-title">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p id="storage-usage-title" className="text-sm font-bold uppercase text-lake">
                  Supabase Storage
                </p>
                <h2 className="mt-2 text-2xl font-semibold">스토리지 사용 가능 용량</h2>
              </div>
              {storageUsage.ok ? (
                <div className="text-left lg:text-right">
                  <p className="numeric text-3xl font-black text-foreground">{formatStorageBytes(storageUsage.availableBytes)}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground/58">
                    사용 중 {formatStorageBytes(storageUsage.usedBytes)} / 전체 {formatStorageBytes(storageUsage.quotaBytes)}
                  </p>
                </div>
              ) : null}
            </div>

            {storageUsage.ok ? (
              <div className="mt-5">
                <div className="h-3 overflow-hidden bg-mist" role="meter" aria-label="Supabase Storage 사용량" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(storageUsage.usagePercent)}>
                  <div className="h-full bg-lake" style={{ width: `${storageUsage.usagePercent}%` }} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {storageUsage.buckets.map((bucket) => (
                    <span key={bucket.bucket} className="inline-flex items-center gap-2 border border-foreground/10 bg-surface-muted px-3 py-1.5 text-xs font-bold text-foreground/62">
                      <span>{getStorageBucketLabel(bucket.bucket)}</span>
                      <span className="numeric text-foreground/78">{formatStorageBytes(bucket.usedBytes)} · {bucket.objectCount}개</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 border border-sunset/20 bg-surface-muted px-4 py-3 text-sm font-bold text-sunset">
                스토리지 사용량을 확인하지 못했습니다. {storageUsage.message}
              </p>
            )}
          </section>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <article className={`h-full border border-foreground/12 bg-surface p-6 ${item.enabled ? "spring hover:-translate-y-1 hover:border-lake" : "opacity-58"}`}>
                  <Icon aria-hidden="true" className="h-7 w-7 text-lake" weight="bold" />
                  <h2 className="mt-5 text-xl font-semibold">{item.label}</h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/58">{item.description}</p>
                </article>
              );

              return item.enabled ? (
                <Link key={item.href} href={item.href}>
                  {content}
                </Link>
              ) : (
                <div key={item.href}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
