"use client";

import { ImageSquare, X } from "@phosphor-icons/react";
import { useId, useState } from "react";

type ImageFileSlot = {
  id: string;
  fileName: string;
};

type AdminGalleryImageFileFieldsProps = {
  required?: boolean;
  label?: string;
  maxImageFileCount?: number;
};

function createSlot(id = crypto.randomUUID()): ImageFileSlot {
  return {
    id,
    fileName: "",
  };
}

export function AdminGalleryImageFileFields({
  required = false,
  label = "첨부 이미지",
  maxImageFileCount = 8,
}: AdminGalleryImageFileFieldsProps) {
  const fieldId = useId();
  const [slots, setSlots] = useState<ImageFileSlot[]>([createSlot("initial")]);

  function addEmptySlot(nextSlots: ImageFileSlot[]) {
    const selectedCount = nextSlots.filter((slot) => slot.fileName).length;
    const hasEmptySlot = nextSlots.some((slot) => !slot.fileName);

    if (selectedCount < maxImageFileCount && !hasEmptySlot) {
      return [...nextSlots, createSlot()];
    }

    return nextSlots.length > 0 ? nextSlots : [createSlot()];
  }

  function handleFileChange(slotId: string, fileName: string) {
    setSlots((currentSlots) =>
      addEmptySlot(currentSlots.map((slot) => (slot.id === slotId ? { ...slot, fileName } : slot))),
    );
  }

  function removeSlot(slotId: string) {
    setSlots((currentSlots) => addEmptySlot(currentSlots.filter((slot) => slot.id !== slotId)));
  }

  const selectedCount = slots.filter((slot) => slot.fileName).length;

  if (maxImageFileCount <= 0) {
    return (
      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-foreground">{label}</legend>
        <p className="border border-foreground/10 bg-surface-muted/52 px-3 py-2 text-sm font-semibold leading-6 text-foreground/58">
          첨부 가능한 이미지 수를 모두 사용했습니다.
        </p>
      </fieldset>
    );
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-bold text-foreground">{label}</legend>
      <div className="grid gap-3">
        {slots.map((slot, index) => {
          const inputId = `${fieldId}-${slot.id}`;
          const isRequired = required && selectedCount === 0 && !slot.fileName && index === 0;

          return (
            <div key={slot.id} className="border border-foreground/14 bg-white p-3">
              <div className="grid gap-3">
                <p className="min-w-0 break-all border border-foreground/8 bg-surface-muted/52 px-3 py-2 text-sm font-semibold leading-6 text-foreground/62">
                  {slot.fileName || `이미지 ${index + 1}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  <label
                    htmlFor={inputId}
                    className="spring inline-flex cursor-pointer items-center justify-center gap-2 border border-lake bg-lake px-4 py-2.5 text-sm font-bold text-white hover:border-foreground hover:bg-foreground"
                  >
                    <ImageSquare aria-hidden="true" className="h-4 w-4" weight="bold" />
                    이미지 선택
                  </label>
                  <input
                    id={inputId}
                    name="imageFiles"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required={isRequired}
                    onChange={(event) => handleFileChange(slot.id, event.currentTarget.files?.[0]?.name ?? "")}
                    className="sr-only"
                  />
                  {slot.fileName ? (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.id)}
                    className="spring inline-flex w-fit items-center justify-center gap-2 border border-sunset/28 px-3 py-2 text-sm font-bold text-sunset hover:bg-sunset hover:text-white"
                  >
                    <X aria-hidden="true" className="h-4 w-4" weight="bold" />
                    첨부 취소
                  </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs font-semibold text-foreground/50">최대 {maxImageFileCount}장까지 한 장씩 추가할 수 있습니다.</p>
    </fieldset>
  );
}
