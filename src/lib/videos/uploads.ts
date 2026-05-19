import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const extensionByMimeType: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/x-m4v": ".m4v",
};

const allowedExtensions = new Set([".mp4", ".webm", ".mov", ".m4v"]);

function resolveUploadExtension(file: File) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (allowedExtensions.has(originalExtension)) {
    return originalExtension;
  }

  return extensionByMimeType[file.type] ?? ".mp4";
}

export async function saveUploadedVideo(file: File) {
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "videos");
  await mkdir(uploadDirectory, { recursive: true });

  const extension = resolveUploadExtension(file);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/videos/${fileName}`;
}
