"use client";

import Image from "next/image";
import { ImageSquare, Trash } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { AdminGalleryImageFileFields } from "./AdminGalleryImageFileFields";

type ExistingImage = {
  id: string;
  url: string;
  replacementFileName: string;
};

type AdminGalleryEditImageFieldsProps = {
  imageUrls: string[];
  title: string;
  maxImageFileCount?: number;
};

const defaultMaxGalleryImageCount = 8;

export function AdminGalleryEditImageFields({
  imageUrls,
  title,
  maxImageFileCount = defaultMaxGalleryImageCount,
}: AdminGalleryEditImageFieldsProps) {
  const fieldId = useId();
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    imageUrls.map((url, index) => ({
      id: `existing-${index}`,
      url,
      replacementFileName: "",
    })),
  );
  const remainingSlots = Math.max(maxImageFileCount - existingImages.length, 0);

  function removeExistingImage(id: string) {
    setExistingImages((currentImages) => currentImages.filter((image) => image.id !== id));
  }

  function setReplacementFileName(id: string, fileName: string) {
    setExistingImages((currentImages) =>
      currentImages.map((image) => (image.id === id ? { ...image, replacementFileName: fileName } : image)),
    );
  }

  return (
    <div className="grid gap-4">
      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">기존 이미지</h3>
          <span className="numeric text-xs font-bold text-foreground/48">{existingImages.length}장 유지</span>
        </div>

        {existingImages.length > 0 ? (
          <div className="grid gap-3">
            {existingImages.map((image, index) => {
              const inputId = `${fieldId}-${image.id}`;

              return (
                <article key={image.id} className="grid gap-3 border border-foreground/12 bg-white p-3 sm:grid-cols-[7.5rem_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                    <Image src={image.url} alt={`${title} 기존 이미지 ${index + 1}`} fill sizes="120px" className="object-cover" />
                  </div>
                  <div className="grid min-w-0 gap-3">
                    <input type="hidden" name="existingImageUrls" value={image.url} />
                    <p className="text-sm font-bold leading-6 text-foreground/68">기존 이미지 {index + 1}</p>
                    {image.replacementFileName ? (
                      <p className="min-w-0 break-all border border-lake/16 bg-lake/8 px-3 py-2 text-sm font-bold leading-6 text-lake">
                        변경 파일: {image.replacementFileName}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor={inputId}
                        className="spring inline-flex cursor-pointer items-center justify-center gap-2 border border-lake px-3 py-2 text-sm font-bold text-lake hover:bg-lake hover:text-white"
                      >
                        <ImageSquare aria-hidden="true" className="h-4 w-4" weight="bold" />
                        이미지 변경
                      </label>
                      <input
                        id={inputId}
                        name="replacementImageFiles"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => setReplacementFileName(image.id, event.currentTarget.files?.[0]?.name ?? "")}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="spring inline-flex items-center justify-center gap-2 border border-sunset/28 px-3 py-2 text-sm font-bold text-sunset hover:bg-sunset hover:text-white"
                      >
                        <Trash aria-hidden="true" className="h-4 w-4" weight="bold" />
                        기존 이미지 삭제
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="border border-foreground/10 bg-surface-muted/52 px-3 py-2 text-sm font-semibold leading-6 text-foreground/58">
            유지할 기존 이미지가 없습니다. 새 이미지를 1장 이상 추가해 주세요.
          </p>
        )}
      </section>

      <AdminGalleryImageFileFields
        key={remainingSlots}
        label="새 이미지 추가"
        required={existingImages.length === 0}
        maxImageFileCount={remainingSlots}
      />
    </div>
  );
}
