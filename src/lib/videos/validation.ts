import { extractYouTubeVideoId } from "./youtube";

export const videoSourceTypes = ["youtube", "file"] as const;

export type VideoSourceType = (typeof videoSourceTypes)[number];

export type VideoPostFormInput = {
  title?: FormDataEntryValue | string | null;
  youtubeUrl?: FormDataEntryValue | string | null;
  videoFile?: FormDataEntryValue | File | null;
  uploadedVideoUrl?: FormDataEntryValue | string | null;
  content?: FormDataEntryValue | string | null;
  isPublished?: FormDataEntryValue | string | boolean | null;
};

export type NormalizedVideoPostForm = {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  videoFile: File | null;
  uploadedVideoUrl: string;
  content: string;
  isPublished: boolean;
};

export type ValidatedVideoPostForm = {
  title: string;
  sourceType: VideoSourceType;
  youtubeUrl: string | null;
  youtubeId: string | null;
  videoFile: File | null;
  uploadedVideoUrl: string | null;
  content: string;
  isPublished: boolean;
};

export type VideoPostValidationResult =
  | { ok: true; data: ValidatedVideoPostForm }
  | { ok: false; errors: Record<string, string> };

export type VideoPostValidationOptions = {
  allowMissingSource?: boolean;
};

export type VideoUploadMetadata = {
  name: string;
  type: string;
  size: number;
};

export const allowedVideoExtensions = [".mp4", ".webm", ".mov", ".m4v"];
export const maxVideoFileSize = 250 * 1024 * 1024;

function fieldToString(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isChecked(value: VideoPostFormInput["isPublished"]) {
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

function hasVideoFile(value: unknown): value is File {
  return isFile(value) && value.size > 0;
}

function hasAllowedVideoExtension(fileName: string) {
  const lowerName = fileName.toLowerCase();
  return allowedVideoExtensions.some((extension) => lowerName.endsWith(extension));
}

export function validateVideoUploadMetadata(file: VideoUploadMetadata) {
  if (file.size > maxVideoFileSize) {
    return "영상 파일은 250MB 이하로 등록해 주세요.";
  }

  if (!file.type.startsWith("video/") && !hasAllowedVideoExtension(file.name)) {
    return "영상 파일은 mp4, webm, mov 형식만 등록해 주세요.";
  }

  return "";
}

export function normalizeVideoPostForm(input: VideoPostFormInput): NormalizedVideoPostForm {
  const youtubeUrl = fieldToString(input.youtubeUrl);

  return {
    title: fieldToString(input.title),
    youtubeUrl,
    youtubeId: extractYouTubeVideoId(youtubeUrl),
    videoFile: hasVideoFile(input.videoFile) ? input.videoFile : null,
    uploadedVideoUrl: fieldToString(input.uploadedVideoUrl),
    content: fieldToString(input.content),
    isPublished: isChecked(input.isPublished),
  };
}

export function validateVideoPostForm(
  data: NormalizedVideoPostForm,
  options: VideoPostValidationOptions = {},
): VideoPostValidationResult {
  const errors: Record<string, string> = {};
  const hasYoutube = Boolean(data.youtubeUrl);
  const hasUploadedVideoUrl = Boolean(data.uploadedVideoUrl);
  const hasFile = Boolean(data.videoFile) || hasUploadedVideoUrl;
  const allowMissingSource = options.allowMissingSource ?? false;

  if (data.title.length < 2 || data.title.length > 80) {
    errors.title = "제목은 2자 이상 80자 이하로 입력해 주세요.";
  }

  if (data.content.length < 5 || data.content.length > 2000) {
    errors.content = "내용은 5자 이상 2,000자 이하로 입력해 주세요.";
  }

  if (!hasYoutube && !hasFile && !allowMissingSource) {
    errors.source = "유튜브 링크 또는 영상 파일 중 하나를 등록해 주세요.";
  }

  if (hasYoutube && hasFile) {
    errors.source = "유튜브 링크와 영상 파일은 동시에 등록할 수 없습니다.";
  }

  if (hasYoutube && !data.youtubeId) {
    errors.youtubeUrl = "올바른 유튜브 링크를 입력해 주세요.";
  }

  if (data.videoFile) {
    const fileError = validateVideoUploadMetadata(data.videoFile);
    if (fileError) {
      errors.videoFile = fileError;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      title: data.title,
      sourceType: hasYoutube ? "youtube" : "file",
      youtubeUrl: hasYoutube ? data.youtubeUrl : null,
      youtubeId: hasYoutube ? data.youtubeId : null,
      videoFile: data.videoFile,
      uploadedVideoUrl: hasUploadedVideoUrl ? data.uploadedVideoUrl : null,
      content: data.content,
      isPublished: data.isPublished,
    },
  };
}
