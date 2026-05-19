"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { issueAdminSession, requireAdminSession, clearAdminSession } from "@/lib/admin/session";
import { deleteReservationPost, findAdminUser, updateReservationAdminFields } from "@/lib/admin/repository";
import { normalizeAdminReservationUpdate, validateAdminReservationUpdate } from "@/lib/admin/validation";
import { createGalleryPost } from "@/lib/gallery/repository";
import { saveUploadedGalleryImages } from "@/lib/gallery/uploads";
import { normalizeGalleryPostForm, validateGalleryPostForm } from "@/lib/gallery/validation";
import { createReservationReply } from "@/lib/reservations/repository";
import { deleteShowcasePost } from "@/lib/showcase/repository";
import { createStayPost } from "@/lib/stay/repository";
import { saveUploadedStayImages } from "@/lib/stay/uploads";
import { normalizeStayPostForm, validateStayPostForm } from "@/lib/stay/validation";
import { createVideoPost } from "@/lib/videos/repository";
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

  await deleteShowcasePost(id);

  revalidatePath("/showcase");
  revalidatePath("/admin/showcase");
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
  } catch {
    return {
      message: "갤러리 등록에 실패했습니다. Supabase 설정과 gallery_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/gallery?created=1");
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
  } catch {
    return {
      message: "숙박 정보 등록에 실패했습니다. Supabase 설정과 stay_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/stay?created=1");
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
  } catch {
    return {
      message: "동영상 등록에 실패했습니다. Supabase 설정과 video_posts 테이블을 확인해 주세요.",
      errors: {},
      values,
    };
  }

  redirect("/admin/videos?created=1");
}
