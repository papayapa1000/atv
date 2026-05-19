import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function resolveUploadExtension(file: File) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (allowedExtensions.has(originalExtension)) {
    return originalExtension;
  }

  return extensionByMimeType[file.type] ?? ".jpg";
}

export async function saveUploadedStayImage(file: File) {
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "stay");
  await mkdir(uploadDirectory, { recursive: true });

  const extension = resolveUploadExtension(file);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/stay/${fileName}`;
}

export async function saveUploadedStayImages(files: File[]) {
  return Promise.all(files.map((file) => saveUploadedStayImage(file)));
}
