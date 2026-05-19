"use client";

import { ImageSquare, PaperPlaneTilt, UserCircle } from "@phosphor-icons/react";
import { useActionState } from "react";
import { createShowcaseAction, type ShowcaseActionState } from "@/app/showcase/actions";

const initialShowcaseActionState: ShowcaseActionState = {
  message: "",
  errors: {},
  values: {},
};

function fieldError(state: ShowcaseActionState, name: string) {
  const message = state.errors[name];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-bold text-sunset">{message}</p>;
}

type TextFieldProps = {
  state: ShowcaseActionState;
  name: keyof ShowcaseActionState["values"];
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
};

function TextField({ state, name, label, placeholder, required, autoComplete }: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={state.values[name] ?? ""}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-sun/20"
      />
      {fieldError(state, name)}
    </label>
  );
}

export function ShowcaseWriteForm() {
  const [state, formAction, pending] = useActionState(createShowcaseAction, initialShowcaseActionState);

  return (
    <form action={formAction} className="grid gap-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message ? (
        <div role="alert" className="border border-sunset/30 bg-sun/12 px-4 py-3 text-sm font-bold text-foreground">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-[0.75fr_1.25fr]">
        <TextField state={state} name="authorName" label="작성자" placeholder="홍길동" required autoComplete="name" />
        <TextField state={state} name="title" label="제목" placeholder="청풍호 수상레저 후기" required />
      </div>

      <label className="block">
        <span className="text-sm font-bold text-foreground">내용</span>
        <textarea
          name="content"
          rows={10}
          required
          defaultValue={state.values.content ?? ""}
          placeholder="방문 후기, 이용한 레저, 공유할 URL을 함께 입력해 주세요."
          className="mt-2 w-full resize-y border border-foreground/14 bg-white px-4 py-3 text-base leading-7 text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-sun/20"
        />
        {fieldError(state, "content")}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-foreground">사진 첨부</span>
        <input
          name="imageFiles"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:border-0 file:bg-lake file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-foreground focus:outline-none focus:ring-2 focus:ring-sun/20"
        />
        {fieldError(state, "imageFiles")}
      </label>

      <div className="grid gap-3 border border-foreground/10 bg-surface-muted/62 p-5 text-sm leading-7 text-foreground/68 sm:grid-cols-2">
        <div className="flex gap-3">
          <UserCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-lake" weight="bold" />
          <span>작성자와 제목은 게시판 목록에 표시됩니다.</span>
        </div>
        <div className="flex gap-3">
          <ImageSquare aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-lake" weight="bold" />
          <span>사진은 최대 5장, 장당 8MB 이하만 지원합니다.</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="spring inline-flex items-center justify-center gap-3 border border-sun bg-sun px-6 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-lake hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          <PaperPlaneTilt aria-hidden="true" className="h-4 w-4" weight="bold" />
          {pending ? "저장 중" : "작성완료"}
        </button>
      </div>
    </form>
  );
}
