"use client";

import { PaperPlaneTilt, VideoCamera } from "@phosphor-icons/react";
import { useActionState } from "react";
import { createAdminVideoPostAction, type AdminVideoActionState } from "@/app/admin/actions";

const initialVideoActionState: AdminVideoActionState = {
  message: "",
  errors: {},
  values: {
    isPublished: "on",
  },
};

function fieldError(state: AdminVideoActionState, name: string) {
  const message = state.errors[name];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-bold text-sunset">{message}</p>;
}

type TextFieldProps = {
  state: AdminVideoActionState;
  name: "title" | "youtubeUrl";
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

export function AdminVideoPostForm() {
  const [state, formAction, pending] = useActionState(createAdminVideoPostAction, initialVideoActionState);

  return (
    <form action={formAction} className="grid gap-6">
      {state.message ? (
        <div role="alert" className="border border-sunset/25 bg-sun/12 px-4 py-3 text-sm font-bold text-foreground">
          {state.message}
        </div>
      ) : null}

      <TextField state={state} name="title" label="제목" placeholder="청풍호 석양 수상스키 영상" required />
      <TextField state={state} name="youtubeUrl" label="유튜브 링크" placeholder="https://www.youtube.com/watch?v=..." />

      <label className="block">
        <span className="text-sm font-bold text-foreground">영상 파일 첨부</span>
        <input
          name="videoFile"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
          className="mt-2 w-full border border-foreground/14 bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:border-0 file:bg-lake file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/16"
        />
        {fieldError(state, "videoFile")}
        {fieldError(state, "source")}
      </label>

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
          체크를 해제하면 관리자 화면에는 남지만 동영상 목록에는 노출되지 않습니다.
        </span>
      </label>

      <div className="border border-lake/14 bg-foam/72 p-4 text-sm leading-7 text-foreground/64">
        <div className="flex gap-3">
          <VideoCamera aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-lake" weight="bold" />
          <p>유튜브 링크를 넣으면 유튜브 썸네일을 사용하고, 영상 파일을 첨부하면 파일의 첫 프레임을 썸네일처럼 표시합니다.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="spring inline-flex items-center justify-center gap-3 border border-sun bg-sun px-6 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
      >
        <PaperPlaneTilt aria-hidden="true" className="h-4 w-4" weight="bold" />
        {pending ? "등록 중" : "동영상 등록"}
      </button>
    </form>
  );
}
