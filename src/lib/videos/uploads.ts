import "server-only";

import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  createSupabaseStorageSignedUpload,
  parseSupabasePublicStorageUrl,
  uploadSupabaseStorageObject,
} from "@/lib/supabase/storage";
import type { VideoUploadMetadata } from "./validation";

const extensionByMimeType: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/x-m4v": ".m4v",
};

const allowedExtensions = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const defaultVideoFilesBucket = "video-files";

function getVideoFilesBucket() {
  return process.env.SUPABASE_VIDEO_FILES_BUCKET?.trim() || defaultVideoFilesBucket;
}

function resolveUploadExtension(file: VideoUploadMetadata) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (allowedExtensions.has(originalExtension)) {
    return originalExtension;
  }

  return extensionByMimeType[file.type] ?? ".mp4";
}

function createVideoObjectPath(file: VideoUploadMetadata) {
  return `${Date.now()}-${randomUUID()}${resolveUploadExtension(file)}`;
}

export async function createSignedVideoUpload(file: VideoUploadMetadata) {
  return createSupabaseStorageSignedUpload({
    bucket: getVideoFilesBucket(),
    objectPath: createVideoObjectPath(file),
  });
}

export function isManagedUploadedVideoUrl(videoUrl: string) {
  const objectRef = parseSupabasePublicStorageUrl(videoUrl);

  if (!objectRef || objectRef.bucket !== getVideoFilesBucket()) {
    return false;
  }

  return allowedExtensions.has(path.extname(objectRef.objectPath).toLowerCase());
}

export async function saveUploadedVideo(file: File) {
  const fileName = createVideoObjectPath(file);
  const bytes = Buffer.from(await file.arrayBuffer());
  return uploadSupabaseStorageObject({
    bucket: getVideoFilesBucket(),
    objectPath: fileName,
    body: bytes,
    contentType: file.type || "application/octet-stream",
  });
}
