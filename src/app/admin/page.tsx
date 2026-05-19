import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "관리자 로그인 | 제천 ATV & 수상레저",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="depth-mint min-h-screen bg-foam px-5 py-20 text-foreground lg:px-8">
      <section className="mx-auto grid min-h-[70vh] max-w-md content-center">
        <div className="border border-foreground/12 bg-surface p-6 sm:p-8">
          <p className="inline-flex border-b border-foreground/18 pb-2 text-xs font-semibold uppercase text-lake">Admin</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight">관리자 페이지</h1>
          <p className="mt-4 text-sm leading-7 text-foreground/58">관리자 전용 화면입니다.</p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
