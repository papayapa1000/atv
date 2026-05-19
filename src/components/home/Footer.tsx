"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-black px-5 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-[1440px] pt-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-base font-bold">제천 ATV & 수상레저</p>
            <p className="mt-2 text-sm leading-6 text-white/70">충청북도 제천시 금성면 성내리 157</p>
          </div>
          <p className="numeric text-xs text-white/50">© 2026 Jecheon ATV & Water Leisure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
