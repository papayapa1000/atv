import type { Metadata } from "next";
import Link from "next/link";
import { BellSimple, CalendarCheck, ChatCircleText, HouseLine, ImageSquare, Video } from "@phosphor-icons/react/ssr";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "관리자 대시보드 | 제천 ATV & 수상레저",
  robots: {
    index: false,
    follow: false,
  },
};

const menuItems = [
  {
    label: "공지사항",
    href: "/admin/notices",
    description: "추후 공지사항 작성과 수정 기능을 연결합니다.",
    icon: BellSimple,
    enabled: false,
  },
  {
    label: "예약게시판",
    href: "/admin/reservations",
    description: "예약 상태 변경과 관리자 답글을 관리합니다.",
    icon: CalendarCheck,
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
    label: "갤러리",
    href: "/admin/gallery",
    description: "갤러리 상세페이지에 표시할 이미지와 설명을 등록합니다.",
    icon: ImageSquare,
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
    label: "동영상",
    href: "/admin/videos",
    description: "유튜브 링크와 영상 파일을 등록하고 노출 상태를 관리합니다.",
    icon: Video,
    enabled: true,
  },
] as const;

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <main className="depth-mint min-h-screen bg-foam text-foreground">
      <AdminTopbar active="dashboard" />
      <section className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">Dashboard</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">관리자 대시보드</h1>
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
