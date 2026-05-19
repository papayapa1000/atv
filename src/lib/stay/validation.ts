export type StayPostFormInput = {
  title?: FormDataEntryValue | string | null;
  price?: FormDataEntryValue | string | null;
  content?: FormDataEntryValue | string | null;
  isPublished?: FormDataEntryValue | string | boolean | null;
  imageFiles?: Array<FormDataEntryValue | File | null>;
};

export type NormalizedStayPostForm = {
  title: string;
  price: string;
  content: string;
  isPublished: boolean;
  imageFiles: File[];
};

export type StayPostValidationResult =
  | { ok: true; data: NormalizedStayPostForm }
  | { ok: false; errors: Record<string, string> };

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageFileSize = 8 * 1024 * 1024;
const maxImageFileCount = 10;

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isChecked(value: StayPostFormInput["isPublished"]) {
  if (value === true) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return value === "on" || value === "true";
}

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

  if (!allowedImageMimeTypes.has(file.type) && !hasAllowedImageExtension(file.name)) {
    return "이미지는 jpg, png, webp 형식만 등록할 수 있습니다.";
  }

  return "";
}

export function normalizeStayPostForm(input: StayPostFormInput): NormalizedStayPostForm {
  return {
    title: fieldToString(input.title),
    price: fieldToString(input.price),
    content: fieldToString(input.content),
    isPublished: isChecked(input.isPublished),
    imageFiles: (input.imageFiles ?? []).filter(hasImageFile),
  };
}

export function validateStayPostForm(data: NormalizedStayPostForm): StayPostValidationResult {
  const errors: Record<string, string> = {};

  if (data.title.length < 2 || data.title.length > 80) {
    errors.title = "제목은 2자 이상 80자 이하로 입력해 주세요.";
  }

  if (data.price.length < 1 || data.price.length > 80) {
    errors.price = "가격은 1자 이상 80자 이하로 입력해 주세요.";
  }

  if (data.content.length < 5 || data.content.length > 4000) {
    errors.content = "본문은 5자 이상 4,000자 이하로 입력해 주세요.";
  }

  if (data.imageFiles.length < 1) {
    errors.imageFiles = "숙박 이미지를 1장 이상 첨부해 주세요.";
  } else if (data.imageFiles.length > maxImageFileCount) {
    errors.imageFiles = "이미지는 최대 10장까지 첨부할 수 있습니다.";
  }

  for (const file of data.imageFiles) {
    const fileError = validateImageFile(file);
    if (fileError) {
      errors.imageFiles = fileError;
      break;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
