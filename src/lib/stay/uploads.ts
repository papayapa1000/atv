import "server-only";

import { randomUUID } from "node:crypto";
import { compressUploadedImageForStorage } from "@/lib/images/compression";
import { uploadSupabaseStorageObject } from "@/lib/supabase/storage";

const defaultStayImagesBucket = "stay-images";

function getStayImagesBucket() {
  return process.env.SUPABASE_STAY_IMAGES_BUCKET?.trim() || defaultStayImagesBucket;
}

export async function saveUploadedStayImage(file: File) {
  const image = await compressUploadedImageForStorage(file);
  const fileName = `${Date.now()}-${randomUUID()}${image.extension}`;
  return uploadSupabaseStorageObject({
    bucket: getStayImagesBucket(),
    objectPath: fileName,
    body: image.body,
    contentType: image.contentType,
  });
}

export async function saveUploadedStayImages(files: File[]) {
  return Promise.all(files.map((file) => saveUploadedStayImage(file)));
}
