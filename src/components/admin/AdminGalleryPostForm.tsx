"use client";

import { ImageSquare, PaperPlaneTilt } from "@phosphor-icons/react";
import { useActionState } from "react";
import { createAdminGalleryPostAction, type AdminGalleryActionState } from "@/app/admin/actions";

const initialGalleryActionState: AdminGalleryActionState = {
  message: "",
  errors: {},
  values: {
    isPublished: "on",
  },
};

function fieldError(state: AdminGalleryActionState, name: string) {
  const message = state.errors[name];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-bold text-sunset">{message}</p>;
}

type TextFieldProps = {
  state: AdminGalleryActionState;
  name: "title" | "imageUrl";
  label: string;
  placeholder?: string;
  required?: boolean;
};

function TextField({ state, name, label, placeholder, required }: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={state.values[name] ?? ""}
        placeholder={placeholder}
        className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
      />
      {fieldError(state, name)}
    </label>
  );
}

export function AdminGalleryPostForm() {
  const [state, formAction, pending] = useActionState(createAdminGalleryPostAction, initialGalleryActionState);

  return (
    <form action={formAction} className="grid gap-6">
      {state.message ? (
        <div role="alert" className="border border-sunset/25 bg-sun/12 px-4 py-3 text-sm font-bold text-foreground">
          {state.message}
        </div>
      ) : null}

      <TextField state={state} name="title" label="제목" placeholder="청풍호 석양 아래 모터보트" required />
      <TextField state={state} name="imageUrl" label="이미지 경로" placeholder="/images/hero-sunset-boat.webp" required />

      <label className="block">
        <span className="text-sm font-bold text-foreground">내용</span>
        <textarea
          name="content"
          rows={9}
          required
          defaultValue={state.values.content ?? ""}
          placeholder="상세페이지에 표시할 설명을 입력하세요."
          className="mt-2 w-full resize-y border border-foreground/14 bg-white px-4 py-3 text-base leading-7 text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
        />
        {fieldError(state, "content")}
      </label>

      <label className="flex items-start gap-3 border border-foreground/10 bg-surface-muted/62 p-4 text-sm leading-6 text-foreground/70">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={(state.values.isPublished ?? "on") === "on"}
          className="mt-1 h-4 w-4 accent-lake"
        />
        <span>
          <strong className="block text-foreground">공개 상태로 등록</strong>
          체크를 해제하면 관리자 화면에는 남지만 갤러리에는 노출되지 않습니다.
        </span>
      </label>

      <div className="border border-lake/14 bg-foam/72 p-4 text-sm leading-7 text-foreground/64">
        <div className="flex gap-3">
          <ImageSquare aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-lake" weight="bold" />
          <p>현재는 public/images 안의 이미지 경로를 등록합니다. 예: /images/motorboat.webp</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="spring inline-flex items-center justify-center gap-3 border border-sun bg-sun px-6 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-lake disabled:cursor-not-allowed disabled:opacity-55"
      >
        <PaperPlaneTilt aria-hidden="true" className="h-4 w-4" weight="bold" />
        {pending ? "등록 중" : "갤러리 등록"}
      </button>
    </form>
  );
}
