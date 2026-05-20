import "server-only";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { deleteSupabaseStorageObjects, parseSupabasePublicStorageUrl, type SupabaseStorageObjectRef } from "./storage";

type LocalUploadTarget = {
  prefix: string;
  type: "gallery" | "showcase" | "stay" | "videos";
};

const localUploadTargets: LocalUploadTarget[] = [
  { prefix: "/uploads/gallery/", type: "gallery" },
  { prefix: "/uploads/showcase/", type: "showcase" },
  { prefix: "/uploads/stay/", type: "stay" },
  { prefix: "/uploads/videos/", type: "videos" },
];

function normalizeAssetPath(assetUrl: string) {
  try {
    return new URL(assetUrl, "http://localhost").pathname;
  } catch {
    return assetUrl;
  }
}

function resolveLocalUploadFilePath(assetUrl: string) {
  const pathname = normalizeAssetPath(assetUrl);
  const target = localUploadTargets.find((uploadTarget) => pathname.startsWith(uploadTarget.prefix));

  if (!target) {
    return null;
  }

  const fileName = pathname.slice(target.prefix.length);
  const safeFileName = path.basename(fileName);

  if (!safeFileName || safeFileName !== fileName) {
    return null;
  }

  if (target.type === "gallery") {
    return path.join(process.cwd(), "public", "uploads", "gallery", safeFileName);
  }

  if (target.type === "showcase") {
    return path.join(process.cwd(), "public", "uploads", "showcase", safeFileName);
  }

  if (target.type === "stay") {
    return path.join(process.cwd(), "public", "uploads", "stay", safeFileName);
  }

  return path.join(process.cwd(), "public", "uploads", "videos", safeFileName);
}

export async function deleteManagedStorageAssets(assetUrls: string[]) {
  const supabaseObjects: SupabaseStorageObjectRef[] = [];
  const localFilePaths = new Set<string>();

  for (const assetUrl of assetUrls.filter(Boolean)) {
    const supabaseObject = parseSupabasePublicStorageUrl(assetUrl);

    if (supabaseObject) {
      supabaseObjects.push(supabaseObject);
      continue;
    }

    const localFilePath = resolveLocalUploadFilePath(assetUrl);

    if (localFilePath) {
      localFilePaths.add(localFilePath);
    }
  }

  await deleteSupabaseStorageObjects(supabaseObjects);

  await Promise.all(
    [...localFilePaths].map(async (filePath) => {
      await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") {
          throw error;
        }
      });
    }),
  );
}
