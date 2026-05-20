import "server-only";

import { randomUUID } from "node:crypto";
import { compressUploadedImageForStorage } from "@/lib/images/compression";
import { uploadSupabaseStorageObject } from "@/lib/supabase/storage";

const defaultShowcaseImagesBucket = "showcase-images";

function getShowcaseImagesBucket() {
  return process.env.SUPABASE_SHOWCASE_IMAGES_BUCKET || defaultShowcaseImagesBucket;
}

export async function saveUploadedShowcaseImage(file: File) {
  const image = await compressUploadedImageForStorage(file);
  const fileName = `${Date.now()}-${randomUUID()}${image.extension}`;
  return uploadSupabaseStorageObject({
    bucket: getShowcaseImagesBucket(),
    objectPath: fileName,
    body: image.body,
    contentType: image.contentType,
  });
}

export async function saveUploadedShowcaseImages(files: File[]) {
  return Promise.all(files.map((file) => saveUploadedShowcaseImage(file)));
}
