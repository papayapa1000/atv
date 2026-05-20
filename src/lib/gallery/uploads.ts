import "server-only";

import { randomUUID } from "node:crypto";
import { compressUploadedImageForStorage } from "@/lib/images/compression";
import { uploadSupabaseStorageObject } from "@/lib/supabase/storage";

const defaultGalleryImagesBucket = "gallery-images";

function getGalleryImagesBucket() {
  return process.env.SUPABASE_GALLERY_IMAGES_BUCKET?.trim() || defaultGalleryImagesBucket;
}

export async function saveUploadedGalleryImage(file: File) {
  const image = await compressUploadedImageForStorage(file);
  const fileName = `${Date.now()}-${randomUUID()}${image.extension}`;
  return uploadSupabaseStorageObject({
    bucket: getGalleryImagesBucket(),
    objectPath: fileName,
    body: image.body,
    contentType: image.contentType,
  });
}

export async function saveUploadedGalleryImages(files: File[]) {
  return Promise.all(files.map((file) => saveUploadedGalleryImage(file)));
}
