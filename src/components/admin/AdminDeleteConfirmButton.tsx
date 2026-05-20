"use client";

import { X, Trash } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { useBodyScrollLock } from "./useBodyScrollLock";

type AdminDeleteConfirmButtonProps = {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  title?: string;
  message?: string;
  className?: string;
};

export function AdminDeleteConfirmButton({
  id,
  action,
  label = "삭제",
  title = "삭제 확인",
  message = "정말 이 게시글을 삭제하시겠습니까?",
  className = "spring inline-flex items-center gap-2 border border-sunset/28 px-3 py-2 text-sm font-bold text-sunset hover:bg-sunset hover:text-white",
}: AdminDeleteConfirmButtonProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <Trash aria-hidden="true" className="h-4 w-4" weight="bold" />
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/48 px-4 py-6 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-sm border border-foreground/14 bg-white p-5 shadow-[0_32px_80px_-44px_rgba(16,34,30,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p id={titleId} className="text-lg font-bold text-foreground">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground/62">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="spring inline-flex h-9 w-9 shrink-0 items-center justify-center border border-foreground/12 text-foreground/54 hover:border-foreground hover:text-foreground"
              >
                <X aria-hidden="true" className="h-4 w-4" weight="bold" />
              </button>
            </div>

            <form action={action} className="mt-5 flex flex-wrap justify-end gap-2">
              <input type="hidden" name="id" value={id} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="spring inline-flex items-center justify-center border border-foreground/14 px-4 py-2.5 text-sm font-bold text-foreground/64 hover:border-foreground hover:text-foreground"
              >
                취소
              </button>
              <button
                type="submit"
                className="spring inline-flex items-center justify-center gap-2 border border-sunset bg-sunset px-4 py-2.5 text-sm font-bold text-white hover:border-foreground hover:bg-foreground"
              >
                <Trash aria-hidden="true" className="h-4 w-4" weight="bold" />
                삭제
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
