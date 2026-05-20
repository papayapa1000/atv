export type GalleryPostFormInput = {
  title?: FormDataEntryValue | string | null;
  content?: FormDataEntryValue | string | null;
  imageFiles?: Array<FormDataEntryValue | File | null>;
  isPublished?: FormDataEntryValue | string | boolean | null;
};

export type NormalizedGalleryPostForm = {
  title: string;
  content: string;
  imageFiles: File[];
  isPublished: boolean;
};

export type GalleryPostValidationResult =
  | { ok: true; data: NormalizedGalleryPostForm }
  | { ok: false; errors: Record<string, string> };

export type GalleryPostValidationOptions = {
  requireImages?: boolean;
};

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

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageFileSize = 8 * 1024 * 1024;
const maxImageFileCount = 8;

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function hasImageFile(value: unknown): value is File {
  return isFile(value) && value.size > 0;
}

function hasAllowedImageExtension(fileName: string) {
  const lowerName = fileName.toLowerCase();
  return allowedImageExtensions.some((extension) => lowerName.endsWith(extension));
}

function validateImageFile(file: File) {
  if (file.size > maxImageFileSize) {
    return "이미지 파일은 8MB 이하로 등록해 주세요.";
  }

  if ((file.type && !allowedImageTypes.has(file.type)) || !hasAllowedImageExtension(file.name)) {
    return "이미지 파일은 jpg, png, webp 형식만 등록해 주세요.";
  }

  return "";
}

export function normalizeGalleryPostForm(input: GalleryPostFormInput): NormalizedGalleryPostForm {
  return {
    title: fieldToString(input.title),
    content: fieldToString(input.content),
    imageFiles: (input.imageFiles ?? []).filter(hasImageFile),
    isPublished: isChecked(input.isPublished),
  };
}

export function validateGalleryPostForm(
  data: NormalizedGalleryPostForm,
  options: GalleryPostValidationOptions = {},
): GalleryPostValidationResult {
  const errors: Record<string, string> = {};
  const requireImages = options.requireImages ?? true;

  if (data.title.length < 2 || data.title.length > 80) {
    errors.title = "제목은 2자 이상 80자 이하로 입력해 주세요.";
  }

  if (requireImages && data.imageFiles.length < 1) {
    errors.imageFiles = "이미지를 1장 이상 첨부해 주세요.";
  } else if (data.imageFiles.length > maxImageFileCount) {
    errors.imageFiles = "이미지는 최대 8장까지 첨부할 수 있습니다.";
  }

  for (const file of data.imageFiles) {
    const fileError = validateImageFile(file);
    if (fileError) {
      errors.imageFiles = fileError;
      break;
    }
  }

  if (data.content.length < 5 || data.content.length > 2000) {
    errors.content = "내용은 5자 이상 2,000자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
