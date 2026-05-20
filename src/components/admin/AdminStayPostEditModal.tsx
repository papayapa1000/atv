"use client";

import { PencilSimple, X } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { updateAdminStayPostAction } from "@/app/admin/actions";
import type { StayPost } from "@/lib/stay/repository";
import { AdminGalleryEditImageFields } from "./AdminGalleryEditImageFields";
import { useBodyScrollLock } from "./useBodyScrollLock";

type AdminStayPostEditModalProps = {
  post: StayPost;
};

export function AdminStayPostEditModal({ post }: AdminStayPostEditModalProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="spring inline-flex items-center gap-2 border border-foreground/14 px-3 py-2 text-sm font-bold text-foreground/70 hover:border-lake hover:text-lake"
      >
        <PencilSimple aria-hidden="true" className="h-4 w-4" weight="bold" />
        수정
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/48 px-4 py-6 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-foreground/14 bg-white p-5 shadow-[0_32px_80px_-44px_rgba(16,34,30,0.55)] sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
              <div>
                <p id={titleId} className="text-xl font-bold text-foreground">
                  숙박 정보 수정
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/58">새 이미지를 첨부하면 기존 이미지를 교체합니다.</p>
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

            <form action={updateAdminStayPostAction} className="mt-5 grid gap-4">
              <input type="hidden" name="id" value={post.id} />
              <label className="block">
                <span className="text-sm font-bold text-foreground">제목</span>
                <input
                  name="title"
                  required
                  defaultValue={post.title}
                  className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-foreground">가격</span>
                <input
                  name="price"
                  required
                  defaultValue={post.price}
                  className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-foreground">본문</span>
                <textarea
                  name="content"
                  rows={7}
                  required
                  defaultValue={post.content}
                  className="mt-2 w-full resize-y border border-foreground/14 bg-white px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
                />
              </label>
              <AdminGalleryEditImageFields imageUrls={post.imageUrls} title={post.title} maxImageFileCount={10} />
              <label className="flex items-start gap-3 border border-foreground/10 bg-surface-muted/52 p-3 text-sm leading-6 text-foreground/70">
                <input type="checkbox" name="isPublished" defaultChecked={post.isPublished} className="mt-1 h-4 w-4 accent-lake" />
                <span>
                  <strong className="block text-foreground">공개 상태</strong>
                  체크를 해제하면 공개 목록에서 숨깁니다.
                </span>
              </label>
              <div className="flex flex-wrap justify-end gap-2 border-t border-foreground/10 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="spring inline-flex items-center justify-center border border-foreground/14 px-4 py-2.5 text-sm font-bold text-foreground/64 hover:border-foreground hover:text-foreground"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="spring inline-flex items-center justify-center gap-2 border border-lake bg-lake px-4 py-2.5 text-sm font-bold text-white hover:border-foreground hover:bg-foreground"
                >
                  <PencilSimple aria-hidden="true" className="h-4 w-4" weight="bold" />
                  수정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
