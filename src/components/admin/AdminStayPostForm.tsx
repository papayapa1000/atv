"use client";

import { ImageSquare, PaperPlaneTilt } from "@phosphor-icons/react";
import { useActionState } from "react";
import { createAdminStayPostAction, type AdminStayActionState } from "@/app/admin/actions";

const initialStayActionState: AdminStayActionState = {
  message: "",
  errors: {},
  values: {
    isPublished: "on",
  },
};

function fieldError(state: AdminStayActionState, name: string) {
  const message = state.errors[name];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-bold text-sunset">{message}</p>;
}

type TextFieldProps = {
  state: AdminStayActionState;
  name: "title" | "price";
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

export function AdminStayPostForm() {
  const [state, formAction, pending] = useActionState(createAdminStayPostAction, initialStayActionState);

  return (
    <form action={formAction} className="grid gap-6">
      {state.message ? (
        <div role="alert" className="border border-sunset/25 bg-sun/12 px-4 py-3 text-sm font-bold text-foreground">
          {state.message}
        </div>
      ) : null}

      <TextField state={state} name="title" label="제목" placeholder="청풍호 전망 펜션" required />
      <TextField state={state} name="price" label="가격" placeholder="1박 120,000원부터" required />

      <label className="block">
        <span className="text-sm font-bold text-foreground">본문</span>
        <textarea
          name="content"
          rows={10}
          required
          defaultValue={state.values.content ?? ""}
          placeholder="객실 설명, 예약 안내, 홈페이지 URL 등을 입력하세요."
          className="mt-2 w-full resize-y border border-foreground/14 bg-white px-4 py-3 text-base leading-7 text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake/16"
        />
        {fieldError(state, "content")}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-foreground">첨부 이미지</span>
        <input
          name="imageFiles"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:border-0 file:bg-lake file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/16"
        />
        {fieldError(state, "imageFiles")}
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
          체크를 해제하면 관리자 화면에는 남고 공개 숙박 목록에는 표시되지 않습니다.
        </span>
      </label>

      <div className="border border-lake/14 bg-foam/72 p-4 text-sm leading-7 text-foreground/64">
        <div className="flex gap-3">
          <ImageSquare aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-lake" weight="bold" />
          <p>이미지는 최대 10장, 파일당 8MB 이하로 등록할 수 있습니다. 본문에 URL을 입력하면 상세페이지에서 링크로 표시됩니다.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="spring inline-flex items-center justify-center gap-3 border border-sun bg-sun px-6 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-lake disabled:cursor-not-allowed disabled:opacity-55"
      >
        <PaperPlaneTilt aria-hidden="true" className="h-4 w-4" weight="bold" />
        {pending ? "등록 중" : "숙박 정보 등록"}
      </button>
    </form>
  );
}
