export type GalleryPostFormInput = {
  title?: FormDataEntryValue | string | null;
  imageUrl?: FormDataEntryValue | string | null;
  content?: FormDataEntryValue | string | null;
  isPublished?: FormDataEntryValue | string | boolean | null;
};

export type NormalizedGalleryPostForm = {
  title: string;
  imageUrl: string;
  content: string;
  isPublished: boolean;
};

export type GalleryPostValidationResult =
  | { ok: true; data: NormalizedGalleryPostForm }
  | { ok: false; errors: Record<string, string> };

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isChecked(value: GalleryPostFormInput["isPublished"]) {
  if (value === true) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return value === "on" || value === "true";
}

export function isAllowedGalleryImageSource(imageUrl: string) {
  if (imageUrl.startsWith("/images/") && !imageUrl.includes("..")) {
    return true;
  }

  try {
    const url = new URL(imageUrl);

    return url.protocol === "https:" && url.hostname === "tour.jecheon.go.kr" && url.pathname.startsWith("/tour/");
  } catch {
    return false;
  }
}

export function normalizeGalleryPostForm(input: GalleryPostFormInput): NormalizedGalleryPostForm {
  return {
    title: fieldToString(input.title),
    imageUrl: fieldToString(input.imageUrl),
    content: fieldToString(input.content),
    isPublished: isChecked(input.isPublished),
  };
}

export function validateGalleryPostForm(data: NormalizedGalleryPostForm): GalleryPostValidationResult {
  const errors: Record<string, string> = {};

  if (data.title.length < 2 || data.title.length > 80) {
    errors.title = "제목은 2자 이상 80자 이하로 입력해 주세요.";
  }

  if (!data.imageUrl) {
    errors.imageUrl = "이미지 경로를 입력해 주세요.";
  } else if (!isAllowedGalleryImageSource(data.imageUrl)) {
    errors.imageUrl = "이미지는 /images/ 경로 또는 허용된 제천 관광 이미지 URL만 사용할 수 있습니다.";
  }

  if (data.content.length < 5 || data.content.length > 2000) {
    errors.content = "내용은 5자 이상 2,000자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
