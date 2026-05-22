"use client";

import { useState } from "react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site-data";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest px-3 py-3 text-white shadow-[0_18px_80px_-58px_rgba(7,59,58,0.68)] sm:px-5">
      <div className="spring mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-full border border-white/14 bg-lake/92 px-4 text-white shadow-[0_18px_70px_-52px_rgba(7,59,58,0.82)] backdrop-blur-xl sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="font-display whitespace-nowrap text-base font-extrabold tracking-normal text-amber-100 sm:text-xl">제천 수상레저 & 청풍 ATV</span>
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
                <div className="pointer-events-none absolute left-1/2 top-full z-50 w-40 -translate-x-1/2 pt-3 opacity-0 transition duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
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
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-site-menu"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="spring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white hover:bg-white/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:hidden"
        >
          {isMobileMenuOpen ? <X aria-hidden="true" className="h-5 w-5" weight="bold" /> : <List aria-hidden="true" className="h-5 w-5" weight="bold" />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-x-3 top-[4.75rem] z-50 lg:hidden sm:inset-x-5 sm:top-[5.25rem]">
          <nav
            id="mobile-site-menu"
            aria-label="모바일 메뉴"
            className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[1.25rem] border border-white/16 bg-surface p-3 text-foreground shadow-[0_28px_90px_-42px_rgba(7,59,58,0.52)]"
          >
            <div className="grid gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <div key={item.href} className="rounded-2xl border border-mist bg-white p-2">
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`spring flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold ${
                        isActive ? "bg-lake text-white" : "text-foreground hover:bg-surface-muted"
                      }`}
                    >
                      {item.label}
                      {item.subItems ? <CaretDown aria-hidden="true" className="h-3.5 w-3.5" weight="bold" /> : null}
                    </Link>
                    {item.subItems ? (
                      <div className="mt-1 grid gap-1 px-1 pb-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="spring rounded-lg px-3 py-2 text-xs font-semibold text-ink-muted hover:bg-foam hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-lake/35"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
