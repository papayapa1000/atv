import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin dashboard shows Supabase storage usage and available capacity", () => {
  const dashboardSource = readFileSync("src/app/admin/dashboard/page.tsx", "utf8");
  const storageUsageSource = readFileSync("src/lib/supabase/storage-usage.ts", "utf8");

  assert.equal(dashboardSource.includes("getSupabaseStorageUsageSummary"), true);
  assert.equal(dashboardSource.includes("Supabase Storage"), true);
  assert.equal(dashboardSource.includes("사용 가능 용량"), true);
  assert.equal(dashboardSource.includes("갤러리 게시판 이미지 용량"), true);
  assert.equal(dashboardSource.includes("자랑하기 게시판 이미지 용량"), true);
  assert.equal(dashboardSource.includes("주변 숙박 이미지 용량"), true);
  assert.equal(dashboardSource.includes("동영상 게시판 영상 용량"), true);
  assert.equal(dashboardSource.includes("용량 기준:"), false);
  assert.equal(dashboardSource.includes("export const dynamic = \"force-dynamic\""), true);
  assert.equal(dashboardSource.includes("로컬 fallback 업로드"), false);
  assert.equal(dashboardSource.includes("스토리지 사용량을 확인하지 못했습니다"), true);
  assert.equal(storageUsageSource.includes("SUPABASE_STORAGE_QUOTA_GB"), true);
  assert.equal(storageUsageSource.includes("const defaultStorageQuotaGb = 100"), true);
  assert.equal(storageUsageSource.includes("Supabase Pro 기본 100GB"), true);
  assert.equal(storageUsageSource.includes("getManagedStorageBucketNames"), true);
  assert.equal(storageUsageSource.includes("SUPABASE_GALLERY_IMAGES_BUCKET"), true);
  assert.equal(storageUsageSource.includes("SUPABASE_SHOWCASE_IMAGES_BUCKET"), true);
  assert.equal(storageUsageSource.includes("SUPABASE_STAY_IMAGES_BUCKET"), true);
  assert.equal(storageUsageSource.includes("SUPABASE_VIDEO_FILES_BUCKET"), true);
  assert.equal(storageUsageSource.includes("/object/list/"), true);
  assert.equal(storageUsageSource.includes("/bucket"), true);
  assert.equal(storageUsageSource.includes("listBucketUsageOrEmpty"), true);
  assert.equal(storageUsageSource.includes("getLocalFallbackUploadUsage"), false);
});

test("admin post delete actions remove related storage assets", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const storageAssetSource = readFileSync("src/lib/supabase/storage-assets.ts", "utf8");
  const galleryRepositorySource = readFileSync("src/lib/gallery/repository.ts", "utf8");
  const showcaseRepositorySource = readFileSync("src/lib/showcase/repository.ts", "utf8");
  const stayRepositorySource = readFileSync("src/lib/stay/repository.ts", "utf8");
  const videoRepositorySource = readFileSync("src/lib/videos/repository.ts", "utf8");

  assert.equal(actionSource.includes("deleteManagedStorageAssets"), true);
  assert.equal(actionSource.includes("deleteManagedStorageAssets(deletedPost.imageUrls)"), true);
  assert.equal(actionSource.includes("deleteManagedStorageAssets(deletedVideo.videoUrl ? [deletedVideo.videoUrl] : [])"), true);
  assert.equal(actionSource.includes("revalidatePath(\"/admin/dashboard\")"), true);
  assert.equal(storageAssetSource.includes("deleteSupabaseStorageObjects"), true);
  assert.equal(storageAssetSource.includes("unlink("), true);
  assert.equal(storageAssetSource.includes("/uploads/gallery/"), true);
  assert.equal(storageAssetSource.includes("/uploads/showcase/"), true);
  assert.equal(storageAssetSource.includes("/uploads/stay/"), true);
  assert.equal(storageAssetSource.includes("/uploads/videos/"), true);
  assert.equal(galleryRepositorySource.includes("Prefer: \"return=representation\""), true);
  assert.equal(showcaseRepositorySource.includes("Prefer: \"return=representation\""), true);
  assert.equal(stayRepositorySource.includes("Prefer: \"return=representation\""), true);
  assert.equal(videoRepositorySource.includes("Prefer: \"return=representation\""), true);
});
