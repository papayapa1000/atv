import "server-only";

import path from "node:path";
import { randomUUID } from "node:crypto";
import { uploadSupabaseStorageObject } from "@/lib/supabase/storage";

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

function resolveUploadExtension(file: File) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (allowedExtensions.has(originalExtension)) {
    return originalExtension;
  }

  return extensionByMimeType[file.type] ?? ".mp4";
}

export async function saveUploadedVideo(file: File) {
  const extension = resolveUploadExtension(file);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  return uploadSupabaseStorageObject({
    bucket: getVideoFilesBucket(),
    objectPath: fileName,
    body: bytes,
    contentType: file.type || "application/octet-stream",
  });
}
