"use client";

import { businessInfo, phoneHref, phoneNumber } from "@/lib/site-data";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const businessRows = [
    ["대표", businessInfo.representative],
    ["사업자등록번호", businessInfo.registrationNumber],
    ["대표전화", phoneNumber],
    ["주소", businessInfo.address],
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-black px-5 py-4 text-white lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="font-display text-base font-bold">{businessInfo.name}</p>
            <dl aria-label="사업자 정보" className="mt-3 grid gap-y-1 text-xs leading-5 text-white/70 sm:text-sm">
              {businessRows.map(([label, value]) => (
                <div key={label} className="flex min-w-0 flex-wrap gap-x-2">
                  <dt className="font-semibold text-white/85">{label}</dt>
                  <dd className={label === "대표전화" ? "numeric" : "break-keep"}>{label === "대표전화" ? <a className="hover:text-white" href={phoneHref}>{value}</a> : value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="numeric text-xs leading-5 text-white/50">© 2026 Jecheon Water Leisure & Cheongpung ATV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
