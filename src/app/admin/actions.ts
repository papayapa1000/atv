"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { issueAdminSession, requireAdminSession, clearAdminSession } from "@/lib/admin/session";
import { deleteReservationPost, findAdminUser, updateReservationAdminFields } from "@/lib/admin/repository";
import { normalizeAdminReservationUpdate, validateAdminReservationUpdate } from "@/lib/admin/validation";
import { createGalleryPost, deleteGalleryPost, updateGalleryPost } from "@/lib/gallery/repository";
import { saveUploadedGalleryImages } from "@/lib/gallery/uploads";
import { normalizeGalleryPostForm, validateGalleryPostForm } from "@/lib/gallery/validation";
import { createReservationReply } from "@/lib/reservations/repository";
import { deleteShowcasePost } from "@/lib/showcase/repository";
import { createStayPost, deleteStayPost, updateStayPost } from "@/lib/stay/repository";
import { saveUploadedStayImages } from "@/lib/stay/uploads";
import { normalizeStayPostForm, validateStayPostForm } from "@/lib/stay/validation";
import { isSupabaseStorageUploadLimitError } from "@/lib/supabase/storage";
import { deleteManagedStorageAssets } from "@/lib/supabase/storage-assets";
import { createVideoPost, deleteVideoPost, updateVideoPost } from "@/lib/videos/repository";
import { saveUploadedVideo } from "@/lib/videos/uploads";
import { normalizeVideoPostForm, validateVideoPostForm } from "@/lib/videos/validation";

export type AdminLoginState = {
  message: string;
};

export type AdminGalleryActionState = {
  message: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

export type AdminVideoActionState = {
  message: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

export type AdminStayActionState = {
  message: string;
  errors: Record<string, string>;
  values: Record<string, string>;
};

function readFormString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readFormStringList(values: FormDataEntryValue[]) {
  return values.map((value) => readFormString(value)).filter(Boolean);
}

function isUploadedFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

function readUploadedFiles(values: FormDataEntryValue[]) {
  return values.filter(isUploadedFile);
}

export async function loginAdminAction(_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const user = await findAdminUser();

  if (!user || password !== user.password) {
    return { message: "관리자 비밀번호가 올바르지 않습니다." };
  }

  await issueAdminSession(user.id);
  redirect("/admin/dashboard");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateAdminReservationAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const normalized = normalizeAdminReservationUpdate({
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
  });
  const result = validateAdminReservationUpdate(normalized);

  if (!id || !result.ok) {
    redirect("/admin/reservations?error=1");
  }

  await updateReservationAdminFields({
    id,
    status: result.data.status,
  });

  if (result.data.adminNote) {
    await createReservationReply({
      reservationId: id,
      authorType: "admin",
      message: result.data.adminNote,
    });
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/reservation/board");
  revalidatePath(`/reservation/board/${id}`);
  redirect("/admin/reservations?updated=1");
}

export async function deleteAdminReservationAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/reservations?error=1");
  }

  await deleteReservationPost(id);

  revalidatePath("/admin/reservations");
  revalidatePath("/reservation/board");
  revalidatePath(`/reservation/board/${id}`);
  redirect("/admin/reservations?deleted=1");
}

export async function deleteAdminShowcasePostAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/showcase?error=1");
  }

  const deletedPost = await deleteShowcasePost(id);

  if (deletedPost) {
    await deleteManagedStorageAssets(deletedPost.imageUrls);
  }

  revalidatePath("/showcase");
  revalidatePath("/admin/showcase");
  revalidatePath("/admin/dashboard");
  redirect("/admin/showcase?deleted=1");
}

export async function createAdminGalleryPostAction(
  _previousState: AdminGalleryActionState,
  formData: FormData,
): Promise<AdminGalleryActionState> {
  await requireAdminSession();

  const normalized = normalizeGalleryPostForm({
    title: formData.get("title"),
    content: formData.get("content"),
    imageFiles: formData.getAll("imageFiles"),
    isPublished: formData.get("isPublished"),
  });
  const values = {
    title: normalized.title,
    content: normalized.content,
    isPublished: normalized.isPublished ? "on" : "",
  };
  const result = validateGalleryPostForm(normalized);

  if (!result.ok) {
    return {
      message: "입력 내용을 확인해 주세요.",
      errors: result.errors,
      values,
    };
  }

  try {
    const { imageFiles, ...galleryData } = result.data;
    const imageUrls = await saveUploadedGalleryImages(imageFiles);
    const created = await createGalleryPost({
      ...galleryData,
      imageUrls,
    });

    revalidatePath("/gallery");
    if (created?.id) {
      revalidatePath(`/gallery/${created.id}`);
    }
    revalidatePath("/admin/gallery");
    revalidatePath("/admin/dashboard");
  } catch {
    return {
      message: "갤러리 등록에 실패했습니다. Supabase 설정과 gallery_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/gallery?created=1");
}

export async function updateAdminGalleryPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));
  const existingImageUrls = readFormStringList(formData.getAll("existingImageUrls"));
  const replacementImageFileEntries = formData.getAll("replacementImageFiles");
  const replacementImageFiles = readUploadedFiles(replacementImageFileEntries);
  const additionalImageFiles = readUploadedFiles(formData.getAll("imageFiles"));
  const submittedImageFiles = [...replacementImageFiles, ...additionalImageFiles];
  const normalized = normalizeGalleryPostForm({
    title: formData.get("title"),
    content: formData.get("content"),
    imageFiles: submittedImageFiles,
    isPublished: formData.get("isPublished"),
  });
  const finalImageCount = existingImageUrls.length + additionalImageFiles.length;
  const result = validateGalleryPostForm(normalized, {
    requireImages: finalImageCount === 0,
  });

  if (!id || finalImageCount > 8 || !result.ok) {
    redirect("/admin/gallery?error=1");
  }

  try {
    const galleryData = {
      title: result.data.title,
      content: result.data.content,
      isPublished: result.data.isPublished,
    };
    const replacementImageUrls = replacementImageFiles.length > 0 ? await saveUploadedGalleryImages(replacementImageFiles) : [];
    const additionalImageUrls = additionalImageFiles.length > 0 ? await saveUploadedGalleryImages(additionalImageFiles) : [];
    let replacementIndex = 0;
    const keptImageUrls = existingImageUrls.map((imageUrl, imageIndex) => {
      const replacementFile = replacementImageFileEntries[imageIndex];

      if (isUploadedFile(replacementFile)) {
        const replacementImageUrl = replacementImageUrls[replacementIndex];
        replacementIndex += 1;

        return replacementImageUrl;
      }

      return imageUrl;
    });
    const imageUrls = [...keptImageUrls, ...additionalImageUrls].filter(Boolean);

    if (imageUrls.length < 1) {
      throw new Error("Gallery post requires at least one image");
    }

    await updateGalleryPost({
      id,
      ...galleryData,
      imageUrls,
    });

    revalidatePath("/gallery");
    revalidatePath(`/gallery/${id}`);
    revalidatePath("/admin/gallery");
    revalidatePath("/admin/dashboard");
  } catch {
    redirect("/admin/gallery?error=1");
  }

  redirect("/admin/gallery?updated=1");
}

export async function deleteAdminGalleryPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));

  if (!id) {
    redirect("/admin/gallery?error=1");
  }

  try {
    const deletedPost = await deleteGalleryPost(id);

    if (deletedPost) {
      await deleteManagedStorageAssets(deletedPost.imageUrls);
    }

    revalidatePath("/gallery");
    revalidatePath(`/gallery/${id}`);
    revalidatePath("/admin/gallery");
    revalidatePath("/admin/dashboard");
  } catch {
    redirect("/admin/gallery?error=1");
  }

  redirect("/admin/gallery?deleted=1");
}

export async function createAdminStayPostAction(
  _previousState: AdminStayActionState,
  formData: FormData,
): Promise<AdminStayActionState> {
  await requireAdminSession();

  const normalized = normalizeStayPostForm({
    title: formData.get("title"),
    price: formData.get("price"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished"),
    imageFiles: formData.getAll("imageFiles"),
  });
  const values = {
    title: normalized.title,
    price: normalized.price,
    content: normalized.content,
    isPublished: normalized.isPublished ? "on" : "",
  };
  const result = validateStayPostForm(normalized);

  if (!result.ok) {
    return {
      message: "입력 내용을 확인해 주세요.",
      errors: result.errors,
      values,
    };
  }

  try {
    const { imageFiles, ...stayData } = result.data;
    const imageUrls = await saveUploadedStayImages(imageFiles);
    const created = await createStayPost({
      ...stayData,
      imageUrls,
    });

    revalidatePath("/stay");
    if (created?.id) {
      revalidatePath(`/stay/${created.id}`);
    }
    revalidatePath("/admin/stay");
    revalidatePath("/admin/dashboard");
  } catch {
    return {
      message: "숙박 정보 등록에 실패했습니다. Supabase 설정과 stay_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/stay?created=1");
}

export async function updateAdminStayPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));
  const existingImageUrls = readFormStringList(formData.getAll("existingImageUrls"));
  const replacementImageFileEntries = formData.getAll("replacementImageFiles");
  const replacementImageFiles = readUploadedFiles(replacementImageFileEntries);
  const additionalImageFiles = readUploadedFiles(formData.getAll("imageFiles"));
  const submittedImageFiles = [...replacementImageFiles, ...additionalImageFiles];
  const normalized = normalizeStayPostForm({
    title: formData.get("title"),
    price: formData.get("price"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished"),
    imageFiles: submittedImageFiles,
  });
  const finalImageCount = existingImageUrls.length + additionalImageFiles.length;
  const result = validateStayPostForm(normalized, {
    requireImages: finalImageCount === 0,
  });

  if (!id || finalImageCount > 10 || !result.ok) {
    redirect("/admin/stay?error=1");
  }

  try {
    const stayData = {
      title: result.data.title,
      price: result.data.price,
      content: result.data.content,
      isPublished: result.data.isPublished,
    };
    const replacementImageUrls = replacementImageFiles.length > 0 ? await saveUploadedStayImages(replacementImageFiles) : [];
    const additionalImageUrls = additionalImageFiles.length > 0 ? await saveUploadedStayImages(additionalImageFiles) : [];
    let replacementIndex = 0;
    const keptImageUrls = existingImageUrls.map((imageUrl, imageIndex) => {
      const replacementFile = replacementImageFileEntries[imageIndex];

      if (isUploadedFile(replacementFile)) {
        const replacementImageUrl = replacementImageUrls[replacementIndex];
        replacementIndex += 1;

        return replacementImageUrl;
      }

      return imageUrl;
    });
    const imageUrls = [...keptImageUrls, ...additionalImageUrls].filter(Boolean);

    if (imageUrls.length < 1) {
      throw new Error("Stay post requires at least one image");
    }

    await updateStayPost({
      id,
      ...stayData,
      imageUrls,
    });

    revalidatePath("/stay");
    revalidatePath(`/stay/${id}`);
    revalidatePath("/admin/stay");
    revalidatePath("/admin/dashboard");
  } catch {
    redirect("/admin/stay?error=1");
  }

  redirect("/admin/stay?updated=1");
}

export async function deleteAdminStayPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));

  if (!id) {
    redirect("/admin/stay?error=1");
  }

  try {
    const deletedPost = await deleteStayPost(id);

    if (deletedPost) {
      await deleteManagedStorageAssets(deletedPost.imageUrls);
    }

    revalidatePath("/stay");
    revalidatePath(`/stay/${id}`);
    revalidatePath("/admin/stay");
    revalidatePath("/admin/dashboard");
  } catch {
    redirect("/admin/stay?error=1");
  }

  redirect("/admin/stay?deleted=1");
}

export async function createAdminVideoPostAction(
  _previousState: AdminVideoActionState,
  formData: FormData,
): Promise<AdminVideoActionState> {
  await requireAdminSession();

  const normalized = normalizeVideoPostForm({
    title: formData.get("title"),
    youtubeUrl: formData.get("youtubeUrl"),
    videoFile: formData.get("videoFile"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished"),
  });
  const values = {
    title: normalized.title,
    youtubeUrl: normalized.youtubeUrl,
    content: normalized.content,
    isPublished: normalized.isPublished ? "on" : "",
  };
  const result = validateVideoPostForm(normalized);

  if (!result.ok) {
    return {
      message: "입력 내용을 확인해 주세요.",
      errors: result.errors,
      values,
    };
  }

  try {
    const { videoFile, ...videoData } = result.data;
    const videoUrl = videoFile ? await saveUploadedVideo(videoFile) : null;
    const created = await createVideoPost({
      ...videoData,
      videoUrl,
    });

    revalidatePath("/videos");
    if (created?.id) {
      revalidatePath(`/videos/${created.id}`);
    }
    revalidatePath("/admin/videos");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    return {
      message: isSupabaseStorageUploadLimitError(error)
        ? "영상 파일이 현재 Supabase Storage 업로드 제한을 초과했습니다. 250MB 이하 파일로 압축한 뒤 등록해 주세요."
        : "동영상 등록에 실패했습니다. Supabase 설정과 video_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/videos?created=1");
}

export async function updateAdminVideoPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));
  const existingVideoUrl = readFormString(formData.get("existingVideoUrl"));
  const replacementVideoFile = formData.get("videoFile");
  const hasReplacementVideoFile = isUploadedFile(replacementVideoFile);
  const normalized = normalizeVideoPostForm({
    title: formData.get("title"),
    youtubeUrl: hasReplacementVideoFile ? "" : formData.get("youtubeUrl"),
    videoFile: replacementVideoFile,
    content: formData.get("content"),
    isPublished: formData.get("isPublished"),
  });
  const result = validateVideoPostForm(normalized, {
    allowMissingSource: Boolean(existingVideoUrl),
  });

  if (!id) {
    redirect("/admin/videos?error=missing-id");
  }

  if (!result.ok) {
    const errorCode = result.errors.videoFile
      ? "video-file"
      : result.errors.youtubeUrl
        ? "youtube-url"
        : result.errors.source
          ? "source"
          : "validation";

    redirect(`/admin/videos?error=${errorCode}`);
  }

  try {
    const { videoFile, ...videoData } = result.data;
    const videoUrl = videoFile ? await saveUploadedVideo(videoFile) : videoData.sourceType === "file" ? existingVideoUrl : null;

    if (videoData.sourceType === "file" && !videoUrl) {
      throw new Error("Video post requires an uploaded video URL");
    }

    await updateVideoPost({
      id,
      ...videoData,
      videoUrl,
    });

    revalidatePath("/videos");
    revalidatePath(`/videos/${id}`);
    revalidatePath("/admin/videos");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    redirect(`/admin/videos?error=${isSupabaseStorageUploadLimitError(error) ? "storage-limit" : "save"}`);
  }

  redirect("/admin/videos?updated=1");
}

export async function deleteAdminVideoPostAction(formData: FormData) {
  await requireAdminSession();

  const id = readFormString(formData.get("id"));

  if (!id) {
    redirect("/admin/videos?error=1");
  }

  try {
    const deletedVideo = await deleteVideoPost(id);

    if (deletedVideo) {
      await deleteManagedStorageAssets(deletedVideo.videoUrl ? [deletedVideo.videoUrl] : []);
    }

    revalidatePath("/videos");
    revalidatePath(`/videos/${id}`);
    revalidatePath("/admin/videos");
    revalidatePath("/admin/dashboard");
  } catch {
    redirect("/admin/videos?error=1");
  }

  redirect("/admin/videos?deleted=1");
}
