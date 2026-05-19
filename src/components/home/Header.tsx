"use client";

import { CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site-data";

export function Header() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const activeSubItems = navItems.find((item) => {
    if (!item.subItems) {
      return false;
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  })?.subItems;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest px-3 py-3 text-white shadow-[0_18px_80px_-58px_rgba(7,59,58,0.68)] sm:px-5">
      <div className="spring mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-full border border-white/14 bg-lake/92 px-4 text-white shadow-[0_18px_70px_-52px_rgba(7,59,58,0.82)] backdrop-blur-xl sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span className="font-display text-sm font-bold uppercase tracking-normal sm:text-base">제천 ATV & 수상레저</span>
        </Link>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-6 text-sm font-semibold text-white/78 xl:gap-8 lg:flex">
          {navItems.map((item) =>
            item.subItems ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="spring inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  {item.label}
                  <CaretDown aria-hidden="true" className="h-3.5 w-3.5" weight="bold" />
                </Link>
                <div className="absolute left-1/2 top-full z-50 w-40 -translate-x-1/2 pt-3 opacity-0 pointer-events-none transition duration-200 ease-out group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                  <div className="grid gap-1 rounded-[1.25rem] border border-mist bg-surface p-2 text-sm shadow-[var(--paper-shadow)]">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="spring rounded-full px-3 py-2 text-foreground/70 hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-lake/35"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="spring rounded-full px-2.5 py-2 hover:bg-white/12 hover:text-white">
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <nav aria-label="모바일 주요 메뉴" className="mx-auto mt-2 flex max-w-[1440px] gap-6 overflow-x-auto rounded-full border border-white/14 bg-lake/92 px-4 py-2 text-sm font-semibold text-white/78 backdrop-blur-xl lg:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="spring shrink-0 hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
      {activeSubItems ? (
        <nav aria-label="현재 메뉴 하위 메뉴" className="mx-auto mt-2 flex max-w-[1440px] gap-5 overflow-x-auto rounded-full border border-white/12 bg-forest/94 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur lg:hidden">
          {activeSubItems.map((item) => (
            <Link key={item.href} href={item.href} className="spring shrink-0 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
