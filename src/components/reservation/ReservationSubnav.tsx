import Link from "next/link";

const reservationNavItems = [
  { key: "board", label: "예약게시판", href: "/reservation/board" },
  { key: "write", label: "예약글쓰기", href: "/reservation/write" },
  { key: "guide", label: "예약안내", href: "/reservation" },
] as const;

type ReservationSubnavProps = {
  active: (typeof reservationNavItems)[number]["key"];
};

export function ReservationSubnav({ active }: ReservationSubnavProps) {
  return (
    <nav aria-label="예약하기 하위 메뉴" className="border-b border-foreground/10 bg-surface px-5 py-4 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto">
        {reservationNavItems.map((item) => {
          const isActive = item.key === active;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`spring shrink-0 border px-4 py-2.5 text-sm font-bold ${
                isActive
                  ? "border-lake bg-lake text-white"
                  : "border-foreground/12 bg-surface text-foreground/68 hover:border-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
