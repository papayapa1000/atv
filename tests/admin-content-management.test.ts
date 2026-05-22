import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("admin gallery posts can be updated and deleted from the gallery management page", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/gallery/repository.ts", "utf8");
  const pageSource = readFileSync("src/app/admin/gallery/page.tsx", "utf8");
  const editModalSource = readFileSync("src/components/admin/AdminGalleryPostEditModal.tsx", "utf8");
  const editImagesSource = readFileSync("src/components/admin/AdminGalleryEditImageFields.tsx", "utf8");
  const deleteConfirmSource = readFileSync("src/components/admin/AdminDeleteConfirmButton.tsx", "utf8");
  const scrollLockSource = readFileSync("src/components/admin/useBodyScrollLock.ts", "utf8");

  assert.equal(actionSource.includes("updateAdminGalleryPostAction"), true);
  assert.equal(actionSource.includes("deleteAdminGalleryPostAction"), true);
  assert.equal(actionSource.includes("updateGalleryPost"), true);
  assert.equal(actionSource.includes("deleteGalleryPost"), true);
  assert.equal(repositorySource.includes("export async function updateGalleryPost"), true);
  assert.equal(repositorySource.includes("export async function deleteGalleryPost"), true);
  assert.equal(pageSource.includes("AdminGalleryPostEditModal"), true);
  assert.equal(pageSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(pageSource.includes("<details"), false);
  assert.equal(editModalSource.includes("updateAdminGalleryPostAction"), true);
  assert.equal(editModalSource.includes("AdminGalleryEditImageFields"), true);
  assert.equal(editModalSource.includes('role="dialog"'), true);
  assert.equal(editImagesSource.includes('name="existingImageUrls"'), true);
  assert.equal(editImagesSource.includes('name="replacementImageFiles"'), true);
  assert.equal(editImagesSource.includes("기존 이미지 삭제"), true);
  assert.equal(editImagesSource.includes("이미지 변경"), true);
  assert.equal(editImagesSource.includes(">{image.url}</p>"), false);
  assert.equal(editImagesSource.includes("기존 이미지 {index + 1}"), true);
  assert.equal(actionSource.includes("replacementImageFiles"), true);
  assert.equal(deleteConfirmSource.includes('role="dialog"'), true);
  assert.equal(editModalSource.includes("useBodyScrollLock(open)"), true);
  assert.equal(deleteConfirmSource.includes("useBodyScrollLock(open)"), true);
  assert.equal(editModalSource.includes("createPortal("), true);
  assert.equal(editModalSource.includes("document.body"), true);
  assert.equal(deleteConfirmSource.includes("createPortal("), true);
  assert.equal(deleteConfirmSource.includes("document.body"), true);
  assert.equal(scrollLockSource.includes("document.body.style.overflow = \"hidden\""), true);
});

test("admin video posts can be updated and deleted from the video management page", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/videos/repository.ts", "utf8");
  const pageSource = readFileSync("src/app/admin/videos/page.tsx", "utf8");
  const editModalSource = readFileSync("src/components/admin/AdminVideoPostEditModal.tsx", "utf8");

  assert.equal(actionSource.includes("updateAdminVideoPostAction"), true);
  assert.equal(actionSource.includes("deleteAdminVideoPostAction"), true);
  assert.equal(actionSource.includes("updateVideoPost"), true);
  assert.equal(actionSource.includes("deleteVideoPost"), true);
  assert.equal(actionSource.includes("hasReplacementVideoFile || uploadedVideoUrl ? \"\" : formData.get(\"youtubeUrl\")"), true);
  assert.equal(actionSource.includes("\"video-file\""), true);
  assert.equal(actionSource.includes("\"storage-limit\""), true);
  assert.equal(repositorySource.includes("export async function updateVideoPost"), true);
  assert.equal(repositorySource.includes("export async function deleteVideoPost"), true);
  assert.equal(pageSource.includes("getAdminVideoErrorMessage"), true);
  assert.equal(pageSource.includes("영상 파일은 250MB 이하"), true);
  assert.equal(pageSource.includes("영상 저장 중 오류가 발생했습니다"), true);
  assert.equal(pageSource.includes("AdminVideoPostEditModal"), true);
  assert.equal(pageSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(pageSource.includes("<details"), false);
  assert.equal(editModalSource.includes("updateAdminVideoPostAction"), true);
  assert.equal(editModalSource.includes('name="existingVideoUrl"'), true);
  assert.equal(editModalSource.includes("AdminVideoFileReplacementField"), true);
  assert.equal(editModalSource.includes("getVideoFileName"), true);
  assert.equal(editModalSource.includes("useFormStatus"), true);
  assert.equal(editModalSource.includes('role="status"'), true);
  assert.equal(editModalSource.includes("영상 업로드 중입니다"), true);
  assert.equal(editModalSource.includes("업로드 중"), true);
  assert.equal(editModalSource.includes('role="dialog"'), true);
  assert.equal(editModalSource.includes("useBodyScrollLock(open)"), true);
  assert.equal(editModalSource.includes("createPortal("), true);
  assert.equal(editModalSource.includes("document.body"), true);
});

test("admin stay posts can be updated and deleted from the stay management page", () => {
  const actionSource = readFileSync("src/app/admin/actions.ts", "utf8");
  const repositorySource = readFileSync("src/lib/stay/repository.ts", "utf8");
  const localStoreSource = readFileSync("src/lib/stay/local-store.ts", "utf8");
  const pageSource = readFileSync("src/app/admin/stay/page.tsx", "utf8");
  const editModalSource = readFileSync("src/components/admin/AdminStayPostEditModal.tsx", "utf8");
  const editImagesSource = readFileSync("src/components/admin/AdminGalleryEditImageFields.tsx", "utf8");
  const stayUpdateSource = actionSource.slice(
    actionSource.indexOf("export async function updateAdminStayPostAction"),
    actionSource.indexOf("export async function deleteAdminStayPostAction"),
  );

  assert.equal(actionSource.includes("updateAdminStayPostAction"), true);
  assert.equal(actionSource.includes("deleteAdminStayPostAction"), true);
  assert.equal(actionSource.includes("updateStayPost"), true);
  assert.equal(actionSource.includes("deleteStayPost"), true);
  assert.equal(repositorySource.includes("export async function updateStayPost"), true);
  assert.equal(repositorySource.includes("export async function deleteStayPost"), true);
  assert.equal(localStoreSource.includes("updateLocalStayPost"), true);
  assert.equal(localStoreSource.includes("deleteLocalStayPost"), true);
  assert.equal(pageSource.includes("AdminStayPostEditModal"), true);
  assert.equal(pageSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(pageSource.includes("<details"), false);
  assert.equal(editModalSource.includes("updateAdminStayPostAction"), true);
  assert.equal(editModalSource.includes("AdminGalleryEditImageFields"), true);
  assert.equal(editModalSource.includes("maxImageFileCount={10}"), true);
  assert.equal(editImagesSource.includes("maxImageFileCount?: number"), true);
  assert.equal(stayUpdateSource.includes("replacementImageFiles"), true);
  assert.equal(stayUpdateSource.includes("additionalImageFiles"), true);
  assert.equal(stayUpdateSource.includes("replacementImageUrls"), true);
  assert.equal(stayUpdateSource.includes("finalImageCount > 10"), true);
  assert.equal(editModalSource.includes('role="dialog"'), true);
  assert.equal(editModalSource.includes("useBodyScrollLock(open)"), true);
  assert.equal(editModalSource.includes("createPortal("), true);
  assert.equal(editModalSource.includes("document.body"), true);
});

test("admin delete actions use a reusable confirmation modal", () => {
  const reservationSource = readFileSync("src/components/admin/AdminReservationDeleteForm.tsx", "utf8");
  const showcasePageSource = readFileSync("src/app/admin/showcase/page.tsx", "utf8");
  const confirmSource = readFileSync("src/components/admin/AdminDeleteConfirmButton.tsx", "utf8");

  assert.equal(reservationSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(reservationSource.includes("window.confirm"), false);
  assert.equal(showcasePageSource.includes("AdminDeleteConfirmButton"), true);
  assert.equal(confirmSource.includes("setOpen(true)"), true);
  assert.equal(confirmSource.includes("삭제 확인"), true);
});
