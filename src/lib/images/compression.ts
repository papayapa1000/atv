import "server-only";

import sharp from "sharp";

const compressedImageExtension = ".webp";
const imageCompressionMaxDimension = 1920;
const imageCompressionMaxPixels = 40_000_000;
const imageCompressionQuality = 82;

export type CompressedStorageImage = {
  bytes: Buffer;
  body: Blob;
  contentType: "image/webp";
  extension: typeof compressedImageExtension;
};

export async function compressUploadedImageForStorage(file: File): Promise<CompressedStorageImage> {
  const sourceBytes = Buffer.from(await file.arrayBuffer());
  const bytes = await sharp(sourceBytes, { limitInputPixels: imageCompressionMaxPixels })
    .rotate()
    .resize({
      width: imageCompressionMaxDimension,
      height: imageCompressionMaxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: imageCompressionQuality, effort: 4 })
    .toBuffer();

  return {
    bytes,
    body: new Blob([new Uint8Array(bytes)], { type: "image/webp" }),
    contentType: "image/webp",
    extension: compressedImageExtension,
  };
}
