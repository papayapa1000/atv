"use client";

import { LockKey, SignIn } from "@phosphor-icons/react";
import { useActionState } from "react";
import { loginAdminAction, type AdminLoginState } from "@/app/admin/actions";

const initialState: AdminLoginState = {
  message: "",
};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      {state.message ? (
        <div role="alert" className="border border-sunset/30 bg-sun/14 px-4 py-3 text-sm font-semibold text-sunset">
          {state.message}
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold text-foreground">관리자 패스워드</span>
        <span className="mt-2 grid grid-cols-[2.75rem_1fr] border border-foreground/14 bg-white">
          <span className="flex items-center justify-center border-r border-foreground/10 text-lake">
            <LockKey aria-hidden="true" className="h-5 w-5" weight="bold" />
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3.5 text-base text-foreground outline-none"
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="spring inline-flex items-center justify-center gap-3 bg-sun px-5 py-3.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-sunset hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
      >
        <SignIn aria-hidden="true" className="h-4 w-4" weight="bold" />
        {pending ? "확인 중" : "관리자 로그인"}
      </button>
    </form>
  );
}
