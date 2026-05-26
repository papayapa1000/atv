import Link from "next/link";

const adminNavItems = [
  { label: "예약게시판", href: "/admin/reservations", enabled: true },
  { label: "갤러리", href: "/admin/gallery", enabled: true },
  { label: "동영상", href: "/admin/videos", enabled: true },
  { label: "자랑하기", href: "/admin/showcase", enabled: true },
  { label: "주변 숙박", href: "/admin/stay", enabled: true },
  { label: "설정", href: "/admin/settings", enabled: true },
] as const;

type AdminTopbarProps = {
  active?: "dashboard" | "reservations" | "showcase" | "gallery" | "stay" | "videos" | "settings";
};

export function AdminTopbar({ active = "dashboard" }: AdminTopbarProps) {
  return (
    <header className="border-b border-white/10 bg-deep px-5 py-4 text-foam lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/admin/dashboard" className="text-base font-semibold">
          제천 수상레저 & 청풍 ATV 관리자
        </Link>
        <nav aria-label="관리자 메뉴" className="flex gap-2 overflow-x-auto text-sm font-semibold text-foam/72">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href.split("/").at(-1) ? "page" : undefined}
              className={`spring shrink-0 border px-3 py-2 ${
                active === item.href.split("/").at(-1)
                  ? "border-sun bg-sun text-deep"
                  : "border-white/12 hover:border-foam hover:text-foam"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
