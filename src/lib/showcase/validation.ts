export type ShowcasePostFormInput = {
  authorName?: FormDataEntryValue | string | null;
  title?: FormDataEntryValue | string | null;
  content?: FormDataEntryValue | string | null;
  linkUrl?: FormDataEntryValue | string | null;
  imageFiles?: Array<FormDataEntryValue | File | null>;
};

export type NormalizedShowcasePostForm = {
  authorName: string;
  title: string;
  content: string;
  linkUrl: string;
  imageFiles: File[];
};

export type ShowcasePostValidationResult =
  | { ok: true; data: NormalizedShowcasePostForm }
  | { ok: false; errors: Record<string, string> };

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const maxImageFileSize = 8 * 1024 * 1024;
const maxImageFileCount = 5;

export type ShowcasePageMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  offset: number;
};

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
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
    return "사진 파일은 8MB 이하로 등록해 주세요.";
  }

  if (!file.type.startsWith("image/") && !hasAllowedImageExtension(file.name)) {
    return "사진 파일은 jpg, png, webp 형식만 등록해 주세요.";
  }

  return "";
}

export function isAllowedShowcaseLink(linkUrl: string) {
  if (!linkUrl) {
    return true;
  }

  try {
    const url = new URL(linkUrl);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeShowcasePage(rawPage: string | number | null | undefined, totalCount: number, pageSize = 12): ShowcasePageMeta {
  const safePageSize = Math.min(Math.max(pageSize, 1), 24);
  const safeTotalCount = Math.max(totalCount, 0);
  const totalPages = Math.max(Math.ceil(safeTotalCount / safePageSize), 1);
  const parsedPage = typeof rawPage === "number" ? rawPage : Number.parseInt(String(rawPage ?? "1"), 10);
  const page = Number.isInteger(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;

  return {
    page,
    pageSize: safePageSize,
    totalCount: safeTotalCount,
    totalPages,
    offset: (page - 1) * safePageSize,
  };
}

export function normalizeShowcasePostForm(input: ShowcasePostFormInput): NormalizedShowcasePostForm {
  return {
    authorName: fieldToString(input.authorName),
    title: fieldToString(input.title),
    content: fieldToString(input.content),
    linkUrl: fieldToString(input.linkUrl),
    imageFiles: (input.imageFiles ?? []).filter(hasImageFile),
  };
}

export function validateShowcasePostForm(data: NormalizedShowcasePostForm): ShowcasePostValidationResult {
  const errors: Record<string, string> = {};

  if (data.authorName.length < 2 || data.authorName.length > 30) {
    errors.authorName = "작성자명은 2자 이상 30자 이하로 입력해 주세요.";
  }

  if (data.title.length < 2 || data.title.length > 80) {
    errors.title = "제목은 2자 이상 80자 이하로 입력해 주세요.";
  }

  if (data.content.length < 5 || data.content.length > 2000) {
    errors.content = "내용은 5자 이상 2,000자 이하로 입력해 주세요.";
  }

  if (data.linkUrl.length > 500) {
    errors.linkUrl = "링크는 500자 이하로 입력해 주세요.";
  } else if (data.linkUrl && !isAllowedShowcaseLink(data.linkUrl)) {
    errors.linkUrl = "링크는 http 또는 https 주소만 등록할 수 있습니다.";
  }

  if (data.imageFiles.length > maxImageFileCount) {
    errors.imageFiles = "사진은 최대 5장까지 첨부할 수 있습니다.";
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
