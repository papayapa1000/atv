export function parseLegacyGalleryImageUrls(imageUrl: string) {
  if (!imageUrl.trim().startsWith("[")) {
    return [imageUrl];
  }

  try {
    const parsed = JSON.parse(imageUrl) as unknown;

    if (Array.isArray(parsed) && parsed.every((value) => typeof value === "string")) {
      return parsed.filter(Boolean);
    }
  } catch {
    return [imageUrl];
  }

  return [imageUrl];
}

export function normalizeGalleryImageUrls(imageUrl: string, imageUrls?: string[] | null) {
  return imageUrls?.length ? imageUrls : parseLegacyGalleryImageUrls(imageUrl);
}

export function serializeLegacyGalleryImageUrl(imageUrls: string[]) {
  return imageUrls.length > 1 ? JSON.stringify(imageUrls) : (imageUrls[0] ?? "");
}
