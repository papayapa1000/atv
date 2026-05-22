"use client";

import { VideoCamera, X } from "@phosphor-icons/react";
import { type ChangeEvent, useId, useRef, useState } from "react";

type AdminVideoFileReplacementFieldProps = {
  currentFileName: string;
};

export function AdminVideoFileReplacementField({ currentFileName }: AdminVideoFileReplacementFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const selectedFileName = selectedFile?.name ?? "";

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.currentTarget.files?.[0] ?? null);
  }

  function clearSelectedFile() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setSelectedFile(null);
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-bold text-foreground">영상 파일</legend>
      <div className="border border-foreground/14 bg-white p-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-lake">등록된 영상 파일</p>
            <p className="mt-1 min-w-0 break-all text-sm font-semibold leading-6 text-foreground/72">
              {currentFileName || "등록된 영상 파일이 없습니다."}
            </p>
          </div>
          <label
            htmlFor={inputId}
            className="spring inline-flex cursor-pointer items-center justify-center gap-2 border border-lake bg-lake px-4 py-2.5 text-sm font-bold text-white hover:border-foreground hover:bg-foreground"
          >
            <VideoCamera aria-hidden="true" className="h-4 w-4" weight="bold" />
            영상 파일 변경
          </label>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          name="videoFile"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
          onChange={onFileSelected}
          className="sr-only"
        />

        {selectedFileName ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-lake/14 bg-lake/5 px-3 py-2">
            <p className="min-w-0 flex-1 break-all text-sm font-semibold leading-6 text-foreground/72">
              <span className="text-lake">새 영상 파일</span> {selectedFileName}
            </p>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="spring inline-flex items-center justify-center gap-2 border border-sunset/28 px-3 py-2 text-sm font-bold text-sunset hover:bg-sunset hover:text-white"
            >
              <X aria-hidden="true" className="h-4 w-4" weight="bold" />
              첨부 취소
            </button>
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
